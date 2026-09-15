"""Crossfade-loop a slowed clip, but let only the water move.
A temporal-variance map finds the water; everything else is frozen to a still plate."""
import sys, os, subprocess
import numpy as np
from PIL import Image, ImageFilter
import imageio_ffmpeg

ff = imageio_ffmpeg.get_ffmpeg_exe()
src, out, W, H, d, crf, thresh = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5]), sys.argv[6], float(sys.argv[7])
tag = os.path.splitext(os.path.basename(out))[0]

# duration
info = subprocess.run([ff, '-i', src], capture_output=True, text=True).stderr
dur = [l for l in info.splitlines() if 'Duration' in l][0].split('Duration:')[1].split(',')[0].strip()
hh, mm, ss = dur.split(':'); L = int(hh) * 3600 + int(mm) * 60 + float(ss) - 0.05

# 1. temporal variance at quarter res
sw, sh = W // 4, H // 4
frames = []
for i, f in enumerate(imageio_ffmpeg.read_frames(src, output_params=['-vf', f'scale={sw}:{sh}', '-r', '6'])):
    if i == 0: continue  # first item is metadata
    frames.append(np.frombuffer(f, np.uint8).reshape(sh, sw, 3).astype(np.float32))
a = np.stack(frames)
std = a.std(axis=0).mean(axis=2)
print('std range', std.min(), np.percentile(std, 50), np.percentile(std, 90), std.max())
m = (std > thresh).astype(np.float32)
mask = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(6))
mask = mask.resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(10))
mask.save(f'.raw/{tag}-mask.png')
print('mask coverage', np.array(mask).mean() / 255)

# 2. crossfade loop of the moving footage
fc = (f"[0:v]scale={W}:{H}:flags=lanczos,split[s0][s1];"
      f"[s0]trim={d}:{L},setpts=PTS-STARTPTS,fps=24,settb=AVTB[main];[s1]trim=0:{d},setpts=PTS-STARTPTS,fps=24,settb=AVTB[head];"
      f"[main][head]xfade=transition=fade:duration={d}:offset={L-2*d:.3f}[v]")
subprocess.run([ff, '-v', 'error', '-y', '-i', src, '-filter_complex', fc, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '14', f'.raw/{tag}-loop.mp4'], check=True)

# 3. still plate = first frame of the loop; merge: plate where mask is black, loop where white
subprocess.run([ff, '-v', 'error', '-y', '-i', f'.raw/{tag}-loop.mp4', '-frames:v', '1', f'.raw/{tag}-plate.png'], check=True)
fc2 = (f"[0:v]format=gbrp[base];[1:v]format=gbrp[over];[2:v]format=gray[m];"
       f"[base][over][m]maskedmerge,format=yuv420p[v]")
subprocess.run([ff, '-v', 'error', '-y', '-loop', '1', '-i', f'.raw/{tag}-plate.png', '-i', f'.raw/{tag}-loop.mp4', '-loop', '1', '-i', f'.raw/{tag}-mask.png',
                '-filter_complex', fc2, '-map', '[v]', '-shortest', '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], check=True)
print(out, os.path.getsize(out) // 1024, 'KB')
# preview: plate with mask tinted
plate = Image.open(f'.raw/{tag}-plate.png').convert('RGB'); mk = np.array(mask).astype(np.float32) / 255
p = np.array(plate).astype(np.float32); p[..., 0] = p[..., 0] * (1 - mk) + 255 * mk
Image.fromarray(p.astype(np.uint8)).resize((W // 2, H // 2)).save(f'.raw/{tag}-maskpreview.jpg', quality=80)
