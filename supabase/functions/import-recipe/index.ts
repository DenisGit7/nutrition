// Supabase Edge Function: import-recipe
// Turns a link (Instagram / Facebook / TikTok / YouTube / recipe website), pasted caption text
// and/or screenshots into a recipe, using Google Gemini (free tier).
//
// Secrets (Supabase → Edge Functions → Secrets):
//   GEMINI_API_KEY   required — from https://aistudio.google.com/apikey
//   GEMINI_MODEL     optional — override the model, e.g. "gemini-3.6-flash"
//
// Requests (POST, JSON), all with lang: "en" | "he":
//   { mode:"recipe",    url?, text?, images?: [{mime,data(base64)}], audio?: {mime,data} }  -> { recipe }
//   { mode:"find", q, mine:{products:[…],recipes:[…]} }  -> { mine:[ids], results:[{type:"product"|"recipe",…}] }
//   { mode:"cooked", recipes:[{name,servings,steps,ingredients:[{name,amount,grams}]}] }  -> { recipes:[{cooked_g}] }
//   { mode:"nutrition", ingredients:[{name,qty,unit,grams?}] }  -> { ingredients:[{grams,kcal,protein,carbs,fat}] }
//   { mode:"translate", recipe: {name, ingredients, steps, notes, tags} }                      -> { recipe }
//   { mode:"product",   images?, text? }  (photo of a package / nutrition label)               -> { product }
//   { mode:"suggest",   q, count?: 1-3, have?: [product names] }  (ask for recipe ideas)    -> { recipes }
//   { mode:"off_search", q }  /  { mode:"off_barcode", code }   (Open Food Facts lookup)       -> { products }
// Errors: { error, message }

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// Tried in order; the first that answers wins. Google retires model names over time, so when these are gone
// the function also follows Google's "use models/… instead" hint and asks Google which flash models exist.
const MODELS = [
  Deno.env.get("GEMINI_MODEL"),
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
].filter(Boolean) as string[];
let goodModel = "";
const noThinkCfg = new Set<string>();   // remembered while this function instance stays warm

// newest "flash" models this key can use (stable before preview, full before lite)
async function discoverModels(key: string): Promise<string[]> {
  try {
    const r = await fetch(`${GEMINI_BASE}/models?pageSize=200`, { headers: { "x-goog-api-key": key } });
    if (!r.ok) return [];
    const d = await r.json();
    const names = (d.models || [])
      .filter((m: any) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m: any) => String(m.name || "").replace(/^models\//, ""))
      .filter((n: string) => /^gemini-[\d.]+-flash/.test(n) && !/tts|image|live|audio|embed|thinking/i.test(n));
    const ver = (n: string) => parseFloat((n.match(/^gemini-([\d.]+)/) || [])[1] || "0");
    const rank = (n: string) => (/preview|exp/i.test(n) ? 2 : 0) + (/lite/i.test(n) ? 1 : 0);
    return names.sort((a: string, b: string) => rank(a) - rank(b) || ver(b) - ver(a)).slice(0, 6);
  } catch { return []; }
}
const GEMINI_BASE = Deno.env.get("GEMINI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta";

const MAX_IMAGES = 12;          // screenshots or frames taken from a video
const MAX_AUDIO_B64 = 6_000_000; // ~4.5 MB of audio
const MAX_TEXT = 12000;

// ---------- auth: only signed-in users of this project may call it ----------
async function signedIn(req: Request): Promise<boolean> {
  if (Deno.env.get("SKIP_AUTH") === "1") return true; // local tests only
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || req.headers.get("apikey") || "";
  if (!token || !url) return false;
  try {
    const r = await fetch(`${url}/auth/v1/user`, { headers: { Authorization: `Bearer ${token}`, apikey: key } });
    return r.ok;
  } catch { return false; }
}

// ---------- reading the link ----------
function youtubeUrl(u: URL): string | null {
  const h = u.hostname.replace(/^www\.|^m\./, "");
  let id = "";
  if (h === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (h.endsWith("youtube.com")) {
    if (u.pathname === "/watch") id = u.searchParams.get("v") || "";
    else { const m = u.pathname.match(/^\/(shorts|live|embed)\/([^/?#]+)/); if (m) id = m[2]; }
  }
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

const decodeEntities = (s: string) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

function meta(html: string, names: string[]): string {
  for (const n of names) {
    const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${n}["'][^>]*content=["']([^"']*)["']`, "i");
    const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${n}["']`, "i");
    const m = html.match(re1) || html.match(re2);
    if (m && m[1].trim()) return decodeEntities(m[1].trim());
  }
  return "";
}

// schema.org Recipe from recipe websites (most of them publish it)
function jsonLdRecipes(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const walk = (o: any) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    const t = o["@type"];
    if (t === "Recipe" || (Array.isArray(t) && t.includes("Recipe"))) out.push(o);
    if (o["@graph"]) walk(o["@graph"]);
  };
  while ((m = re.exec(html))) { try { walk(JSON.parse(m[1].trim())); } catch { /* ignore */ } }
  return out;
}

function visibleText(html: string): string {
  return decodeEntities(html
    .replace(/<(script|style|noscript|svg|head)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|li|h\d|div|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

// picture of the dish: from the page's preview image or the recipe data
function jsonLdImage(r: any): string {
  let im = r?.image; if (Array.isArray(im)) im = im[0];
  if (im && typeof im === "object") im = im.url || im.contentUrl || "";
  return typeof im === "string" ? im : "";
}
async function fetchImage(url: string): Promise<{ mime: string; data: string } | null> {
  if (!/^https?:\/\//.test(url)) return null;
  try {
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 10000);
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; NutritionApp/1.5)" }, signal: ctrl.signal });
    clearTimeout(timer);
    const mime = (r.headers.get("content-type") || "").split(";")[0].trim();
    if (!r.ok || !/^image\/(jpeg|png|webp|gif)$/.test(mime)) return null;
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf.length < 2000 || buf.length > 4_000_000) return null;
    let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { mime, data: btoa(bin) };
  } catch { return null; }
}

async function fetchPage(url: string): Promise<{ ok: boolean; info: string; image?: string }> {
  const social = /instagram\.com|facebook\.com|fb\.watch|tiktok\.com|threads\.net|x\.com|twitter\.com/i.test(url);
  // Social sites show the post caption to link-preview crawlers; recipe sites prefer a normal browser.
  const agents = social
    ? ["facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"]
    : ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"];
  for (const ua of agents) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const r = await fetch(url, { headers: { "User-Agent": ua, "Accept-Language": "he,en;q=0.8" }, redirect: "follow", signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok) continue;
      const html = (await r.text()).slice(0, 2_000_000);
      const title = meta(html, ["og:title", "twitter:title"]) || (html.match(/<title[^>]*>([^<]*)/i)?.[1] || "").trim();
      const desc = meta(html, ["og:description", "twitter:description", "description"]);
      const recipes = jsonLdRecipes(html);
      const image = (recipes.length && jsonLdImage(recipes[0])) || meta(html, ["og:image", "og:image:secure_url", "twitter:image"]);
      let info = "";
      if (title) info += `Page title: ${title}\n`;
      if (desc) info += `Post caption / description: ${desc}\n`;
      if (recipes.length) info += `Structured recipe data from the page (schema.org JSON-LD):\n${JSON.stringify(recipes[0]).slice(0, MAX_TEXT)}\n`;
      else if (!social) info += `Page text:\n${visibleText(html).slice(0, MAX_TEXT)}\n`;
      if (info.trim().length > 40 || image) return { ok: info.trim().length > 40, info, image: image ? new URL(image, url).toString() : "" };
    } catch { /* try next agent */ }
  }
  return { ok: false, info: "" };
}

// ---------- Gemini ----------
function prompt(lang: string, hasYoutube: boolean): string {
  const language = lang === "he" ? "Hebrew" : "English";
  return `You extract a cooking recipe from the material provided (post caption, web page data, screenshots or frames from a video, the video's soundtrack${hasYoutube ? ", and the YouTube video — watch it and listen to it" : ""}). Combine everything: text shown on screen, what the cook says, and the caption.

Reply with ONLY a JSON object, no markdown, in exactly this shape:
{
  "found": true,
  "name": "short recipe name",
  "servings": 2,
  "time": 25,
  "cooked_g": 450,
  "tags": ["breakfast", "quick"],
  "ingredients": [{"name": "Eggs", "amount": "4", "grams": 200, "kcal": 286, "protein": 25, "carbs": 1.4, "fat": 19}],
  "protein": 14, "carbs": 12, "fat": 11,
  "steps": ["Short step", "Short step"],
  "notes": ""
}

Rules:
- Write name, ingredient names, amounts, tags, steps and notes in ${language}. Keep numbers as digits.
- "amount" includes the unit (e.g. "200 g", "2 tbsp", "1 cup"). If no amount is given, estimate a sensible one and say so in notes.
- For every ingredient line give "grams" = realistic weight in grams of that amount (dry foods weigh less than water: 1/2 cup rolled oats ≈ 40 g, 1 cup flour ≈ 125 g, 1 tsp cinnamon ≈ 2.6 g; liquids 1 cup ≈ 240 g),
  and "kcal", "protein", "carbs", "fat" for that line in that amount (numbers, from standard nutrition tables). Never leave them empty.
- protein / carbs / fat = estimated grams PER SERVING (numbers). servings = how many portions the recipe makes (estimate if missing). time = total minutes or null.
- "cooked_g" = realistic total weight in grams of the whole finished dish after cooking (grains and legumes absorb water and get heavier, e.g. 100 g dry lentils → ~250 g cooked; meat and vegetables lose water, e.g. 500 g raw chicken → ~375 g cooked; drained cooking water is not included).
- Steps: short and clear, one action each, at most 10 steps.
- 1 to 4 short tags (meal type, main ingredient, diet).
- If there is no recipe in the material, reply {"found": false, "reason": "one short sentence in ${language} saying what is missing"}.`;
}

function translatePrompt(lang: string, recipe: unknown): string {
  const language = lang === "he" ? "Hebrew" : "English";
  return `Translate this recipe into natural ${language} as used in home cooking. Keep the exact JSON structure and keys, keep all numbers and units (translate unit words, e.g. "cup" -> "כוס", "tbsp" -> "כף"), keep "kcal" values unchanged. Do not add or remove items. Reply with ONLY the JSON.

${JSON.stringify(recipe)}`;
}

function suggestPrompt(lang: string, q: string, count: number, have: string[]): string {
  const language = lang === "he" ? "Hebrew" : "English";
  return `The user asks: "${q.replace(/"/g, "'")}"
Answer with ${count} different practical home recipe${count > 1 ? "s" : ""} that answer the question (e.g. different cooking methods or flavours${count > 1 ? ", from simplest to more special" : ""}).
${have.length ? `The household already has these products — prefer them when they fit, but don't force them: ${have.join(", ")}.
` : ""}
Reply with ONLY a JSON object:
{"recipes": [ {
  "name": "short name",
  "summary": "one short sentence on what makes this variant different",
  "servings": 2, "time": 30, "cooked_g": 600,
  "tags": ["lunch", "vegan"],
  "ingredients": [{"name": "Brown lentils", "amount": "1 cup", "grams": 190, "kcal": 670, "protein": 48, "carbs": 114, "fat": 2}],
  "protein": 18, "carbs": 45, "fat": 6,
  "steps": ["Short step", "Short step"],
  "notes": "useful tip (soaking, storage, substitutions) or empty"
} ]}
Rules: write everything in ${language}; numbers as digits. "amount" includes units, preferably grams in brackets for dry foods.
For every ingredient line: "grams" = realistic weight of that amount (1/2 cup rolled oats ≈ 40 g, 1 cup flour ≈ 125 g, liquids 1 cup ≈ 240 g), and "kcal", "protein", "carbs", "fat" for that line (from standard nutrition tables).
Recipe-level protein/carbs/fat = grams PER SERVING.
- "cooked_g" = realistic total weight in grams of the whole finished dish after cooking (grains and legumes absorb water and get heavier, e.g. 100 g dry lentils → ~250 g cooked; meat and vegetables lose water, e.g. 500 g raw chicken → ~375 g cooked; drained cooking water is not included).
Steps short and clear, one action each, at most 10. 1-4 tags.
If the question is not about food or cooking, reply {"recipes": [], "reason": "short sentence in ${language}"}.`;
}

function findPrompt(lang: string, q: string, mine: unknown, count: number): string {
  const language = lang === "he" ? "Hebrew" : "English";
  return `The user asks a nutrition app: "${q.replace(/"/g, "'")}"
It can be a cooking question ("how to cook brown lentils"), a name, a description, or nutrition values (e.g. "high protein yogurt", "dinner under 400 kcal with 30 g protein", "low carb snack").
If it is a cooking question or asks for a specific dish, the NEW items are exactly ${count} different recipe${count > 1 ? "s" : ""} for it (different methods or flavours, simplest first), preferring the user's saved products when they fit.

1) From the user's saved items below, list the ids that match the search (respect any value limits: products use values per 100 g, recipes per serving). Empty list if none.
2) Otherwise suggest up to ${Math.max(count, 3)} NEW items that answer the search. Each is either:
   - "product": a single food or a packaged product you buy (e.g. Greek yogurt 0%, almonds, a protein bar brand). Values per 100 g (or 100 ml for drinks). Prefer products sold in Israel when the user writes Hebrew.
   - "recipe": a dish you cook from several ingredients.
   Decide the type by what the user asks for; mixing both is fine. Respect value limits in the search.
Reply with ONLY a JSON object:
{"mine": ["id1"],
 "results": [
  {"type": "product", "name": "Greek yogurt 0%", "brand": "", "unit": "g", "serving_g": 150, "serving_name": "cup",
   "kcal": 59, "protein": 10, "carbs": 3.6, "fat": 0.4, "sugar": 3.2, "fiber": 0, "why": "one short sentence"},
  {"type": "recipe", "name": "short name", "why": "one short sentence", "servings": 2, "time": 20, "cooked_g": 520, "tags": ["dinner"],
   "ingredients": [{"name": "Chicken breast", "amount": "300 g", "grams": 300, "kcal": 495, "protein": 93, "carbs": 0, "fat": 11}],
   "protein": 48, "carbs": 30, "fat": 8, "steps": ["Short step"], "notes": ""}
 ]}
Rules: write names and text in ${language}; numbers as digits; standard nutrition tables (USDA-like) for values.
Recipes: "cooked_g" = total weight of the finished dish after cooking (grains/legumes gain water, meat/vegetables lose water). Every ingredient line has realistic "grams" and "kcal", "protein", "carbs", "fat" for that line; recipe-level protein/carbs/fat per serving; steps short, at most 10.
If the search is not about food, reply {"mine": [], "results": [], "reason": "short sentence in ${language}"}.

Saved items (JSON): ${JSON.stringify(mine)}`;
}

function cookedPrompt(list: unknown): string {
  return `For each recipe below, estimate the realistic total weight in grams of the whole finished dish after cooking, as it would be weighed on a plate scale.
Grains and legumes absorb water and get heavier (100 g dry lentils → ~250 g cooked, 100 g dry rice → ~300 g cooked); meat, fish and vegetables lose water when cooked (500 g raw chicken breast → ~375 g, air-fried or roasted vegetables lose 20–40%). Drained cooking water is not included; water absorbed is.
Ingredient "grams" are raw weights. Reply with ONLY a JSON object, same order and count as the input:
{"recipes": [{"cooked_g": 600}]}

${JSON.stringify(list)}`;
}

function nutritionPrompt(list: unknown): string {
  return `For each ingredient line below, give its realistic weight in grams and its nutrition for that amount, using standard nutrition tables (USDA-like values).
Dry foods weigh less than water: 1/2 cup rolled oats ≈ 40 g, 1 cup flour ≈ 125 g, 1 tbsp honey ≈ 21 g, 1 tsp cinnamon ≈ 2.6 g; liquids 1 cup ≈ 240 g.
If "grams" is given and is realistic for that amount, keep it; if it is clearly wrong (e.g. 1/2 cup oats given as 120 g), return the correct weight. Water, salt and plain spices can be ~0 kcal.
Reply with ONLY a JSON object, same order and count as the input:
{"ingredients": [{"grams": 40, "kcal": 152, "protein": 5.3, "carbs": 27, "fat": 2.6}]}

${JSON.stringify(list)}`;
}

function productPrompt(lang: string): string {
  const language = lang === "he" ? "Hebrew" : "English";
  return `The images/text show a food product (package front, nutrition facts label, or both). Read the label carefully.
Reply with ONLY a JSON object:
{
  "found": true,
  "name": "product name as a shopper would say it, in ${language} (keep the brand's own product name if that is what people use)",
  "brand": "brand or empty",
  "barcode": "digits under the barcode if visible, else empty",
  "category": "short category in ${language}, e.g. dairy, bread, snack",
  "unit": "g" or "ml",
  "serving_g": grams or ml in one serving / piece if printed (number) or null,
  "serving_name": "serving word in ${language} (e.g. slice, cup, bar) or empty",
  "per100": {"kcal": number, "protein": number, "carbs": number, "fat": number, "sugar": number or null, "fiber": number or null}
}
Rules: values are per 100 g (or 100 ml). If the label only gives values per serving, convert to per 100 using the serving size. If energy is only in kJ, divide by 4.184.
If there is no nutrition label, estimate typical values for this kind of product and add "estimated": true.
If the picture is not a food product, reply {"found": false, "reason": "short sentence in ${language}"}.`;
}

// ---------- Open Food Facts (free product database) ----------
const OFF_UA = "NutritionFamilyApp/1.5 (github.com/DenisGit7/nutrition)";
function offProduct(p: any, lang: string) {
  const n = p?.nutriments || {};
  const num = (v: any) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? null : Math.round(Number(v) * 10) / 10);
  let kcal = num(n["energy-kcal_100g"] ?? n["energy_kcal_100g"]);
  if (kcal == null && n["energy_100g"] != null) kcal = num(Number(n["energy_100g"]) / 4.184);
  const names = [lang === "he" ? p.product_name_he : p.product_name_en, p.product_name, p.product_name_he, p.product_name_en, p.generic_name];
  const name = names.map((x: any) => (Array.isArray(x) ? x[0] : x)).find((x: any) => x && String(x).trim());
  const brand = Array.isArray(p.brands) ? p.brands.join(", ") : (p.brands || "");
  const servingMatch = String(p.serving_size || "").match(/([\d.,]+)\s*(g|ml)/i);
  return {
    name: name ? String(name).trim() : "", brand: String(brand).split(",")[0].trim(), barcode: String(p.code || ""),
    unit: /ml|l\b/i.test(String(p.quantity || "")) && !/g\b/i.test(String(p.quantity || "")) ? "ml" : "g",
    serving_g: servingMatch ? Number(servingMatch[1].replace(",", ".")) : null, serving_name: "",
    kcal, protein: num(n.proteins_100g), carbs: num(n.carbohydrates_100g), fat: num(n.fat_100g),
    sugar: num(n.sugars_100g), fiber: num(n.fiber_100g), source: "openfoodfacts",
    image: String(p.image_front_small_url || p.image_small_url || p.image_front_url || p.image_url || "").replace(/^http:/, "https:"),
  };
}
async function offFetch(url: string): Promise<any> {
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 12000);
  try { const r = await fetch(url, { headers: { "User-Agent": OFF_UA }, signal: ctrl.signal }); return r.ok ? await r.json() : null; }
  catch { return null; } finally { clearTimeout(timer); }
}
const OFF_FIELDS = "code,product_name,product_name_he,product_name_en,generic_name,brands,nutriments,serving_size,quantity,image_front_small_url,image_front_url,image_small_url,image_url";
const OFF_SEARCH = Deno.env.get("OFF_SEARCH_URL") || "https://search.openfoodfacts.org/search";
const OFF_WORLD = Deno.env.get("OFF_WORLD_URL") || "https://world.openfoodfacts.org";
async function offSearch(q: string, lang: string) {
  let list: any[] = [];
  const a = await offFetch(`${OFF_SEARCH}?q=${encodeURIComponent(q)}&page_size=25&langs=${lang},en&fields=${OFF_FIELDS}`);
  if (a && Array.isArray(a.hits)) list = a.hits;
  if (!list.length) {
    const b = await offFetch(`${OFF_WORLD}/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=25&fields=${OFF_FIELDS}`);
    if (b && Array.isArray(b.products)) list = b.products;
  }
  return list.map((p) => offProduct(p, lang)).filter((p) => p.name && p.kcal != null).slice(0, 20);
}
async function offBarcode(code: string, lang: string) {
  const d = await offFetch(`${OFF_WORLD}/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`);
  if (!d || !d.product) return [];
  const p = offProduct({ code, ...d.product }, lang);
  return p.name ? [p] : [];
}

function ingMacros(i: any) {
  const n = (v: any) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? undefined : Math.round(Number(v) * 10) / 10);
  const o: Record<string, number> = {};
  for (const k of ["grams", "protein", "carbs", "fat"]) { const v = n(i?.[k]); if (v !== undefined) o[k] = v; }
  return o;
}

async function callGemini(key: string, parts: unknown[]): Promise<any> {
  let lastErr = "", discovered = false;
  const queue = [...new Set([goodModel, ...MODELS].filter(Boolean))];
  const tried = new Set<string>();
  while (true) {
    let model = queue.shift();
    if (!model) {
      if (discovered) break;
      discovered = true;
      queue.push(...(await discoverModels(key)).filter((m) => !tried.has(m)));
      model = queue.shift();
      if (!model) break;
    }
    if (tried.has(model)) continue;
    tried.add(model);
    // less "thinking" = faster answers and fewer free-tier limits; older models without this option get it without
    const ask = (think: boolean) => fetch(`${GEMINI_BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: AbortSignal.timeout(100_000),
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2,
          ...(think && !noThinkCfg.has(model) ? { thinkingConfig: { thinkingLevel: "low" } } : {}) },
      }),
    });
    let r: Response;
    try { r = await ask(true); } catch (e) { lastErr = `${model}: ${String(e).slice(0, 120)}`; continue; }
    let body = await r.text();
    if (r.status === 400 && /thinking/i.test(body)) {
      noThinkCfg.add(model);
      try { r = await ask(false); } catch (e) { lastErr = `${model}: ${String(e).slice(0, 120)}`; continue; }
      body = await r.text();
    }
    if (r.ok) {
      goodModel = model;
      const data = JSON.parse(body);
      const txt = (data?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
      if (!txt) { lastErr = `${model}: empty answer`; continue; }
      const clean = txt.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
      try { return JSON.parse(clean); }
      catch { const m = clean.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); lastErr = `${model}: unreadable answer`; continue; }
    }
    lastErr = `${model}: ${r.status} ${body.slice(0, 200)}`;
    // Google often names the replacement: "Please update your code to use models/gemini-x-flash"
    const hint = body.match(/use (?:models\/)?(gemini-[\w.-]+)/i);
    if (hint && !tried.has(hint[1])) queue.unshift(hint[1].replace(/[.,]+$/, ""));
    // 404 = model name not available, 429 = free quota for this model used up, 5xx = busy → try next model.
    if (![400, 404, 429, 500, 503].includes(r.status)) break;
    if (r.status === 400 && !/model|not found|not supported/i.test(body)) break;
  }
  throw new Error(lastErr || "Gemini did not answer");
}

// ---------- handler ----------
export async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method", message: "Use POST" }, 405);
  if (!(await signedIn(req))) return json({ error: "auth", message: "Please sign in again." }, 401);
  const key = Deno.env.get("GEMINI_API_KEY");
  let body: any;
  try { body = await req.json(); } catch { return json({ error: "input", message: "Bad request" }, 400); }
  const lang = body.lang === "he" ? "he" : "en";
  const mode = String(body.mode || "recipe");

  // --- product database lookups (no AI key needed) ---
  if (mode === "off_search" || mode === "off_barcode") {
    const q = String(body.q || body.code || "").trim().slice(0, 100);
    if (!q) return json({ products: [] });
    const products = mode === "off_barcode" ? await offBarcode(q.replace(/\D/g, ""), lang) : await offSearch(q, lang);
    return json({ products });
  }
  if (!key) return json({ error: "config", message: "GEMINI_API_KEY secret is missing in Supabase." }, 500);

  // --- recipe ideas from a question ---
  if (mode === "suggest") {
    const q = String(body.q || "").trim().slice(0, 300);
    if (!q) return json({ error: "empty", message: "Type what you'd like to cook." }, 422);
    const count = Math.min(3, Math.max(1, Number(body.count) || 3));
    const have = (Array.isArray(body.have) ? body.have : []).map((x: any) => String(x).slice(0, 60)).slice(0, 60);
    try {
      const out = await callGemini(key, [{ text: suggestPrompt(lang, q, count, have) }]);
      const list = (Array.isArray(out?.recipes) ? out.recipes : []).filter((r: any) => r && r.name).slice(0, count).map((r: any) => ({
        name: String(r.name).slice(0, 200), summary: String(r.summary || ""),
        servings: Number(r.servings) || 2, time: r.time == null || r.time === "" ? null : Number(r.time) || null, cooked_g: Number(r.cooked_g) > 0 ? Math.round(Number(r.cooked_g)) : null,
        tags: Array.isArray(r.tags) ? r.tags.map(String).slice(0, 6) : [],
        ingredients: (Array.isArray(r.ingredients) ? r.ingredients : []).map((i: any) => ({
          name: String(i?.name || "").trim(), amount: String(i?.amount ?? "").trim(),
          kcal: i?.kcal == null || i?.kcal === "" ? null : Math.round(Number(i.kcal)) || 0,
          ...ingMacros(i),
        })).filter((i: any) => i.name),
        protein: Number(r.protein) || null, carbs: Number(r.carbs) || null, fat: Number(r.fat) || null,
        steps: (Array.isArray(r.steps) ? r.steps : []).map((x: any) => String(x).trim()).filter(Boolean),
        notes: String(r.notes || ""),
      }));
      if (!list.length) return json({ error: "no_recipe", message: out?.reason || "No recipes found — try asking differently." }, 422);
      return json({ recipes: list });
    } catch (e) { return aiError(e); }
  }

  // --- search: the user's own items + new products / recipes, by description or values ---
  if (mode === "find") {
    const q = String(body.q || "").trim().slice(0, 300);
    if (!q) return json({ error: "empty", message: "Type what you are looking for." }, 422);
    const n = (v: any) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? null : Math.round(Number(v) * 10) / 10);
    const m = body.mine || {};
    const mine = {
      products: (Array.isArray(m.products) ? m.products : []).slice(0, 150).map((p: any) => ({ id: String(p.id).slice(0, 40), name: String(p.name || "").slice(0, 80), brand: String(p.brand || "").slice(0, 40), kcal: n(p.kcal), protein: n(p.protein), carbs: n(p.carbs), fat: n(p.fat) })),
      recipes: (Array.isArray(m.recipes) ? m.recipes : []).slice(0, 150).map((r: any) => ({ id: String(r.id).slice(0, 40), name: String(r.name || "").slice(0, 80), tags: (Array.isArray(r.tags) ? r.tags : []).slice(0, 5).map(String), kcal: n(r.kcal), protein: n(r.protein), carbs: n(r.carbs), fat: n(r.fat) })),
    };
    const ids = new Set([...mine.products, ...mine.recipes].map((x) => x.id));
    try {
      const count = Math.min(3, Math.max(1, Number(body.count) || 3));
      const out = await callGemini(key, [{ text: findPrompt(lang, q, mine, count) }]);
      const results = (Array.isArray(out?.results) ? out.results : []).filter((r: any) => r && r.name).slice(0, 6).map((r: any) => r.type === "product" ? {
        type: "product", name: String(r.name).slice(0, 200), brand: String(r.brand || ""), why: String(r.why || ""),
        unit: r.unit === "ml" ? "ml" : "g", serving_g: n(r.serving_g), serving_name: String(r.serving_name || ""),
        kcal: n(r.kcal), protein: n(r.protein), carbs: n(r.carbs), fat: n(r.fat), sugar: n(r.sugar), fiber: n(r.fiber), source: "ai",
      } : {
        type: "recipe", name: String(r.name).slice(0, 200), why: String(r.why || r.summary || ""),
        servings: Number(r.servings) || 2, time: r.time == null || r.time === "" ? null : Number(r.time) || null, cooked_g: Number(r.cooked_g) > 0 ? Math.round(Number(r.cooked_g)) : null,
        tags: Array.isArray(r.tags) ? r.tags.map(String).slice(0, 6) : [],
        ingredients: (Array.isArray(r.ingredients) ? r.ingredients : []).map((i: any) => ({
          name: String(i?.name || "").trim(), amount: String(i?.amount ?? "").trim(),
          kcal: i?.kcal == null || i?.kcal === "" ? null : Math.round(Number(i.kcal)) || 0,
          ...ingMacros(i),
        })).filter((i: any) => i.name),
        protein: n(r.protein), carbs: n(r.carbs), fat: n(r.fat),
        steps: (Array.isArray(r.steps) ? r.steps : []).map((x: any) => String(x).trim()).filter(Boolean),
        notes: String(r.notes || ""),
      });
      const mineIds = (Array.isArray(out?.mine) ? out.mine : []).map(String).filter((x: string) => ids.has(x));
      if (!results.length && !mineIds.length) return json({ error: "no_result", message: out?.reason || "Nothing found — try describing it differently." }, 422);
      return json({ mine: mineIds, results });
    } catch (e) { return aiError(e); }
  }

  // --- cooked weight of whole recipes (for logging cooked grams) ---
  if (mode === "cooked") {
    const list = (Array.isArray(body.recipes) ? body.recipes : []).slice(0, 25).map((r: any) => ({
      name: String(r?.name || "").slice(0, 120), servings: Number(r?.servings) || 1,
      steps: (Array.isArray(r?.steps) ? r.steps : []).slice(0, 10).map((x: any) => String(x).slice(0, 160)),
      ingredients: (Array.isArray(r?.ingredients) ? r.ingredients : []).slice(0, 40).map((i: any) => ({
        name: String(i?.name || "").slice(0, 80), amount: String(i?.amount || "").slice(0, 40), grams: i?.grams == null || i?.grams === "" ? null : Number(i.grams) })),
    }));
    if (!list.length) return json({ error: "empty", message: "No recipes." }, 422);
    try {
      const out = await callGemini(key, [{ text: cookedPrompt(list) }]);
      const arr = Array.isArray(out?.recipes) ? out.recipes : [];
      return json({ recipes: list.map((_: any, k: number) => ({ cooked_g: Number(arr[k]?.cooked_g) > 0 ? Math.round(Number(arr[k].cooked_g)) : null })) });
    } catch (e) { return aiError(e); }
  }

  // --- grams + nutrition for each ingredient of a recipe ---
  if (mode === "nutrition") {
    const list = (Array.isArray(body.ingredients) ? body.ingredients : []).slice(0, 60).map((i: any) => ({
      name: String(i?.name || "").slice(0, 120), qty: i?.qty ?? null, unit: String(i?.unit || "").slice(0, 40),
      grams: i?.grams == null || i?.grams === "" ? null : Number(i.grams),
    }));
    if (!list.length) return json({ error: "empty", message: "No ingredients." }, 422);
    try {
      const out = await callGemini(key, [{ text: nutritionPrompt(list) }]);
      const arr = Array.isArray(out?.ingredients) ? out.ingredients : [];
      const n = (v: any) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? null : Math.round(Number(v) * 10) / 10);
      return json({ ingredients: list.map((_: any, k: number) => ({ grams: n(arr[k]?.grams), kcal: n(arr[k]?.kcal), protein: n(arr[k]?.protein), carbs: n(arr[k]?.carbs), fat: n(arr[k]?.fat) })) });
    } catch (e) { return aiError(e); }
  }

  // --- translate a saved recipe ---
  if (mode === "translate") {
    const r = body.recipe || {};
    const src = {
      name: String(r.name || ""), tags: Array.isArray(r.tags) ? r.tags : [], notes: String(r.notes || ""),
      ingredients: (Array.isArray(r.ingredients) ? r.ingredients : []).map((i: any) => ({ name: String(i?.name || ""), amount: String(i?.amount || "") })),
      steps: Array.isArray(r.steps) ? r.steps.map(String) : [],
    };
    try {
      const out = await callGemini(key, [{ text: translatePrompt(lang, src) }]);
      const ings = Array.isArray(out.ingredients) ? out.ingredients : [];
      return json({ recipe: {
        name: String(out.name || src.name), notes: String(out.notes ?? src.notes),
        tags: Array.isArray(out.tags) ? out.tags.map(String) : src.tags,
        steps: Array.isArray(out.steps) && out.steps.length ? out.steps.map(String) : src.steps,
        ingredients: src.ingredients.map((i: any, k: number) => ({ name: String(ings[k]?.name || i.name), amount: String(ings[k]?.amount ?? i.amount) })),
      } });
    } catch (e) { return aiError(e); }
  }

  const text = String(body.text || "").slice(0, MAX_TEXT).trim();
  const images = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
  let url = String(body.url || "").trim();
  if (!url && text) url = (text.match(/https?:\/\/\S+/) || [""])[0];

  const parts: unknown[] = [];
  let youtube: string | null = null, linkNote = "", pageImage = "";
  if (url) {
    let u: URL | null = null;
    try { u = new URL(url); } catch { /* not a URL */ }
    if (u) {
      youtube = youtubeUrl(u);
      if (youtube) parts.push({ file_data: { file_uri: youtube } });
      const page = await fetchPage(u.toString());
      if (youtube) pageImage = `https://img.youtube.com/vi/${new URL(youtube).searchParams.get("v")}/hqdefault.jpg`;
      else if (page.image) pageImage = page.image;
      if (page.ok) parts.push({ text: `Material from the link ${u}:\n${page.info}` });
      else if (!youtube) linkNote = "link_unreadable";
    }
  }
  if (text) parts.push({ text: `Text pasted by the user (e.g. the post caption):\n${text}` });
  for (const im of images) {
    if (im && typeof im.data === "string" && /^image\//.test(im.mime || "")) parts.push({ inline_data: { mime_type: im.mime, data: im.data } });
  }
  const audio = body.audio;
  if (audio && typeof audio.data === "string" && /^audio\//.test(audio.mime || "") && audio.data.length <= MAX_AUDIO_B64) {
    parts.push({ text: "Soundtrack of the video (what the cook says):" });
    parts.push({ inline_data: { mime_type: audio.mime, data: audio.data } });
  }

  // --- product from a photo of the package / label ---
  if (mode === "product") {
    if (!parts.length) return json({ error: "empty", message: "Add a photo of the product or its nutrition label." }, 422);
    parts.push({ text: productPrompt(lang) });
    try {
      const out = await callGemini(key, parts);
      if (!out || out.found === false || !out.name) return json({ error: "no_product", message: (out && out.reason) || "Couldn't read a product in this photo." }, 422);
      const p100 = out.per100 || {};
      const n = (v: any) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? null : Math.round(Number(v) * 10) / 10);
      return json({ product: {
        name: String(out.name).slice(0, 200), brand: String(out.brand || ""), barcode: String(out.barcode || "").replace(/\D/g, ""),
        category: String(out.category || ""), unit: out.unit === "ml" ? "ml" : "g",
        serving_g: n(out.serving_g), serving_name: String(out.serving_name || ""),
        kcal: n(p100.kcal), protein: n(p100.protein), carbs: n(p100.carbs), fat: n(p100.fat), sugar: n(p100.sugar), fiber: n(p100.fiber),
        estimated: !!out.estimated, source: "ai",
      } });
    } catch (e) { return aiError(e); }
  }
  if (!parts.length) {
    return json({ error: linkNote || "empty", message: linkNote
      ? "Couldn't read that link (the site blocks it). Paste the caption text or add screenshots."
      : "Add a link, the caption text or screenshots." }, 422);
  }
  parts.push({ text: prompt(lang, !!youtube) });

  try {
    const out = await callGemini(key, parts);
    if (!out || out.found === false || !out.name) {
      return json({ error: "no_recipe", message: (out && out.reason) || "No recipe found. Paste the caption text or add screenshots of the ingredients.", linkNote }, 422);
    }
    const recipe = {
      name: String(out.name).slice(0, 200),
      servings: Number(out.servings) || 1,
      cooked_g: Number(out.cooked_g) > 0 ? Math.round(Number(out.cooked_g)) : null,
      time: out.time == null || out.time === "" ? null : Number(out.time) || null,
      tags: Array.isArray(out.tags) ? out.tags.map(String).slice(0, 6) : [],
      ingredients: (Array.isArray(out.ingredients) ? out.ingredients : []).map((i: any) => ({
        name: String(i?.name || "").trim(), amount: String(i?.amount ?? "").trim(),
        kcal: i?.kcal == null || i?.kcal === "" ? null : Math.round(Number(i.kcal)) || 0,
        ...ingMacros(i),
      })).filter((i: any) => i.name),
      protein: Number(out.protein) || null, carbs: Number(out.carbs) || null, fat: Number(out.fat) || null,
      steps: (Array.isArray(out.steps) ? out.steps : []).map((s: any) => String(s).trim()).filter(Boolean),
      notes: String(out.notes || ""),
      source: url || "",
    };
    // a copy of the dish photo (links from Instagram/Facebook stop working after a while)
    const imageData = pageImage ? await fetchImage(pageImage) : null;
    return json({ recipe: { ...recipe, image: imageData ? "" : pageImage, imageData }, linkNote });
  } catch (e) { return aiError(e); }
}

function aiError(e: unknown): Response {
  const msg = String((e as Error)?.message || e);
  const quota = /429|quota|RESOURCE_EXHAUSTED/i.test(msg);
  return json({ error: quota ? "quota" : "ai", message: quota
    ? "The free AI limit is used up for now. Try again in a few minutes."
    : "The AI could not read this. " + msg.slice(0, 300) }, quota ? 429 : 502);
}

Deno.serve(handle);
