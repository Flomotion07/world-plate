# World Plate

Make every match a meal. Fusion watch-party menus for every World Cup 2026 matchup.

This is a self-contained website. It runs entirely in the browser — no server, no database, no accounts. Visitors just browse matchups (including upcoming ones) and the menu for each.

---

## How to put it online for free (no coding needed)

You'll use two free services: **GitHub** (stores the files) and **Vercel** (turns them into a live website). Both are free for a project like this.

### Step 1 — Make the accounts
1. Go to **github.com** and create a free account.
2. Go to **vercel.com**, click **Sign Up**, and choose **Continue with GitHub**. This links them together.

### Step 2 — Put the project on GitHub
1. On GitHub, click the **+** in the top-right corner → **New repository**.
2. Name it `world-plate`, leave everything else default, click **Create repository**.
3. On the next page, click the link that says **uploading an existing file**.
4. Drag the contents of this folder into the upload box. **Important:** do NOT upload the `node_modules` folder or the `dist` folder if they exist — just the source files (`index.html`, `package.json`, `vite.config.js`, the `src` folder, etc.). If you don't see those two folders, you're fine.
5. Click **Commit changes**.

### Step 3 — Deploy on Vercel
1. Go to **vercel.com**, click **Add New… → Project**.
2. Find your `world-plate` repository and click **Import**.
3. Vercel auto-detects it's a Vite project. Don't change any settings.
4. Click **Deploy**.
5. Wait about a minute. You'll get a live link like `world-plate.vercel.app`.

That link works on phones and computers. Share it with anyone.

### Updating it later
Any time you change a file on GitHub (the website has an edit pencil ✏️ on each file), Vercel automatically rebuilds and updates the live site within a minute.

---

## For a developer (if you ever hand this to one)

Standard Vite + React app.

```bash
npm install
npm run dev      # local preview at localhost:5173
npm run build    # production build to /dist
```

The whole app lives in `src/WorldPlateApp.jsx`. Data (groups, played matches, kickoff times, menus) is hardcoded near the top of that file. Flags are inline SVG; the logo is an embedded data URI.

**Known limitation:** all tournament data is static. To make results and the bracket update during the real tournament, wire in a live data source (e.g. the public-domain `openfootball/worldcup.json` on GitHub) with a small name-mapping layer, and keep the menus as a separate authored data file.
