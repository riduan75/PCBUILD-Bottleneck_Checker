# PC Bottleneck Checker

A small, dependency-free website that estimates the bottleneck in a PC build from its **CPU, GPU, RAM and display resolution**. It tells you whether the build suits **1080p, 1440p or 4K** gaming and what to upgrade.

## Features
- CPU/GPU balance check with a bottleneck percentage
- Labels: CPU bottleneck, GPU-limited (normal), or well balanced
- 1080p / 1440p / 4K readiness rating
- Upgrade suggestions for CPU, GPU and RAM
- Light and dark theme, mobile friendly

## Run locally
No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. Your site appears at `https://<your-username>.github.io/<repo-name>/`.

## How the score works
Each CPU and GPU has a relative gaming score (best part = 100) in `script.js`.

- `F` sets how much GPU a CPU can feed at each resolution. Higher resolutions put more load on the GPU, so the CPU matters less.
- `ratio = (CPU score × F[resolution]) / GPU score`
  - below 0.9: CPU bottleneck
  - above 1.3: GPU-limited (normal for gaming)
  - otherwise: balanced
- `NEED` sets the GPU score wanted for a good experience at each resolution.
- Less than 16 GB RAM lowers the readiness rating.

These are estimates, not benchmarks. Real results depend on the game, settings, cooling and RAM speed.

## Add or edit parts
Open `script.js` and add an entry to `CPUS` or `GPUS`:

```js
["Ryzen 5 9600X", 78]   // ["name", score]
```

Scores are relative: Ryzen 7 7800X3D = 100 for CPUs, RTX 4090 = 100 for GPUs. Base new scores on benchmark sites such as TechPowerUp or Tom's Hardware.

## Project structure
```
index.html   page markup
style.css    styles (light and dark)
script.js    part data and bottleneck logic
```

## Ideas for later
- RAM speed and DDR4/DDR5 support
- Search box for parts
- Target FPS option (60 / 144)
- Move part data to a `parts.json` file

## License
MIT
