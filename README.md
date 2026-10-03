# ☀ Sunny Letters (Supabase + Surge edition)

A letter-making website in soft yellows. Users sign up, design a letter, add photos / audio / video (and remove them again), edit letters any time, and share them in many ways.

## How it works
- **Frontend:** one static page (`public/index.html`), hosted free on **Surge**.
- **Backend:** **Supabase** only. It provides the PostgreSQL database, login, file storage and the access rules. There is no server of your own to run or keep awake.
- **Keepalive:** a free GitHub Actions job pings the database every 3 days, because Supabase pauses free projects after about a week of inactivity.

## Features
Sign up / log in · "Make a letter" button · design panel (paper color, handwriting, border, sticker) · rich text · add image / audio / video with a **✕ Remove** button on each · edit, re-save and delete letters · share by link, QR code, barcode, code, device share sheet, embed code, print/PDF, WhatsApp, Telegram, Messenger, Facebook, X, LinkedIn, Reddit, Pinterest, email, SMS · public view at `/l/<code>`.

## Free-plan limits (check Supabase's pricing page, they can change)
About 500 MB database, 1 GB file storage and 5 GB bandwidth per month. Upload limits are set to 5 MB images, 10 MB audio and 25 MB video to make the space last.

## Deploy, step by step

### 1. Create the Supabase project
1. Sign up at supabase.com and click **New project**. Choose a name and database password, and pick the region closest to your users.
2. Open **SQL Editor > New query**, paste all of `supabase/schema.sql`, and click **Run**. This creates the tables, security rules, share-code function and the `media` storage bucket.
3. Go to **Authentication > Sign In / Providers > Email**. For a simple start, turn **Confirm email** off. If you leave it on, users must click the email link before logging in.
4. Open **Project Settings > API** and copy the **Project URL** and the **anon / publishable key**.

### 2. Configure the site
Edit `public/config.js` and paste the two values:
```js
window.SUPABASE_URL = 'https://abcd1234.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';
```
The anon key is safe to publish. Never use the `service_role` key here.

### 3. Deploy the frontend to Surge
In a terminal (Node.js required):
```
cd public
copy index.html 200.html        (Mac/Linux: cp index.html 200.html)
npm install -g surge
surge ./ yourname.surge.sh
```
The first run asks you to create a free Surge account. `200.html` makes shared links like `/l/abc123` work. Copy it again every time you change `index.html`.

### 4. Tell Supabase your site address
In **Authentication > URL Configuration**, set **Site URL** to `https://yourname.surge.sh`. This matters for confirmation emails.

### 5. Turn on the keepalive
1. Put this folder in a GitHub repository.
2. In the repo go to **Settings > Secrets and variables > Actions** and add `SUPABASE_URL` and `SUPABASE_ANON_KEY` with the same values as above.
3. Open the **Actions** tab, choose **Supabase keepalive** and click **Run workflow** once to test it. GitHub can switch off scheduled jobs in repositories with no activity for a long time, so check back now and then.

### 6. Test
Open your Surge address, sign up, make a letter with an image, remove the image with **✕ Remove**, save, then open the share link in a private window.

## Notes
- Anyone with a letter's link can read it; only the owner can edit it. Media files are in a public bucket, so anyone who has a media URL can open it.
- Removed media is deleted from storage when you click **Save letter** (or when you delete the letter).
- The free plan has no automatic backups.
- The Messenger share button needs a Facebook app ID to work fully.
