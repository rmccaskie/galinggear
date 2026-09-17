# Cloudflare Pages — Setup Guide

Connect `rmccaskie/galinggear` to Cloudflare Pages and point `galinggear.com` and `galinggear.ph` at it.

---

## 1. Create a Pages project

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, choose **Workers & Pages** → **Create application** → **Pages**.
3. Select **Connect to Git**.
4. Authorise Cloudflare to access your GitHub account if prompted.
5. Choose the repository **rmccaskie/galinggear**.
6. Click **Begin setup**.

---

## 2. Build settings

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Node.js version | `20` (set under Environment variables or in `.nvmrc`) |

---

## 3. Environment variables

Add these in **Settings → Environment variables** for the **Production** environment (and optionally **Preview** if you want the subscribe form to work in preview deploys):

| Variable | Where to find the value |
|---|---|
| `SUPABASE_URL` | Supabase project → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase project → Settings → API → `anon` `public` key |

> **Note:** These variables are server-only (no `PUBLIC_` prefix) because the subscribe endpoint is a server-side API route. The anon key is safe for server use with RLS: it grants INSERT-only access to the `subscribers` table.

---

## 4. Deploy

Click **Save and Deploy**. Cloudflare will clone the repo, run `npm run build`, and publish `dist/`.

The first deploy URL will be something like `galinggear.pages.dev`.

---

## 5. Custom domains

### galinggear.com

1. In the Pages project, go to **Custom domains** → **Set up a custom domain**.
2. Enter `galinggear.com` and confirm.
3. Cloudflare will detect that the domain is already on your account and add the CNAME automatically.
4. Repeat for `www.galinggear.com` if you want the `www` subdomain to also resolve.

### galinggear.ph

1. Add `galinggear.ph` the same way.
2. Cloudflare will add the CNAME `galinggear.ph → galinggear.pages.dev` automatically.

Both domains should be active within a few minutes. SSL certificates are provisioned automatically.

---

## 6. Hybrid mode — why the adapter is required

The site uses `output: 'static'` with one server-rendered route: `src/pages/api/subscribe.ts` (opt-out with `export const prerender = false`). The `@astrojs/cloudflare` adapter converts that route into a Cloudflare Worker function. Without the adapter, the API route will not work in production.

The adapter is already configured in `astro.config.mjs` — no changes needed.

---

## 7. Branches and preview deploys

By default, Cloudflare Pages builds every branch push and creates a preview URL. Production builds come from `main`. No additional configuration is needed.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with "Cannot find module" | Check Node.js version is set to 20 |
| Subscribe form returns 500 | Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in environment variables |
| Custom domain shows "Invalid SSL" | Wait up to 24 hours for DNS propagation; Cloudflare usually resolves this automatically |
| `galinggear.ph` not resolving | `.ph` domains may need additional nameserver verification; contact your registrar if the domain was recently transferred |
