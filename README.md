# Nature to Nurture Nutrition & Recovery — front-page mock-up

A single-page redesign of the front page of [naturetonurturenutrition.co.uk](https://www.naturetonurturenutrition.co.uk/)
(currently on Wix), built as a speculative mock-up for **Samantha, Living Nutrition Practitioner, Webheath, Redditch**.

Front page only. No other pages exist at this stage.

## Stack

Plain static HTML / CSS / JS. No build step, no dependencies beyond two Google Fonts.

```
index.html          # the whole page
styles.css          # all styling
script.js           # glass nav, mobile menu, hero video selection, scroll reveals, footer year
assets/logo/        # recoloured logo variants, RiverWood credit logo
assets/img/         # hero poster frames (placeholders), her photo, CMA badge, three generated section images, favicon
assets/video/       # hero-landscape.mp4 and hero-portrait.mp4 (Pexels, see below)
tools/maskloop.py   # builds the water-only crossfade loop from a slowed clip
functions/api/      # contact form Pages Function (Turnstile + Resend)
robots.txt, sitemap.xml, llms.txt   # search and AI-assistant discovery, all point at the real domain
_headers            # security headers (CSP, HSTS, no framing), asset caching, noindex on *.pages.dev
.raw/               # original logo PNG, Wix clip, Pexels originals, generated image PNGs (gitignored, not deployed)
```

## Design decisions

- **Palette** kept from their existing brand: forest green `#1F4A2E` / `#2B5336`, stone `#E8E5DA`,
  cream `#F7F4EC`, and the copper `#B07A45` from the logo tagline as the single accent. Flat colour, no gradients.
- **Fonts**: Cormorant Garamond (display) echoes the serif "NUTRITION & RECOVERY" line in the logo;
  Nunito Sans for body as the closest free match to the Avenir on their Wix site; Jost for nav, buttons and links as a free geometric in the spirit of the Brandon Grotesque their Wix headings use. Both originals are Wix-licensed and not free.
- **Logo** recoloured for the hero (script and leaf in cream, tagline keeps its gold, soft radial shade behind it for contrast) from their PNG. Original colours kept for
  light backgrounds, an all-cream version for the footer, and the leaf alone for the nav and favicon.
- **Sections**: hero → one-line positioning → about Samantha → services as a price list (not icon cards)
  → three-step "how it works" → contact → footer. One primary call to action, repeated three times.
- **Nav** is transparent over the hero and becomes a frosted glass bar (`backdrop-filter`) once scrolled,
  with solid fallbacks for browsers without it and for `prefers-reduced-transparency`.
- **Reduced motion**: the video is not loaded and the poster is shown still.

## Hero video

Both orientations are a generated woodland stream (see RUNWAY-PROMPTS.md for the workflow). Both loop with a crossfade: the clip's last few seconds dissolve into its first few, so the loop point is invisible.

| File | Source | Treatment |
| --- | --- | --- |
| `assets/video/hero-landscape.mp4` | AI-generated: still from OpenAI gpt-image (`.raw/stream-still-landscape.png`), animated in Kling 3.0 Pro (image-to-video, static camera) | slowed 2.5x with motion interpolation, 3 s crossfade loop (16.9 s), then **only the water moves**: a temporal-variance mask lets the stream through and holds everything else as a still plate, so leaf shadows cannot jump at the loop. 1600×900, 24 fps, H.264 CRF 24. Forest-drone version kept in `.raw/forest-hero-backup/` |
| `assets/video/hero-portrait.mp4` | AI-generated: still from OpenAI gpt-image (`.raw/stream-still-portrait-9x16.png`), animated in Kling 3.0 Pro | same treatment, 720×1280, CRF 28 |

The page picks landscape or portrait by viewport orientation (see `script.js`), shows the matching poster
(`assets/img/hero-poster-*.webp`, taken from frame one of each clip) until the video is playing, and skips
the video entirely under `prefers-reduced-motion`. Originals are kept in `.raw/` (gitignored).

The three Kling / Runway attempts at generating this footage are documented in
[RUNWAY-PROMPTS.md](RUNWAY-PROMPTS.md) for reference. Stock won.

### RunwayML prompts

See [RUNWAY-PROMPTS.md](RUNWAY-PROMPTS.md).

## Content sources

Everything on the page is taken from their own public site and Facebook page. Nothing about the
business is invented.

| Element | Source |
| --- | --- |
| Strapline "Nurture your body with all that nature has to offer" | Their homepage |
| Samantha's story, DLN / MCMA, 15 years, children's and pre/post pregnancy interest | Their "Our Story" page |
| Consultation prices | Their Services page. Test prices removed: Samantha asked for no pricing on testing (call, 9 Oct 2026, 13:56) |
| Email | Their site footer and Facebook page |
| Webheath, Redditch | Their Facebook page "About" |
| Facebook link | `https://www.facebook.com/profile.php?id=61579757354575` (45 followers) |
| Logo | Their site, recoloured for the hero (script and leaf cream, tagline keeps its gold gradient) |
| Photo of Samantha | Supplied by Samantha, 20 Oct 2026 (`.raw/samantha-styled.png`, a styled version of her own photo `.raw/samantha-sushi-original.jpg`), cropped to 4:5 without the logo and text |
| CMA badge | Their "Our Story" page; Samantha confirmed she may use it as a CMA member |
| Testing partners section, "tests only through a practitioner, as a package with a consultation" | Call, 9 Oct 2026, 10:30–12:00 and 13:56 |
| Cambridge Nutritional Sciences (CNSLab) card and logo | cnslab.co.uk home page and FoodPrint page (checked 22 Oct 2026): 35+ years, UK lab in Littleport, Ely, Cambridgeshire, ISO standards. Logo `assets/logo/cnslab.svg` from their site. Note: CNSLab also sells FoodPrint direct to the public, so "practitioner-only" is stated for GutMapDx only |
| GutMapDx paragraph and logo | GutMapDx's own information sheet and logo, supplied by Samantha (`.raw/gutmapdx-info.png`), plus her email: practitioner-only, not sold direct to consumers |
| Woodland-edge hero still (`hero-woodland-*.webp`) | AI-generated (OpenAI gpt-image), oyster mushrooms, passion flower, wild garlic. Source `.raw/hero-v2/oyster-3.png` |
| Flat-lay, food banner, herb jars and desk photos | AI-generated (OpenAI gpt-image) for this mock-up. Not hers. Presented as placeholders for real photography of her practice |
| "Food-specific IgG antibody test" | What a FoodPrint test is (Cambridge Nutritional Sciences product), not a claim from her site |
| hs-CRP = high-sensitivity C-reactive protein | Standard name of the test, not from her site |
| "Worcestershire" in structured data | Geography (Redditch is in Worcestershire), not a claim from her site |
| Share image `assets/img/share.jpg` | Stream hero poster, darkened, with her recoloured logo. Rebuild from the chosen hero |

## Things worth telling them

- **Their social icons are dead.** The Facebook, Instagram and Pinterest icons on the Wix site link
  to Wix's own accounts, not hers. Only Facebook has been linked here. Ask for Instagram if she has one.
- **Photo of Samantha** is the one from her "Our Story" page, cropped to 4:5. Ask for a higher-resolution
  original if this goes further (the Wix copy is 989px wide).
- **No testimonials** anywhere public. If she has any, a short quote after the services section would earn its place.
- **Nothing links to the old Wix site.** The booking buttons go to the contact section. On a real build
  this would be a booking widget or a simple form.
- The consultation prices were correct as of 8 Sep 2026. Check before publishing.

## Deploying

Cloudflare Pages uploads everything in the target directory, so deploy from a staged folder that
excludes `.raw/`. The `deploy.sh` script does this:

```
./deploy.sh
```

which stages `index.html`, `styles.css`, `script.js` and `assets/` and runs
`wrangler pages deploy` against `wrangler.jsonc` (project `naturetonurture`, output dir `.deploy`).

Live: https://naturetonurture.pages.dev/

## Contact form

`functions/api/contact.js` is a Cloudflare Pages Function. Wrangler picks up `functions/` from the project root
when deploying, so it is not copied into `.deploy/`. It checks a honeypot field, verifies Cloudflare Turnstile,
then emails the enquiry to Samantha through Resend with `reply_to` set to the visitor.

- Vars in `wrangler.jsonc`: `CONTACT_TO` (her inbox), `CONTACT_FROM` (must be on a domain verified in Resend).
- Secrets, set once and never committed: `npx --yes wrangler@latest pages secret put RESEND_API_KEY --project-name naturetonurture`, same for `TURNSTILE_SECRET`.
- `index.html` currently carries Cloudflare's **test** Turnstile site key (`1x00000000000000000000AA`). Swap in the real site key when the widget is created.
- Local testing: copy `.dev.vars.example` to `.dev.vars` (gitignored), stage `.deploy/`, then run the `pages` launch config (`wrangler pages dev` on port 8788).
