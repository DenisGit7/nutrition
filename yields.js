// Cooking yields: how the weight of an ingredient changes when it is cooked the usual way.
// Values = cooked weight ÷ raw (dry) weight, from the USDA cooking-yield tables and the
// USDA raw vs cooked energy densities (e.g. dry rice 360 kcal/100 g → cooked 130 → ×2.8).
// Used to work out the cooked weight of a recipe automatically, and grams of cooked rice,
// pasta, legumes etc. for dry products.
(function () {
  const H = s => "(?:^|[\\s,(\\-/ו])(?:ה|ו|ב|מ|ל)?" + s; // Hebrew word start (allows one prefix letter)
  const rx = (en, he) => new RegExp((en ? "\\b(?:" + en + ")\\b" : "(?!x)x") + "|" + (he ? H("(?:" + he + ")") : "(?!x)x"), "i");

  // grains & legumes: absorb water. y = cooked ÷ dry. minDry = kcal/100 g above which the ingredient counts as dry.
  // eat: "c" = usually eaten cooked (default to cooked grams when logging a dry product), "r" = often eaten raw (oats).
  const ABSORB = [
    { k: "oats", re: rx("oats?|oatmeal|porridge|rolled oats|quaker", "שיבולת שועל|שיבולת|קוואקר|דייסת"), y: 5.5, eat: "r" },
    { k: "rice noodles", re: rx("rice noodles?|rice vermicelli", "אטריות אורז"), y: 3.0, eat: "c" },
    { k: "brown rice", re: rx("brown rice|wild rice", "אורז מלא|אורז בר"), y: 2.9, eat: "c" },
    { k: "rice", re: rx("rice|basmati|jasmine rice|risotto|arborio", "אורז|בסמטי"), y: 2.8, eat: "c", not: /rice (cake|paper|vinegar|flour|milk|drink)|פריכי|נייר אורז|קמח אורז|חומץ אורז|משקה אורז/i },
    { k: "pasta", re: rx("pasta|spaghetti|macaroni|penne|fusilli|linguine|tagliatelle|fettuccine|lasagn\\w*|noodles?|orzo|vermicelli", "פסטה|ספגטי|מקרוני|פנה|פוזילי|לזניה|אטריות|נודלס|לינגוויני"), y: 2.4, eat: "c" },
    { k: "ptitim", re: rx("ptitim|israeli couscous|pearl couscous", "פתיתים"), y: 2.4, eat: "c" },
    { k: "couscous", re: rx("couscous", "קוסקוס"), y: 3.0, eat: "c" },
    { k: "bulgur", re: rx("bulgur|bulghur|burghul", "בורגול"), y: 3.5, eat: "c" },
    { k: "quinoa", re: rx("quinoa", "קינואה"), y: 3.0, eat: "c" },
    { k: "buckwheat", re: rx("buckwheat|kasha", "כוסמת"), y: 3.5, eat: "c" },
    { k: "barley", re: rx("barley", "גריסים|שעורה|שעורים"), y: 3.0, eat: "c" },
    { k: "freekeh", re: rx("freekeh|farro|spelt grains?", "פריקה|גרעיני כוסמין"), y: 2.8, eat: "c" },
    { k: "millet", re: rx("millet", "דוחן"), y: 3.2, eat: "c" },
    { k: "polenta", re: rx("polenta|cornmeal|grits", "פולנטה"), y: 4.5, eat: "c" },
    { k: "red lentils", re: rx("red lentils?|yellow lentils?|orange lentils?", "עדשים כתומות|עדשים אדומות|עדשים צהובות"), y: 2.5, eat: "c" },
    { k: "lentils", re: rx("lentils?", "עדשים|עדשה"), y: 3.0, eat: "c" },
    { k: "mung beans", re: rx("mung(?: beans?)?|moong", "מש(?=$|[\\s,)])|שעועית מש"), y: 3.3, eat: "c" },
    { k: "split peas", re: rx("split peas?", "אפונה יבשה|אפונה גרוסה|אפונה צהובה"), y: 2.9, eat: "c" },
    { k: "chickpeas", re: rx("chick ?peas?|garbanzo", "גרגירי חומוס|גרגרי חומוס|חומוס גרגרים|חומוס יבש|חומוס(?=$|[\\s,)])"), y: 2.3, eat: "c", minDry: 330 },
    { k: "beans", re: rx("beans?|fava|cannellini|borlotti|pinto|navy beans?", "שעועית|פול(?=$|[\\s,)])|לוביה"), y: 2.5, eat: "c", not: /green beans?|string beans?|coffee|vanilla|jelly|baked beans|שעועית ירוקה|שעועית צהובה|קפה|וניל/i },
  ];
  // meat, fish & vegetables: lose water when cooked (y < 1). veg only counts in cooked dishes.
  const SHRINK = [
    { k: "chicken", re: rx("chicken|turkey|poultry|drumsticks?|wings?|schnitzel", "עוף|הודו|פרגית|פרגיות|שניצל|כרעיים|שוקיים|כנפיים|חזה"), y: 0.72, not: /broth|stock|bouillon|soup|sausage|pastrami|deli|nuggets|ציר|מרק|נקניק|פסטרמה|אבקת|שווארמה מוכנה/i },
    { k: "meat", re: rx("beef|steak|lamb|veal|pork|ground meat|minced meat|mince|meatballs?|brisket|kebab", "בקר|בשר|סטייק|אנטריקוט|כבש|טלה|עגל|קציצות|קבב|צלעות|אסאדו|פילה בקר"), y: 0.72, not: /broth|stock|bouillon|sausage|pastrami|salami|jerky|ציר|נקניק|פסטרמה|סלמי/i },
    { k: "fish", re: rx("fish|salmon|tilapia|cod|hake|trout|sea bass|bream|mackerel|sardines?|halibut|shrimps?|prawns?|calamari|squid", "דג|דגים|סלמון|אמנון|לברק|דניס|בורי|מוסר|בקלה|הייק|טרוטה|שרימפס|קלמרי|מקרל"), y: 0.8, not: /canned|smoked|sauce|oil|tuna|anchov|קופסה|מעושן|רוטב|טונה|אנשובי|שמן דגים/i },
    { k: "onion", re: rx("onions?|shallots?|leeks?", "בצל|בצלים|שאלוט|כרישה"), y: 0.7, veg: true, not: /powder|green onion|spring onion|אבקת|בצל ירוק/i },
    { k: "mushrooms", re: rx("mushrooms?|champignons?", "פטריות|פטריה|שמפיניון"), y: 0.6, veg: true },
    { k: "leafy", re: rx("spinach|chard|kale|cabbage", "תרד|מנגולד|קייל|כרוב"), y: 0.75, veg: true },
    { k: "soft veg", re: rx("zucchini|courgettes?|eggplants?|aubergines?|peppers?|bell peppers?|tomatoes?|carrots?|broccoli|cauliflower|green beans?", "קישוא|קישואים|חציל|חצילים|פלפל|פלפלים|עגבני|גזר|ברוקולי|כרובית|שעועית ירוקה"), y: 0.85, veg: true, not: /black pepper|pepper flakes|paprika|chili flakes|sauce|paste|puree|canned|sun.?dried|פלפל שחור|פלפל חריף גרוס|רסק|רוטב|מרוסק|מיובש|פפריקה|קטשופ|ketchup/i },
    { k: "potato", re: rx("potato(?:es)?|sweet potato(?:es)?|yams?", "תפוח אדמה|תפוחי אדמה|בטטה|בטטות"), y: 1.0, roastY: 0.8, veg: true, not: /chips|crisps|flakes|starch|צ'יפס|פתיתי|קמח תפוחי/i },
  ];
  const WATER = /^(?:water|cooking water|hot water|boiling water|cold water|ice|broth|stock|bouillon|chicken stock|vegetable stock|beef stock|מים|מים רותחים|מים חמים|מים קרים|קרח|ציר|ציר עוף|ציר ירקות|ציר בקר|מרק עוף)(?:\s|$|,)/i;
  const LIQUID = /\b(?:milk|cream|half and half|coconut milk|juice|wine|beer|kefir|buttermilk|soy drink|oat drink|almond drink|plant milk)\b|חלב(?!ון)|שמנת|מיץ|יין|בירה|קפיר|משקה סויה|משקה שקדים|משקה שיבולת|משקה אורז/i;
  const COOKED = /\b(?:cooked|boiled|steamed|roasted|grilled|baked|fried|canned|tinned|precooked|pre-cooked|ready|leftover|smoked|instant)\b|מבושל|מבושלת|מבושלים|מבושלות|צלוי|צלויה|אפוי|אפויה|מטוגן|מטוגנת|קופסה|קופסת|שימורים|משומר|מוכן|מוכנה|מעושן|אינסטנט/i;
  const SOUP = /\bsoups?\b|broth|chowder|bisque|ramen|pho|מרק|צ'ורבה/i;
  const STEW = /stew|curry|shakshuk|chili|goulash|tagine|ragu|bolognese|sauce|dal|dhal|cholent|hamin|תבשיל|קארי|שקשוקה|צ'ילי|גולאש|טאג'ין|רוטב|בולונז|חמין|מג'דרה|מג׳דרה|דאל/i;
  const COOK_WORDS = /cook|boil|simmer|fry|fried|bake|roast|grill|saut|steam|braise|air.?fr|oven|stew|microwave|בשל|מבשל|רתיח|טגנ|מטגנ|אופ|לאפות|תנור|צלי|לצלות|מאדים|אידוי|סיר|מחבת|אייר|נישול|הרתח|מיקרוגל/i;
  const NO_COOK = /salad|smoothie|shake|overnight|raw|no.?bake|yogurt bowl|סלט|שייק|סמוותי|לילה|ללא אפייה/i;

  const name = s => String(s || "").trim().toLowerCase();
  const isCooked = n => COOKED.test(n.replace(/לא\s*מבושל\S*|uncooked|un-cooked|not cooked/gi, ""));
  const find = (list, n) => list.find(r => r.re.test(n) && !(r.not && r.not.test(n))) || null;
  const density = i => { const g = Number(i.grams), k = Number(i.kcal);
    if (g > 0 && k > 0) return k / g * 100;
    if (i.food && Number(i.food.kcal) > 0) return Number(i.food.kcal); return null };

  // dry staple for logging: returns {y, eat} when the product is a dry grain/legume (by name + energy density)
  function productYield(p) {
    const n = name(p && p.name) + " " + name(p && (p.en || p.alt));
    if (isCooked(n)) return null;
    const r = find(ABSORB, n); if (!r) return null;
    const kc = Number(p.kcal); if (!(kc >= (r.minDry || 300))) return null;
    return { y: r.y, eat: r.eat, k: r.k };
  }

  // cooked weight of a whole recipe, in grams, assuming normal home cooking.
  // null when an ingredient with calories has no grams (can't know its weight).
  function recipeCooked(r) {
    const ings = (r && r.ingredients || []).filter(i => i && i.name);
    if (!ings.length) return null;
    const title = name(r.name) + " " + (r.tags || []).map(name).join(" ");
    const text = title + " " + (r.steps || []).map(name).join(" ");
    let water = 0, liquid = 0, absorbed = 0, cap = 0, rest = 0, shrunk = 0, cookedIng = false, veg = [];
    for (const i of ings) {
      const n = name(i.name), g = Number(i.grams);
      if (!(g > 0)) { if (Number(i.kcal) > 0) return null; continue }
      if (WATER.test(n)) { water += g; continue }
      if (LIQUID.test(n)) { liquid += g; continue }
      const done = isCooked(n);
      const a = find(ABSORB, n);
      if (a) {
        const d = density(i);
        if (done || (d != null && d < (a.minDry || 300))) { rest += g; continue } // already cooked / canned
        absorbed += g * a.y; cap += g * (a.y - 1); cookedIng = true; continue
      }
      const s = find(SHRINK, n);
      if (s && !s.veg) { if (done) rest += g; else { shrunk += g * s.y; cookedIng = true } continue }
      if (s && s.veg && !done) { veg.push([g, s]); continue }
      rest += g;
    }
    const cookedDish = cookedIng || (COOK_WORDS.test(text) && !NO_COOK.test(title));
    const roast = /roast|bake|oven|air.?fr|grill|צלי|תנור|אפי|אייר|גריל/i.test(text);
    for (const [g, s] of veg) rest += cookedDish ? g * (roast && s.roastY ? s.roastY : s.y) : g;
    // grains/legumes soak up the cooking water (water first, then milk etc.); what is left over:
    const fromWater = Math.min(water, cap), fromLiquid = Math.min(liquid, cap - fromWater);
    const leftWater = water - fromWater, leftLiquid = liquid - fromLiquid;
    const keepWater = !cookedDish ? 1 : SOUP.test(title) ? 0.9 : STEW.test(title) ? 0.4 : 0; // drained / evaporated
    const total = absorbed + shrunk + rest + leftWater * keepWater + leftLiquid * (cookedDish ? 0.9 : 1);
    return total > 0 ? Math.round(total) : null;
  }

  window.YIELDS = { recipeCooked, productYield, ABSORB, SHRINK };
})();
