# Handover: Nature to Nurture Nutrition & Recovery, full website build

Written 20 Oct 2026 at the end of the mock-up chat. Read this first, then README.md.

## Status

- Client: **Samantha**, Living Nutrition Practitioner, Webheath, Redditch. Email Samantha@naturetonurturenutrition.co.uk.
- She has **agreed to the full website**. The approved front-page mock-up in this folder is the design base.
- Mock-up live at https://naturetonurture.pages.dev/ (Cloudflare Pages project `naturetonurture`).
- Repo: https://github.com/RiverWood-AI/NatureToNurtureMockup, branch `main`, clean.
- Builder: James Killingsworth, RiverWood (jk@riverwoodai.com).

## Agreed in the build call (20 Oct 2026)

James confirmed the site stays roughly as the mock-up (single page, same repo and Pages project). Changes:

1. **New animated hero.** Samantha asked for passion flower, mushrooms (any kind) and wild garlic; she worries flowers plus waterfalls looks too whimsical and left the call to James. Two direction stills in `.raw/hero-v2/`: A, woodland floor without water; B, the stream with the plants on the bank.
   - Stills went through several rounds (`.raw/hero-v2/`). James chose **oyster-3**: passion flower climbing a hazel shrub (it grows on living shrubs, not stumps), oyster mushrooms on a fallen beech log, wild garlic, stream behind. Out-of-season combinations are fine; plants must grow where they really grow.
   - It is in as a still for now. A review-only **hero switcher** (bottom-left of the hero, `?hero=1` / `?hero=2`, remembered in localStorage) cycles between the stream video and the stills. Since 20 Oct it has four options: stream video, woodland edge (oyster-3), kitchen table (`.raw/hero-v3/1b-kitchen-cottage-window.png`) and passion flower close-up (`.raw/hero-v3/3-passion-flower-close.png`). Portrait versions of the last two are plain crops; on phones the passion flower sits behind the logo, so it needs its own portrait image if chosen. **Remove the switcher before launch.** Animate oyster-3 later.
   - Fixed the "pop zoom" she disliked: the poster was scaled 1.06 with a drift animation, the video at 1.0, so the picture jumped when the video faded in. The poster is now unscaled.
2. **Her photo** replaced with the one she supplied (styled version, cropped).
3. **Contact form** instead of email only. She gets few emails, mostly calls, and her call screening confuses people. Built: Pages Function + Turnstile + Resend (see README). Needs the Resend key, Turnstile widget and a verified sender.
4. **Product images.** Waiting to hear which products and where the images come from.
7. **GutMapDx** (her supplier): logo and a short practitioner-only paragraph added under the service cards, from their info sheet and her email. No prices or test names yet.
5. Google Business Profile: James is sending her a set-up guide. Add the profile URL to `sameAs` in JSON-LD once it exists.
6. IONOS: James is emailing her the login link; switch-over by screen share when ready.

## Launch prep done (21 Oct 2026)

- `robots.txt`, `sitemap.xml`, `llms.txt`, canonical, Open Graph / Twitter tags, 1200×630 share image, JSON-LD (HealthAndBeautyBusiness + Person + WebSite, with prices). All use `https://www.naturetonurturenutrition.co.uk/`.
- `_headers`: CSP (self, Google Fonts, Turnstile only), HSTS, nosniff, no framing, referrer and permissions policies, 30-day asset cache, `noindex` on `*.pages.dev`. Tested locally: video, fonts and Turnstile all work, no console errors.
- Mobile menu now used up to 900px (the desktop nav wrapped on tablets). Checked 360, 390, 768, 1024, 1280 wide: no sideways scroll.
- Heading order fixed ("How it works" is now an h2). Food banner, footer logo and hero logo re-encoded smaller.

## Changes from the full call transcript (22 Oct 2026)

- Test prices removed everywhere (page, JSON-LD, llms.txt). Testing card now says it comes as a package with a consultation; ask for options.
- New "Testing partners" section: GutMapDx and Cambridge Nutritional Sciences (CNSLab, confirmed by James 22 Oct 2026, logo from cnslab.co.uk). CNSLab sells FoodPrint direct to the public too, so only GutMapDx is described as practitioner-only. No links to partner sites yet.
- Kitchen and woodland hero stills have a soft background blur baked in (originals in `.raw/`). Woodland is anchored to the top so the mushrooms sit below the buttons on wide screens; the phone crop still puts them near the buttons.

## Polish (22 Oct 2026)

- Section padding reduced (max 6rem, was 8rem). Cards, partner cards and the two photos lift gently on hover (pointer devices only, off for reduced motion).
- Contact section: deep forest gradient with a faint copper glow, instead of the flat green. Email address removed from view; "Or email instead" link sits beside Send message.
- Footer: one row on desktop (logo, links, Facebook logo), legal and credit underneath. Official Facebook "f" logo used in contact and footer.
- Hero logo: stronger layered shadow and a deeper centre shade so it stands out on bright heroes.

## Still to do before go-live

1. Samantha picks the hero; remove the switcher; rebuild `share.jpg` from that hero.
2. Resend API key, verified sender, real Turnstile site key and secret.
3. Privacy notice (the form collects personal data) and the quoted terms page: wording from her.
4. Google Business Profile URL into JSON-LD `sameAs`.
5. DNS move once IONOS account access is sorted. Update `lastmod` in sitemap.xml at launch.
6. After launch: submit the sitemap in Google Search Console, test with Google's Rich Results Test and a Facebook share preview.

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
- No AI-slop tells: no tracked uppercase labels, no icon grids, no white buttons, no corny headings. Gradients: James asked for one on the contact section (22 Oct 2026), so subtle ones are fine where he asks.
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
