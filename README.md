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
assets/img/         # hero poster frames (placeholders), favicon
assets/video/       # EMPTY. Drop hero-landscape.mp4 and hero-portrait.mp4 here (see below)
.raw/               # original logo PNG and the Wix stock clip (gitignored, not deployed)
```

## Design decisions

- **Palette** kept from their existing brand: forest green `#1F4A2E` / `#2B5336`, stone `#E8E5DA`,
  cream `#F7F4EC`, and the copper `#B07A45` from the logo tagline as the single accent. Flat colour, no gradients.
- **Fonts**: Cormorant Garamond (display) echoes the serif "NUTRITION & RECOVERY" line in the logo;
  Manrope for body. Their Wix site uses Avenir and Brandon Grotesque, both Wix-licensed and not free.
- **Logo** recoloured for the hero (script and leaf in cream, tagline keeps its gold, soft radial shade behind it for contrast) from their PNG. Original colours kept for
  light backgrounds, an all-cream version for the footer, and the leaf alone for the nav and favicon.
- **Sections**: hero → one-line positioning → about Samantha → services as a price list (not icon cards)
  → three-step "how it works" → contact → footer. One primary call to action, repeated three times.
- **Nav** is transparent over the hero and becomes a frosted glass bar (`backdrop-filter`) once scrolled,
  with solid fallbacks for browsers without it and for `prefers-reduced-transparency`.
- **Reduced motion**: the video is not loaded and the poster is shown still.

## Hero video

The current Wix site uses a Wix stock aerial clip of a conifer forest. Wix stock media is licensed for
use on Wix sites only, so it has not been reused. Until new footage exists, the hero shows a still frame
from that clip as a **placeholder poster** with a very slow drift. Replace both posters before anything
goes live.

To add video, drop two files into `assets/video/` and nothing else needs to change:

| File | Orientation | Target | Notes |
| --- | --- | --- | --- |
| `hero-landscape.mp4` | 16:9, 1920×1080 | ≤ 4 MB, 10–20 s | Used when the viewport is landscape (desktop, tablet landscape) |
| `hero-portrait.mp4` | 9:16, 1080×1920 | ≤ 2.5 MB, 10–20 s | Used when the viewport is portrait (phones, tablet portrait) |

Both must **loop seamlessly** (`loop` is set on the element). H.264, no audio track, `moov` atom at the
front (`-movflags +faststart`). Suggested encode from a Runway export:

```
ffmpeg -i runway-landscape.mp4 -an -c:v libx264 -profile:v high -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/hero-landscape.mp4
ffmpeg -i runway-portrait.mp4  -an -c:v libx264 -profile:v high -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/hero-portrait.mp4
```

Then export a poster frame from each and overwrite `assets/img/hero-poster-landscape.webp` and
`hero-poster-portrait.webp`.

### RunwayML prompts

See [RUNWAY-PROMPTS.md](RUNWAY-PROMPTS.md).

## Content sources

Everything on the page is taken from their own public site and Facebook page. Nothing about the
business is invented.

| Element | Source |
| --- | --- |
| Strapline "Nurture your body with all that nature has to offer" | Their homepage |
| Samantha's story, DLN / MCMA, 15 years, children's and pre/post pregnancy interest | Their "Our Story" page |
| Consultation and FoodPrint prices | Their Services page |
| Email | Their site footer and Facebook page |
| Webheath, Redditch | Their Facebook page "About" |
| Facebook link | `https://www.facebook.com/profile.php?id=61579757354575` (45 followers) |
| Logo | Their site, recoloured for the hero (script and leaf cream, tagline keeps its gold gradient) |
| Photo and CMA badge | Their "Our Story" page |
| "Food-specific IgG antibody test" | What a FoodPrint test is (Cambridge Nutritional Sciences product), not a claim from her site |
| hs-CRP = high-sensitivity C-reactive protein | Standard name of the test, not from her site |

## Things worth telling them

- **Their social icons are dead.** The Facebook, Instagram and Pinterest icons on the Wix site link
  to Wix's own accounts, not hers. Only Facebook has been linked here. Ask for Instagram if she has one.
- **Photo of Samantha** is the one from her "Our Story" page, cropped to 4:5. Ask for a higher-resolution
  original if this goes further (the Wix copy is 989px wide).
- **No testimonials** anywhere public. If she has any, a short quote after the services section would earn its place.
- **"Book a call" links to her existing Wix services page** so the mock-up is functional. On a real build
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
