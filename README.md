# Nutrition app — setup guide

One app for PC, iPhone and Samsung. Recipes and the shopping list are shared with your
household and sync live between devices; each person's calorie log is private.

About 15 minutes, once. Everything here is free.

---

## Step 1 — Create the database (Supabase)

1. Go to **https://supabase.com** → *Start your project* → sign in (GitHub or email).
2. **New project** → name it `nutrition`, choose a database password (save it somewhere),
   region **Frankfurt (eu-central-1)** (closest to Israel) → *Create*. Wait ~2 minutes.
3. Left menu → **SQL Editor** → *New query* → open `supabase/schema.sql` from this folder,
   copy **all** of it, paste, press **Run**. You should see "Success. No rows returned".
4. Left menu → **Project Settings → API**. Copy two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long text starting with `eyJ...`)
5. Open `config.js` in this folder with Notepad and paste them between the quotes:
   ```js
   window.APP_CONFIG = {
     SUPABASE_URL: "https://abcdxyz.supabase.co",
     SUPABASE_ANON_KEY: "eyJ...."
   };
   ```
   Save. (The anon key is designed to be public — the security rules in the database are
   what protect your data.) Or just send both values to Claude and it will fill this in.

Optional but recommended — **Authentication → Sign In / Providers → Email**:
turn **off** "Confirm email" if you don't want to click a confirmation link when you and your
family create accounts. If you leave it on, do step 3 below so the link opens your app.

## Step 2 — Put the app online (pick one)

**A. Netlify Drop (easiest, no tools):**
1. Go to **https://app.netlify.com/drop** and sign up (free).
2. Drag this whole **app** folder onto the page. You get a link like
   `https://something-123.netlify.app`. Rename it under *Site configuration → Change site name*
   (e.g. `pinto-nutrition.netlify.app`).
3. To update later: *Deploys* tab → drag the folder again.

**B. GitHub Pages (Claude can then publish updates for you):**
1. Connect GitHub in claude.ai → Settings → Connectors, create an empty repository named
   `nutrition`, and tell Claude. It will push the files and turn on Pages; your link will be
   `https://<your-username>.github.io/nutrition/`.

## Step 3 — Tell Supabase your app's address

Supabase → **Authentication → URL Configuration** → **Site URL** = your app link from step 2
(also add it under *Redirect URLs*). This makes confirmation and password-reset emails open
your app.

## Step 4 — Install on your phones

- **iPhone:** open the link in **Safari** → Share button → **Add to Home Screen**.
- **Samsung / Android:** open the link in **Chrome** (or Samsung Internet) → menu ⋮ →
  **Install app** / **Add to Home screen**. The app also offers an *Install* button itself.
- **PC:** in Chrome/Edge, click the install icon in the address bar.

## Step 5 — First use

1. **Create account** (name, email, password).
2. **Create a household** (e.g. "Pinto home").
3. ⚙️ Settings shows an **invite code**. Your wife creates her own account and chooses
   **Join with an invite code**. From then on you share recipes and the shopping list.

## Step 6 — Turn on "✨ Import with AI" (free, Google Gemini)

**6a. Get a free Gemini key**
1. Go to **https://aistudio.google.com/apikey** and sign in with a Google account.
2. Click **Create API key** (choose any project, or let it create one). Copy the key (starts with `AIza…`).
   No credit card is needed. Free use is rate-limited, and Google may use free-tier requests to improve its products.

**6b. Add the server function in Supabase**
1. Supabase → left menu **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Name it exactly: `import-recipe`
3. Delete the sample code, paste **all** of `supabase/functions/import-recipe/index.ts` from this folder
   (or from GitHub: DenisGit7/nutrition → supabase/functions/import-recipe/index.ts → Raw → copy), click **Deploy**.
4. Open the function → **Details / Settings** → turn **off** "Enforce JWT verification"
   (also called "Verify JWT") → Save. The function checks the sign-in itself.
5. Edge Functions → **Secrets** → **Add new secret**: Name `GEMINI_API_KEY`, Value = your key → Save.

Done — in the app tap **✨ Import with AI**, paste a link (and/or the caption, or add screenshots) → **Create recipe**.
The recipe opens in the editor; check it and tap **Save**.

- **Samsung/Android:** in Instagram/Facebook/TikTok tap **Share → Nutrition** (the app must be installed).
- **iPhone:** copy the link (and caption) and paste it in the app.
- **Works best:** recipe websites, YouTube videos, posts where the recipe is in the caption.
  If the recipe is only spoken in an Instagram/Facebook video, add screenshots.
- Optional secret `GEMINI_MODEL` lets you pick a different Gemini model if Google renames them.

## Updating to 1.2.0 (products, translate, video import) — do once

1. **Database:** Supabase → SQL Editor → New query → paste all of `supabase/002_products.sql` → **Run**.
2. **AI function:** Supabase → Edge Functions → `import-recipe` → **Code** → replace everything with the new
   `supabase/functions/import-recipe/index.ts` → **Deploy**. (Your GEMINI_API_KEY secret stays.)

What's new:
- **Products tab** — your household's products (shared), 137 built-in common foods (English + Hebrew),
  online search in **Open Food Facts** (free community database, many Israeli products; type a barcode to look it up),
  and **Fill from photo**: photograph the package / nutrition label and the AI fills in the values (per 100 g).
- **Typing an ingredient or a food in "Log food"** suggests products; pick one and enter an amount
  (`150 g`, `2`, `2 ביצים`, `1 כוס`, `חצי גביע`) — calories, protein, carbs and fat are calculated.
- **Translate** button on every recipe (to the language the app is in).
- **AI import → Add video:** screen-record a reel while it plays, add the recording; the app sends frames and the
  soundtrack to the AI.

## Updating to 1.3.0 (product pictures) — do once

1. **Database + photo storage:** Supabase → SQL Editor → New query → paste all of `supabase/003_product_images.sql` → **Run**.
2. **AI function:** Edge Functions → `import-recipe` → **Code** → replace with the new
   `supabase/functions/import-recipe/index.ts` → **Deploy** (adds Open Food Facts product photos).

Pictures appear in the Products list, suggestions and the shopping list. Ways to get one:
the first photo you give the AI, **Add picture** on any product, or the photo from Open Food Facts.
Products without a picture show a matching emoji or a coloured letter.

## Updating to 1.4.0 (Ask AI for a recipe) — do once

**AI function:** Edge Functions → `import-recipe` → **Code** → replace with the new
`supabase/functions/import-recipe/index.ts` → **Deploy**. (No database change.)

New on the Recipes tab: **Ask AI for a recipe** — type a question ("how to cook brown lentils"), pick 1–3 options,
then **Add** a recipe straight to your list or **Edit first**.

## Updating to 1.5.0 (recipe pictures) — do once

1. **Database:** SQL Editor → New query → paste all of `supabase/004_recipe_images.sql` → **Run**
   (run `003_product_images.sql` first if you haven't — it creates the photo storage).
2. **AI function:** Edge Functions → `import-recipe` → **Code** → replace with the new
   `supabase/functions/import-recipe/index.ts` → **Deploy**.

Recipes now have a picture of the dish: from the link (recipe site / Instagram / Facebook preview, YouTube thumbnail),
the first screenshot or video frame, a Wikipedia photo for "Ask AI" recipes, or your own photo / "Find picture online" in the editor.

## Updating to 1.7.0 (accurate calories) — do once

**AI function:** Edge Functions → `import-recipe` → **Code** → replace with the new
`supabase/functions/import-recipe/index.ts` → **Deploy** (check the new code contains `nutritionPrompt`). No database change.

- Grams are the source of truth: only g / kg / ml / l and a product's own serving are converted automatically.
  For cups, spoons and pieces, type the grams — or tap **✨ Recalculate calories with AI**.
- **✨ Recalculate calories with AI** (recipe editor) gives every ingredient realistic grams, calories, protein, carbs and fat.
  Ingredients linked to your products keep the product's calories per 100 g; missing protein/carbs/fat are filled in.
- Imported and "Ask AI" recipes now come with grams and macros for each ingredient.

## Updating to 1.8.0 (AI search) — do once

**AI function:** Edge Functions → `import-recipe` → **Code** → replace with the new
`supabase/functions/import-recipe/index.ts` → **Deploy** (the new code contains `findPrompt`). No database change; existing recipes and products are unchanged.

1.8.1: the green **Ask AI** button (Recipes and Products tabs) now does both: cooking questions ("how to cook brown lentils" → 1–3 recipe options) and search by description or values
("high-protein yogurt", "dinner under 400 kcal with 30 g protein"). Shows matching saved items first, then new suggestions,
each marked Product or Recipe with the matching Add button.

## Updating to 1.10.0 (meals in the food log) — do once

**Database:** SQL Editor → New query → paste all of `supabase/005_food_log_meals.sql` → **Run**.
It adds meal + amount to the food log and puts your existing entries into a meal by the time they were logged.
Until you run it, entries still save, but without the meal (the app shows a reminder).

## Updating to 1.11.0 (cooked weight) — do once

1. **Database:** SQL Editor → New query → paste all of `supabase/006_recipe_cooked_weight.sql` → **Run**.
2. **AI function:** Edge Functions → `import-recipe` → **Code** → replace with the new `index.ts` → **Deploy** (contains `cookedPrompt`).

Each recipe now has the cooked weight of the whole dish; logging a recipe by grams counts cooked grams.
Existing recipes get an AI estimate automatically when the app opens; food-log entries of recipes logged by grams
before 1.11 (counted as raw) are recalculated once as cooked grams.

## Updating to 1.12.0 (your own meals) — do once

**Database:** SQL Editor → New query → paste all of `supabase/007_custom_meals.sql` → **Run**.
"+ Add meal" on the Today page; meals marked "Show every day" are saved in your settings and synced between your devices
(until you run the script they are kept on that device only). Tap a meal's title to collapse or expand it.

## Updating to 1.13.0 (shopping list by category) — do once

1. **Database:** SQL Editor → New query → paste all of `supabase/008_shopping_categories.sql` → **Run**.
2. **AI function:** paste the new `index.ts` → **Deploy** (contains `categorizePrompt`) — used only for items the app can't recognise by name.

Shopping tab → **Sort: As added / By category**. Categories come from the item name (EN/HE), your product's category, or the AI;
tap the category icon on an item to change it (remembered for that name on this device).

**If the AI says a model "is no longer available":** paste the latest `index.ts` (it finds a working Gemini model by itself),
or as a quick fix add a secret `GEMINI_MODEL` with the model name Google suggests in the message (Edge Functions → Secrets).

---

## Adding recipes from a link (without AI import)

Send Claude the recipe link. Claude replies with the recipe as a block of JSON text.
In the app: **⚙️ → Import recipes** (or the *Import* button on the empty Recipes page) →
paste → **Import**. You can edit everything afterwards.

## Backup

⚙️ → **Export all recipes** downloads a `.json` file (and copies it). Import it any time.

## Files

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | the app |
| `config.js` | your Supabase URL + key |
| `manifest.webmanifest`, `sw.js`, `icons/` | makes it installable and work offline |
| `supabase/schema.sql` | database tables + security rules (run once) |

Without `config.js` filled in, the app runs in **demo mode** (saved on that device only).
