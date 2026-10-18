# ☀ Idea0

A letter-making website with a soft-yellow theme. People sign up, design a letter, add photos / audio / video and background music, edit it any time, and share it in many ways. Letters live in a PostgreSQL database (Supabase), and the website itself is plain static files, so it hosts for free on Surge with no server to keep awake.

## Features
- **Accounts:** sign up and log in. Each person only sees and edits their own letters.
- **Make a letter:** one button opens the designer. Letters can be edited, re-saved and deleted any time.
- **Design:** paper color, 14 fonts, border, paper pattern (notebook lines, grid, dots, stripes, watercolor, confetti, gingham), paper effect (tape, folded corner, tilt, lifted shadow), corner stickers and a header sticker.
- **Word-style text tools:** undo/redo, headings and quotes, a font and size for any selected words, bold / italic / underline / strikethrough, subscript / superscript, text and highlight colors, alignment, bullet and numbered lists, indent, line spacing, links, divider line, emoji, clear formatting. Pasted text arrives as plain text.
- **Media:** add images (5 MB), audio (10 MB) and video (25 MB). Click a media item to move it (✥ handle), resize it (corner square or Size slider), put it on its own line (left / center / right), let text wrap around it (left / right), place it behind or in front of the text, or send it above / below all the text. **✕ Remove** deletes it.
- **Background music:** choose None, Browse from device, or Get music online (free Creative Commons search from Openverse, or paste a direct https link). Pick a start and end time and only that part repeats. Music fades in softly and loops.
- **Cover:** the reader first sees a cover with a title the maker chooses (default "A letter for you"). Clicking **Open letter** shows the letter and starts the music. The cover appears when a letter has music or a custom cover title.
- **Sharing:** link, QR code (download as PNG or JPG), Code 128 barcode, copy code, device share sheet, embed code, print / PDF, WhatsApp, Telegram, Messenger, Facebook, X, LinkedIn, Reddit, Pinterest, email and SMS. Shared letters open at `/l/<code>` without logging in.
- **Tab title:** the browser tab shows the letter's own title when someone opens a shared letter (and while you edit it). Other pages show "Idea0". Link previews in apps like WhatsApp can't show it, because those previews don't run the page's JavaScript.
- **Phone friendly:** the letter comes first, and "Text tools" and "Design your letter" are dropdowns that start collapsed on every screen. Tap the **Show** button on either one to open it.

## How it works
- **Website:** static files in `public/`, hosted on **Surge**.
- **Backend:** **Supabase** only. It provides the PostgreSQL database, login, file storage and the access rules (Row Level Security). There is no server of your own.
- **Keepalive:** a free GitHub Actions job queries the database every day, because Supabase pauses free projects after about a week of inactivity.

## Project structure
```
letter-site-supabase/
├── public/                   everything that gets uploaded to Surge
│   ├── index.html            page skeleton and the libraries it loads (HTML)
│   ├── styles.css            all styling; colors are the variables at the top (CSS)
│   ├── app.js                all page logic: login, editor, sharing, viewer (JavaScript)
│   ├── config.js             YOUR Supabase URL and publishable key (you create this)
│   ├── config.example.js     template for config.js
│   └── 200.html              copy of index.html so /l/<code> share links work on Surge
├── supabase/schema.sql       tables, security rules, share-code function, media bucket
├── .github/workflows/keepalive.yml   keeps the free Supabase project awake
├── .gitignore
└── README.md
```
Where to change things:
- **Colors and look:** `public/styles.css` (the `:root` block at the top, then each section).
- **Fonts, paper patterns, effects, stickers, size limits:** the lists near the top of `public/app.js` (`FONTS`, `PATTERNS`, `EFFECTS`, `CORNERS`, `HEADS`, `LIMITS`). New Google Fonts also need adding to the font link in `index.html`.
- **Page structure and libraries:** `public/index.html`.

## Setup, step by step

### 1. Create the Supabase project
1. Sign up at supabase.com and click **New project**.
2. Open **SQL Editor > New query**, paste all of `supabase/schema.sql`, and click **Run**.
3. Go to **Authentication > Sign In / Providers > Email**. For a simple start, turn **Confirm email** off. If it stays on, users must click an email link before they can log in.
4. Copy two values: the **Project URL** (ends in `.supabase.co`, **without** `/rest/v1/`) from **Integrations > Data API**, and the **Publishable key** (`sb_publishable_...`) from **Settings > API Keys**.

### 2. Add your keys
Copy `public/config.example.js` to `public/config.js` and fill in the two values:
```js
window.SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_...';
```
The publishable key is safe to publish. **Never** use the `sb_secret_...` / `service_role` key anywhere in this project.

### 3. Try it on your computer (optional)
```
cd public
npx serve -s .
```
Open the address it prints. You should see the login page.

### 4. Deploy the website to Surge
```
cd public
copy index.html 200.html          (Mac/Linux: cp index.html 200.html)
npm install -g surge
surge ./ yourname.surge.sh
```
The first run asks you to create a free Surge account. Then in Supabase go to **Authentication > URL Configuration** and set **Site URL** to `https://yourname.surge.sh`.

`200.html` is what Surge shows for unknown addresses, which is how share links like `/l/abc123` open a letter. Since `index.html` is now only a small skeleton, you rarely need to recopy it. Do it whenever you change `index.html`.

### 5. Put it on GitHub and start the keepalive
1. Create an empty repository on github.com, then in the project folder:
   ```
   git init
   git add .
   git commit -m "Letter site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
2. In the repo go to **Settings > Secrets and variables > Actions** and add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (same values as `config.js`).
3. Open the **Actions** tab, choose **Supabase keepalive**, click **Run workflow**, and wait for a green check. GitHub can switch off scheduled jobs in repositories with no activity for a long time, so check now and then.

Optional: add `public/config.js` to `.gitignore` to keep it out of GitHub. On Windows, write the file in plain text so Git can read it:
```
Set-Content -Path .gitignore -Value "node_modules",".DS_Store","public/config.js" -Encoding ascii
```
(`echo ... >> .gitignore` in PowerShell saves it as UTF-16, which Git cannot read.) If `config.js` was already committed, run `git rm --cached public/config.js` once.

## Updating the site later
```
git add .
git commit -m "describe what you changed"
git push
cd public
copy index.html 200.html
surge ./ yourname.surge.sh
```
Browsers keep old copies of files. If a change doesn't appear, hard-refresh with `Ctrl+Shift+R`. To force it for everyone, raise the number in `index.html` after `styles.css?v=` and `app.js?v=` (for example `?v=2`).

## Free-plan limits (check Supabase's pricing page, they can change)
About 500 MB database, 1 GB file storage and 5 GB bandwidth per month. The upload limits (5 / 10 / 25 MB) help the space last. The free plan has no automatic backups.

## Security notes
- Row Level Security means users can only read, change and delete their own letters and files. Shared letters are readable only by their share code.
- When a letter is shown, the text is cleaned and only a fixed list of formatting styles and design values is kept, so a letter cannot run scripts or cover the page.
- Media files are in a public bucket, so anyone who has a file's URL can open it.
- Anyone with a letter's link can read it; only the owner can edit it.

## Troubleshooting
- **"Almost there" message:** `public/config.js` still has the placeholder values or is missing from the upload.
- **Sign-up works but login says to confirm email:** turn off **Confirm email** (step 1.3) or click the link in the email.
- **Share link shows a 404 on Surge:** `200.html` is missing from `public/` when you deploy.
- **Images or music don't appear for others:** the media bucket must be public; rerun `supabase/schema.sql`.
- **Some online music won't play:** its host may block other websites. Try another track or paste a direct link.
- **Messenger button:** needs a Facebook app ID to work fully.
- **Git "LF will be replaced by CRLF" warnings:** harmless on Windows.