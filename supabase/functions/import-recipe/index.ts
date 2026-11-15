// Supabase Edge Function: import-recipe
// Turns a link (Instagram / Facebook / TikTok / YouTube / recipe website), pasted caption text
// and/or screenshots into a recipe, using Google Gemini (free tier).
//
// Secrets (Supabase → Edge Functions → Secrets):
//   GEMINI_API_KEY   required — from https://aistudio.google.com/apikey
//   GEMINI_MODEL     optional — override the model, e.g. "gemini-3.6-flash"
//
// Request  (POST, JSON): { url?: string, text?: string, images?: [{mime, data(base64)}], lang?: "en"|"he" }
// Response (JSON):       { recipe } or { error, message }

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// Tried in order; the first that answers wins. Free-tier model names change over time.
const MODELS = [
  Deno.env.get("GEMINI_MODEL"),
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
].filter(Boolean) as string[];
const GEMINI_BASE = Deno.env.get("GEMINI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta";

const MAX_IMAGES = 4;
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

async function fetchPage(url: string): Promise<{ ok: boolean; info: string }> {
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
      let info = "";
      if (title) info += `Page title: ${title}\n`;
      if (desc) info += `Post caption / description: ${desc}\n`;
      if (recipes.length) info += `Structured recipe data from the page (schema.org JSON-LD):\n${JSON.stringify(recipes[0]).slice(0, MAX_TEXT)}\n`;
      else if (!social) info += `Page text:\n${visibleText(html).slice(0, MAX_TEXT)}\n`;
      if (info.trim().length > 40) return { ok: true, info };
    } catch { /* try next agent */ }
  }
  return { ok: false, info: "" };
}

// ---------- Gemini ----------
function prompt(lang: string, hasYoutube: boolean): string {
  const language = lang === "he" ? "Hebrew" : "English";
  return `You extract a cooking recipe from the material provided (post caption, web page data, screenshots${hasYoutube ? ", and the YouTube video — watch it and listen to it" : ""}).

Reply with ONLY a JSON object, no markdown, in exactly this shape:
{
  "found": true,
  "name": "short recipe name",
  "servings": 2,
  "time": 25,
  "tags": ["breakfast", "quick"],
  "ingredients": [{"name": "Eggs", "amount": "4", "kcal": 280}],
  "protein": 14, "carbs": 12, "fat": 11,
  "steps": ["Short step", "Short step"],
  "notes": ""
}

Rules:
- Write name, ingredient names, amounts, tags, steps and notes in ${language}. Keep numbers as digits.
- "amount" includes the unit (e.g. "200 g", "2 tbsp", "1 cup"). If no amount is given, estimate a sensible one and say so in notes.
- "kcal" = your best estimate of calories for that ingredient line in that amount (number). Never leave it empty.
- protein / carbs / fat = estimated grams PER SERVING (numbers). servings = how many portions the recipe makes (estimate if missing). time = total minutes or null.
- Steps: short and clear, one action each, at most 10 steps.
- 1 to 4 short tags (meal type, main ingredient, diet).
- If there is no recipe in the material, reply {"found": false, "reason": "one short sentence in ${language} saying what is missing"}.`;
}

async function callGemini(key: string, parts: unknown[]): Promise<any> {
  let lastErr = "";
  for (const model of MODELS) {
    const r = await fetch(`${GEMINI_BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    });
    const body = await r.text();
    if (r.ok) {
      const data = JSON.parse(body);
      const txt = (data?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
      if (!txt) { lastErr = `${model}: empty answer`; continue; }
      const clean = txt.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
      try { return JSON.parse(clean); }
      catch { const m = clean.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); lastErr = `${model}: unreadable answer`; continue; }
    }
    lastErr = `${model}: ${r.status} ${body.slice(0, 200)}`;
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
  if (!key) return json({ error: "config", message: "GEMINI_API_KEY secret is missing in Supabase." }, 500);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "input", message: "Bad request" }, 400); }
  const lang = body.lang === "he" ? "he" : "en";
  const text = String(body.text || "").slice(0, MAX_TEXT).trim();
  const images = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
  let url = String(body.url || "").trim();
  if (!url && text) url = (text.match(/https?:\/\/\S+/) || [""])[0];

  const parts: unknown[] = [];
  let youtube: string | null = null, linkNote = "";
  if (url) {
    let u: URL | null = null;
    try { u = new URL(url); } catch { /* not a URL */ }
    if (u) {
      youtube = youtubeUrl(u);
      if (youtube) parts.push({ file_data: { file_uri: youtube } });
      const page = await fetchPage(u.toString());
      if (page.ok) parts.push({ text: `Material from the link ${u}:\n${page.info}` });
      else if (!youtube) linkNote = "link_unreadable";
    }
  }
  if (text) parts.push({ text: `Text pasted by the user (e.g. the post caption):\n${text}` });
  for (const im of images) {
    if (im && typeof im.data === "string" && /^image\//.test(im.mime || "")) parts.push({ inline_data: { mime_type: im.mime, data: im.data } });
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
      time: out.time == null || out.time === "" ? null : Number(out.time) || null,
      tags: Array.isArray(out.tags) ? out.tags.map(String).slice(0, 6) : [],
      ingredients: (Array.isArray(out.ingredients) ? out.ingredients : []).map((i: any) => ({
        name: String(i?.name || "").trim(), amount: String(i?.amount ?? "").trim(),
        kcal: i?.kcal == null || i?.kcal === "" ? null : Math.round(Number(i.kcal)) || 0,
      })).filter((i: any) => i.name),
      protein: Number(out.protein) || null, carbs: Number(out.carbs) || null, fat: Number(out.fat) || null,
      steps: (Array.isArray(out.steps) ? out.steps : []).map((s: any) => String(s).trim()).filter(Boolean),
      notes: String(out.notes || ""),
      source: url || "",
    };
    return json({ recipe, linkNote });
  } catch (e) {
    const msg = String((e as Error).message || e);
    const quota = /429|quota|RESOURCE_EXHAUSTED/i.test(msg);
    return json({ error: quota ? "quota" : "ai", message: quota
      ? "The free AI limit is used up for now. Try again in a few minutes."
      : "The AI could not read this. " + msg.slice(0, 300) }, quota ? 429 : 502);
  }
}

Deno.serve(handle);
