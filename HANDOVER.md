# Handover: Nature to Nurture Nutrition & Recovery, full website build

Written 20 Oct 2026 at the end of the mock-up chat. Read this first, then README.md.

## Status

- Client: **Samantha**, Living Nutrition Practitioner, Webheath, Redditch. Email Samantha@naturetonurturenutrition.co.uk.
- She has **agreed to the full website**. The approved front-page mock-up in this folder is the design base.
- Mock-up live at https://naturetonurture.pages.dev/ (Cloudflare Pages project `naturetonurture`).
- Repo: https://github.com/RiverWood-AI/NatureToNurtureMockup, branch `main`, clean.
- Builder: James Killingsworth, RiverWood (jk@riverwoodai.com).

## Quoted scope (one-page quote sent)

1. 30-minute design review call before build
2. Website design and build: home, services, our story, contact, terms
3. Hero video and imagery, optimised for fast loading
4. Search and AI optimisation (titles, descriptions, LocalBusiness/HealthAndBeautyBusiness structured data) and social sharing previews (Open Graph / Twitter cards)
5. Domain migration from Wix to Cloudflare, email unaffected
6. Go-live checks and handover

Confirm with James which pages were finally agreed before building the extra ones.

## Domain and DNS: open issue, blocks go-live only

Verified from Nominet WHOIS and live DNS on 15 Oct 2026:

| Thing | Where |
| --- | --- |
| Registrar | IONOS (tag 1AND1), registered 19 Nov 2022 |
| **Expiry** | **19 Nov 2026**. Check auto-renew |
| Nameservers | Wix: ns4.wixdns.net, ns5.wixdns.net |
| Website | Wix (A records 185.230.63.x, www CNAME cdn3.wixdns.net) |
| Email | IONOS, MX mx01.ionos.co.uk. No SPF TXT record seen publicly |

- Samantha logs into login.ionos.co.uk and lands in **webmail**: she is using mailbox credentials, not account credentials.
- She needs the IONOS **account** login (customer number + account password). Asked her to check whether she pays IONOS (bank statement / invoice email gives the customer number). If she doesn't pay, someone else holds the account and must give her access.
- Plan once she has access: add the domain to Cloudflare (it imports records from **Wix** DNS, not IONOS), check MX/mail records are complete, then send her the two Cloudflare nameservers to enter at IONOS. A draft instruction email for that step exists in the old chat; rewrite as needed.
- Do **not** transfer the registration. DNS move only.
- Cancel Wix premium only after the new site is live.

## Design system (keep)

- Palette: forest green `#1F4A2E` / `#163A24` / `#2B5336`, stone `#E3E0D3`, cream `#F0ECE2`, copper `#B07A45`, sand `#D9BC8C` (buttons on dark).
- Fonts: Cormorant Garamond (headings), Nunito Sans (body, Avenir stand-in), Jost (nav, buttons, links), Lora italic (section labels, copper).
- Buttons: leaf-shaped corners (`1.5rem .55rem 1.5rem .55rem`), flip on hover, soft glow.
- Nav: dark fade over the hero, crossfades to cream glass (blur 18px, 58% cream) over the first 140px of scroll. Script wordmark + leaf cut from her logo PNG. On mobile the brand is hidden until scrolled; the menu fades in with staggered links.
- Hero: generated woodland stream video, two orientations, crossfade loop with only the water moving (`tools/maskloop.py`). Posters taken from the clips. Reduced-motion users get the still.
- Sections: intro + flat-lay, about (her photo + CMA badge), full-width food banner, services as three stone cards, how it works (desk photo + 3 steps), contact (single dark band), footer in the same green with RiverWood credit.

## James's preferences (learned the hard way)

- **Verifiable facts only.** Every claim must come from her own site, Facebook or what she tells him. He audits for invented phrasing. Keep the sources table in README.md up to date.
- No AI-slop tells: no tracked uppercase labels, no icon grids, no gradients, no white buttons, no corny headings.
- **No links to the old Wix site** anywhere.
- No ping-pong video loops. Calm, slow motion only.
- No time estimates in replies.
- Short wording when he asks for copy (quotes, messages).
- Commit, push and deploy after each change he approves; screenshot desktop and mobile before reporting.

## Placeholders to replace with her real material

- Hero video (AI-generated stream), flat-lay, food banner, herb jars, desk: all generated, flagged in README.
- Her photo is the 989px Wix copy. Ask for a higher-res original.
- No testimonials exist yet.
- Contact is email only. Booking method not decided (email, form, or calendar link).

## Things to ask her (design review)

Photos, logo source files, confirmed prices, T&Cs text, testimonials, booking method, phone/WhatsApp public or not, Instagram, blog keep or drop, who updates the site after launch, Google Business Profile (recommended: service-area business, address hidden, category Nutritionist).

## Technical notes

- Static HTML/CSS/JS, no build step. `deploy.sh` stages files into `.deploy/` and runs `npx --yes wrangler@latest pages deploy` against `wrangler.jsonc`.
- Wrangler OAuth works on this machine. If a Pages project has to be recreated, `pages project create` needs `--force` once (Wrangler tries to delegate to Workers).
- `gh` logged in as RiverWood-AI.
- ffmpeg via `pip install imageio-ffmpeg`. Edge headless for screenshots; capture mobile through a 390px iframe wrapper.
- OpenAI image MCP available (`generate_image`); use quality `medium`, `high` times out.
- `.raw/` (gitignored) holds originals: her logo PNG, Wix clip, Kling clips, stills, mask plates, forest-drone backup.

## Suggested first steps in the new chat

1. Read this file and README.md; skim index.html and styles.css.
2. Decide with James whether to keep building in this repo or start a fresh production repo (e.g. `NatureToNurture`) seeded from this one. A new Cloudflare project name for production is sensible either way.
3. Turn the single page into a small multi-page site sharing one header/footer (agreed pages only).
4. Add SEO/AEO and Open Graph from the start: per-page titles and descriptions, JSON-LD, og:image built from the hero poster, sitemap.xml, robots.txt.
5. Swap placeholders as her material arrives.
6. Go-live only once the IONOS access issue above is resolved.
