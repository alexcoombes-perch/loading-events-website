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

Cloudflare merged "Pages" into "Workers" — you may see either name depending on when you're reading this, but the flow is the same:

1. In the Cloudflare dashboard, go to **Workers & Pages → Create Application**.
2. Choose **Import a repository** (sometimes shown as "Connect to Git"), select your GitHub account, authorize it, then select the `loading-events-website` repo.
3. On the build/configure screen, set:
   - **Build command:** `npm install && npx eleventy`
   - **Deploy command / output directory:** `dist` (a `wrangler.jsonc` is already included in this repo pointing at `./dist`, so Cloudflare should pick this up automatically — if it offers to open a PR to add its own config file, you can decline since one's already there)
4. Click **Save and Deploy**. First build takes a minute or two — you'll get a preview URL (`*.workers.dev` or `*.pages.dev`).
5. Once it looks right, go to the project's **Custom domains** tab and attach her real domain (this is where "hosted on Cloudflare" comes together — DNS and hosting live in the same place).

From now on, every time content changes and gets saved (see Step 3), Cloudflare rebuilds and republishes the site automatically — nobody has to touch this step again.

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
