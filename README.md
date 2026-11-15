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
