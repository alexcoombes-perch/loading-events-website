# Loading Events. — Setup Guide

This is a full website for a wedding & event coordination business, built with real copy and photos already in place. It's designed so that **you (Alex) do a one-time technical setup (~30 minutes)**, and after that **your friend can edit everything herself** through a simple form-based editor — no code, no developer needed.

---

## What's in this folder

- `src/` — the website: pages, styling, and content (as plain text/YAML files, easy to edit)
- `.pages.yml` — configuration for the content editor (Pages CMS) that turns each page into a simple form
- Real wedding photos are already dropped into `src/images/` (from the three sample weddings shared) — swap these for her own final picks whenever she's ready
- The About page has no portrait photo yet — add one when she has a headshot

Nothing here needs installing on your computer. All the setup happens in a browser.

---

## Step 1 — Put the code on GitHub (5 min)

Cloudflare Pages deploys straight from a GitHub repo, and the content editor also reads/writes through GitHub — so this is the one piece of "plumbing" everything else connects to.

1. Go to [github.com/new](https://github.com/new), sign in (or create a free account), and create a new **private** repository — e.g. `loading-events-website`.
2. Upload this whole folder to it. Easiest way: on the new repo's page, click "uploading an existing file" and drag in everything from this folder (or, if you're comfortable with git: `git init`, `git add .`, `git commit -m "Initial site"`, `git remote add origin <repo-url>`, `git push -u origin main`).

## Step 2 — Connect Cloudflare Workers (10 min)

**Note on method:** Cloudflare's own "Workers Builds" (its built-in Git auto-build feature) had a persistent bug during setup where builds got stuck forever at "Initializing" and never ran — this looked like an account-side issue on Cloudflare's infrastructure, not a mistake in this repo's config. So instead, deploys are handled by a **GitHub Actions workflow** already included in this repo (`.github/workflows/deploy.yml`), which builds the site and pushes it to Cloudflare on every commit to `main`. It's just as automatic — nobody has to touch it after the one-time setup below. If Cloudflare fixes Workers Builds on their end later, you can switch back, but there's no need to.

1. Create the Worker so it exists in your Cloudflare account:
   - In the Cloudflare dashboard, go to **Workers & Pages → Create Application → Create Worker**.
   - Name it `loading-events-website` (must match the `name` in `wrangler.jsonc`), and deploy the default starter — you'll overwrite it with the real site on the first automated deploy.
2. Create a Cloudflare API token so GitHub can deploy on your behalf:
   - Go to **My Profile → API Tokens → Create Token**.
   - Use the **"Edit Cloudflare Workers"** template (or a custom token with `Account → Workers Scripts → Edit` permission for your account).
   - Copy the token when it's shown — you won't be able to see it again.
3. Add two secrets to the GitHub repo so the workflow can use that token:
   - In GitHub, go to the repo's **Settings → Secrets and variables → Actions → New repository secret**.
   - Add `CLOUDFLARE_API_TOKEN` — paste the token from step 2.
   - Add `CLOUDFLARE_ACCOUNT_ID` — find this on the Cloudflare dashboard's **Workers & Pages** overview page, under "Account Details" (it's a long string of letters and numbers, not secret, just an identifier).
4. Push any commit to `main` (or just re-save a page in Pages CMS once it's connected in Step 3) — this triggers the **Actions** tab in GitHub to run the deploy workflow automatically. First run takes a minute or two.
5. Once it succeeds, the site is live at `loading-events-website.<your-subdomain>.workers.dev`. Go to the Worker's **Domains** tab in Cloudflare and attach her real domain (this is where "hosted on Cloudflare" comes together — DNS and hosting live in the same place).
6. Optional cleanup: in the Worker's **Settings → Build**, if a "Git repository" connection shows there from earlier troubleshooting, click **Disconnect** — it's not being used for deploys anymore and would otherwise sit there permanently stuck.

From now on, every time content changes and gets saved (see Step 3), GitHub Actions rebuilds and republishes the site automatically — nobody has to touch this step again.

## Step 3 — Connect the content editor (10 min, one-time)

This is the "super simple backend" — a form-based editor called [Pages CMS](https://pagescms.org), free and built exactly for this (GitHub-backed static sites, no server to maintain).

1. Go to **app.pagescms.org** and sign in with GitHub (standard permission prompt — no developer setup needed, this is the hosted version).
2. Click **Add repository** and select `loading-events-website`.
3. It will read the `.pages.yml` file already included in this repo and turn every page into a simple form: text boxes, an image picker, and "add another" buttons for lists (like services or gallery photos).
4. Give your friend the app.pagescms.org login (she signs in with her own GitHub account, or you can invite her as a collaborator on the repo). Editing a page and clicking **Save** there automatically commits the change to GitHub, which triggers Cloudflare to rebuild the live site within a minute or two.

**Note:** Pages CMS's exact field types occasionally shift between versions. If a field looks slightly off the first time you open it (e.g. a list doesn't show "add" the way expected), it's a small tweak in `.pages.yml` — nothing structural needs to change.

## Step 4 — Turn on the contact form (5 min)

The Contact page form currently points to a placeholder. To make enquiries actually land in an inbox:

1. Sign up free at [formspree.io](https://formspree.io) (50 submissions/month free, plenty to start).
2. Create a form, point it at the email that should receive enquiries.
3. Copy the form endpoint URL it gives you (looks like `https://formspree.io/f/xxxxxxx`).
4. Paste it into the **Contact Page → Form Submission Link** field in Pages CMS (or edit `form_action` in `src/_data/contact.yaml` directly) and save.

---

## Email — recommendation

You asked about Google Workspace vs alternatives. For a client-facing wedding business, **Google Workspace (~£5-6/user/month)** is the one worth paying for: a real `hello@herdomain.com` inbox, and — more importantly for this business — **Google Calendar**, which is genuinely useful for coordinating wedding dates, venue visits, and vendor meetings without mixing it into a personal calendar. It's also the option a wedding photographer/planner's clients will find most familiar if she ever shares calendar invites or docs.

If cost is the deciding factor: **Cloudflare Email Routing** is free and will forward `hello@herdomain.com` straight to her existing personal inbox — no separate inbox to check, but replies go out from her personal address unless she manually sets up "send as" in Gmail. It's a fine starting point and easy to upgrade from later.

Either way, email setup happens in the same Cloudflare dashboard as the domain, under **Email**.

---

## Ongoing — what your friend can change herself

Once Pages CMS is connected, she can edit without you:
- All page text (headings, paragraphs, services, testimonials)
- Photos in the gallery (upload/replace/reorder)
- Navigation labels, contact email, Instagram link
- The homepage hero photo

What still needs you (or a developer) if it ever comes up: adding a brand-new page/section, changing the overall layout, or changing fonts/colors sitewide (those live in `src/css/styles.css`).
