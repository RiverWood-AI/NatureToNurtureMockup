# Hero video: RunwayML prompts and workflow

Two clips are needed, landscape (16:9) and portrait (9:16). Both must loop without a visible cut.

## Recommended approach: image-to-video, not text-to-video

Text-to-video gives a different forest every run, so the two orientations will not match. Instead:

1. Generate (or photograph) **one still image** of the forest canopy, then crop it to 16:9 and 9:16.
2. Feed each crop into Runway **Gen-4 image-to-video** with the motion prompt below.
3. Use Runway's **loop / "seamless loop"** option if the model version offers it. If not, generate a
   5 s clip and use the ping-pong method described at the bottom.

The still keeps the two orientations consistent. The motion prompt only has to describe the camera move.

### Still image prompt (use in Runway's image tool, Midjourney, or similar)

> Aerial drone photograph looking straight down, slightly angled, over a dense mixed forest canopy in
> soft early-morning light. Mostly Scots pine and spruce with a few lighter deciduous crowns, deep and mid
> greens, no autumn colour. Gentle mist in the far distance only. Natural, muted, slightly desaturated
> colour grade. No people, no roads, no buildings, no water, no text. Calm, even composition with no
> single dominant tree. Photorealistic, 35 mm, f/8, high detail.

Generate at the largest size available, then crop. For the portrait crop pick an area where the canopy
texture is fairly even top to bottom, because that crop shows a lot of vertical space.

### Motion prompt (Gen-4 image-to-video, both orientations)

> Slow, smooth aerial drone glide forward over the forest canopy, camera tilted slightly down, constant
> speed, no acceleration, no rotation, no zoom. Treetops sway very gently in a light breeze. Soft even
> light, no lens flare, no colour shift. Calm and continuous, like the opening of a nature documentary.

Settings that matter:

- **Duration**: 10 s if available, otherwise 5 s and use the loop method below.
- **Camera motion**: forward or "dolly in" at the lowest intensity. Avoid pan, roll and orbit.
- **Motion amount / strength**: low (2–3 of 10). More than that and branches start to wobble unnaturally.
- **Seed**: fix it and reuse it for the second orientation so the two clips feel like one shoot.
- **Upscale** to 1080p on export. Do not add Runway's audio.

Negative prompt, if the model version accepts one:

> people, birds, animals, roads, buildings, water, text, watermark, lens flare, fast motion, camera shake,
> rotation, zoom, autumn colours, snow, fog covering the trees

## Text-to-video (no still image)

If you would rather Runway generates the footage outright, prompt for a **hover, not a glide**. A hover
ping-pongs invisibly, because a reversed sway just looks like more sway, and it also hides the fact that
the landscape and portrait clips are different forests.

> Aerial drone shot hovering almost still above a dense pine and spruce forest canopy, looking down at a
> slight angle, soft early-morning light. The camera holds position with only a very slow, barely
> perceptible drift. Treetops sway gently in a light breeze. Deep and mid greens, natural muted colour
> grade, no autumn colour, gentle mist far in the distance only. No people, animals, roads, buildings,
> water or text. Calm, continuous, documentary realism.

Generate 16:9 first. If you like it, use a frame from it as the start image for the 9:16 run so the two
match. Settings: 10 s if offered, camera motion off or minimum, motion strength 2/10, fixed seed reused
for both, 1080p upscale, no audio. Same negative prompt as above. Loop with the ping-pong method below.

## What finally worked: a woodland stream, image-to-video

The forest canopy never generated well (no subject, no motion). A stream did, first time, in Kling 3.0 Pro:

1. Generate the still with a clear composition brief: falls in the outer third (landscape) or bottom
   quarter (portrait), calm shaded moss where the logo sits, no sky. Stills are in `.raw/stream-still-*.png`.
2. Image-to-video with the still as the **first frame only**, a static camera and flowing water.
3. Kling makes the water run far too fast for a brook. Fix in post: slow 2.5x with motion interpolation
   (`setpts=2.5*PTS,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`), then the
   crossfade loop below. Water hides the dissolve completely.
4. Kling also drifts leaves and shadows, which snap back at the loop. Fix: a temporal-variance mask
   (`tools/maskloop.py`) so only the water region comes from the video and
   the rest is a frozen first frame. Use `-t` on the merge; `-loop 1` image inputs otherwise never end.

## Making it loop seamlessly

A forward glide can never loop on its own because the end frame is a different patch of forest from the
start. Three options, best first:

1. **Runway's loop setting.** Some Gen-4 modes include a loop or "extend and loop" toggle. Use it and
   check the join frame by frame.
2. **Crossfade loop (what the site uses).** Trim the first `d` seconds off, then dissolve the last `d`
   seconds of the remainder into that trimmed head. The camera only ever moves one way; on uniform
   canopy a 2-3 s dissolve is invisible. In ffmpeg, with clip length `L`:

   ```
   ffmpeg -i clip.mp4 -filter_complex "[0:v]split[a][b];[a]trim=d:L,setpts=PTS-STARTPTS,fps=24,settb=AVTB[m];[b]trim=0:d,setpts=PTS-STARTPTS,fps=24,settb=AVTB[h];[m][h]xfade=transition=fade:duration=d:offset=L-2d[v]" -map "[v]" -an loop.mp4
   ```

3. **Ping-pong.** Play the clip forward then backward. James found the direction change too visible on
   a forward glide, so prefer the crossfade. Fine for a hover:

   ```
   ffmpeg -i clip.mp4 -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1:a=0,setpts=N/FRAME_RATE/TB" -an pingpong.mp4
   ```

   Trim one frame from the join if you see a stutter.

## Alternatives worth considering for this kind of site

- **Free stock.** Pexels and Pixabay have CC0 aerial forest clips in both orientations, many already
  loopable. Search "aerial forest canopy", "drone treetops", "pine forest from above". Zero generation
  cost and no AI artefacts. Downside: another site may use the same clip.
- **A still photo with slow drift.** What the placeholder does now. Cheapest, loads instantly, never
  stutters on a poor mobile connection, and reads as calm rather than busy. Genuinely a defensible
  choice for a nutritionist's site.
- **Commission a short drone clip.** A local drone operator would charge a modest fee for 30 s over a
  Worcestershire woodland. It would be hers, unique, and could be used on social media too.

## Encoding for the site

See the README. Target ≤ 4 MB landscape, ≤ 2.5 MB portrait, H.264, no audio, `faststart`. Drop the
files into `assets/video/` as `hero-landscape.mp4` and `hero-portrait.mp4`.
