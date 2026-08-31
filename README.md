# Green Cup — Carbon Footprint Calculator

A **static** React (Vite) app. When a user picks their hostel and hits *Next*,
the submission is appended to a **Google Sheet** via a Google Apps Script Web App.
There is **no backend server** to run or host.

```
calculator/            → the React frontend (build this, upload the dist/)
google-apps-script/    → Code.gs to paste into your Sheet's Apps Script
```

## 1. Set up the Google Sheet collector (one time)

Follow the steps at the top of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
You'll end up with a URL ending in `/exec`. Keep it.

## 2. Configure the frontend

Edit [`calculator/.env.production`](calculator/.env.production):

```
VITE_SHEET_URL=https://script.google.com/macros/s/AKfycb.../exec   # your /exec URL
VITE_BASE=/~<your-gymkhana-username>/                              # note the ~ and trailing /
```

Also change the username in [`calculator/public/.htaccess`](calculator/public/.htaccess)
(two places) to your gymkhana username.

## 3. Build

```bash
cd calculator
npm install
npm run build      # outputs calculator/dist/
```

## 4. Deploy to gymkhana (static host)

```bash
# from calculator/ — the trailing "/." also copies dotfiles like .htaccess
scp -r dist/. <user>@web-others:/home/<user>/public_html/
```

Then visit `https://gymkhana.iitb.ac.in/~<user>/`.

> Using `dist/*` (with a star) will silently skip `.htaccess`. Use `dist/.` as above,
> or copy it separately: `scp dist/.htaccess <user>@web-others:/home/<user>/public_html/`.

## Getting the data

Open your Google Sheet — every submission is a row (`timestamp`, `hostelNo`, `userName`).
`File ▸ Download ▸ CSV` for a spreadsheet, or `Data ▸ Pivot table` for per-hostel counts.

## Local development

```bash
cd calculator
npm install
npm run dev        # http://localhost:5173
```

Leave `VITE_SHEET_URL` empty in `.env.development` to skip writes, or paste your
`/exec` URL there to test against the real sheet.
