# animate-my-work

**Category:** 🎬 Motion · **Works with:** Claude Code, Figma, Remotion · **Version:** see [marketplace.json](../../.claude-plugin/marketplace.json)

Turn your own designs into a finished motion film. You give Claude a short brief and your Figma frames (or Krea / FLORA
images, brand or partner work). Claude storyboards the film in Figma, writes it as code, renders it with Remotion, and
hands you an MP4 with music cut to the beat and sound effects that stand out clearly over the music.

You don't animate anything by hand. You approve the story, and Claude does the rest.

---

## What you get

- A **1920×1080, 60 fps MP4**. A launch film is 45–60 s and an explainer is 90–120 s, unless you ask for something else.
- **Designed transitions** at every cut: zooms, pushes, iris reveals, whips, colour swipes, shared elements that fly
  between scenes, and an implode into your logo. No hard jumps and no slideshow feel.
- **Music re-cut on bar lines**, so the drop lands on your first reveal and the final hit lands on your end card.
- **Sound effects tied to the motion** (whooshes, clicks, pops, ticks, key clicks), mixed loud enough to hear and
  checked with real measurements.
- A **storyboard in your Figma file**, so you can see and approve the film before it renders.
- **Quality checks** that actually run: still frames at every cut, a jump check, a motion (energy) check and a sound
  report.

---

## Before you start

You need these on a Mac (Linux works too):

| Tool | Why | Check it with |
|-|-|-|
| [Claude Code](https://claude.com/claude-code) | runs the skill | `claude --version`, or the Code tab in the Claude desktop app |
| Figma MCP, connected to Claude Code | reads your frames and builds the storyboard | ask Claude "is Figma connected?" |
| Node.js 22.6 or later | runs Remotion | `node -v` |
| ffmpeg | encodes video and mixes the sound | `ffmpeg -version` |
| Python 3, plus a few packages | sound mixing and image checks | `python3 --version` |
| git | the studio is a git project | `git --version` |

Install what's missing (macOS with [Homebrew](https://brew.sh)):

```bash
brew install node ffmpeg
pip3 install pillow numpy opencv-python-headless soundfile librosa
```

If `pip3` refuses, add `--user` or `--break-system-packages` to the end.

> Remotion is free for individuals and companies of up to 3 people. A bigger company needs a Remotion company licence
> ([remotion.dev/license](https://remotion.dev/license)).

---

## Install the skill

Pick **one** of these.

### Option A: as a Claude Code plugin (recommended)

In Claude Code, type:

```
/plugin marketplace add zazzygfx/zazzy-skills
/plugin install zazzy-motion@zazzy-skills
```

You get updates whenever the repo changes. As a plugin, the command may appear as `/zazzy-motion:animate-my-work`.

### Option B: copy it into your skills folder

```bash
git clone https://github.com/zazzygfx/zazzy-skills.git
mkdir -p ~/.claude/skills
cp -R zazzy-skills/skills/animate-my-work ~/.claude/skills/animate-my-work
```

Every Claude Code session on your computer can now run `/animate-my-work`.

### Option C: any agent that reads Agent Skills

```bash
npx skills@latest add zazzygfx/zazzy-skills
```

---

## Set up your studio (once)

The skill brings a ready-made Remotion project. Make a folder for your films and set it up once:

```bash
cp -R ~/.claude/skills/animate-my-work/template ~/zazzy-motion-studio
cd ~/zazzy-motion-studio
npm install
```

If you installed it as a plugin (Option A), ask Claude: "set up an animate-my-work studio in this folder". It knows
where the template is.

Then prove it works by rendering the built-in demo:

```bash
npm run typecheck
npm run stills kit-demo
npm run review kit-demo && npm run jumps kit-demo && npm run energy kit-demo
npm run render kit-demo -- --bars "5,6,7,8-15" --tail 31
open out/kit-demo/kit-demo.mp4
```

The first render downloads a headless Chrome (about 95 MB). On a recent Mac the demo takes about 2 minutes: around
25 s for the stills, 50 s for the review cut and 2 minutes for the final render.

---

## Make your first film

1. Open Claude Code **in your studio folder**.
2. Make sure Figma is connected, and that your frames sit on one page of a Figma file.
3. Type a brief:

```
/animate-my-work a 60 s launch film from the frames on my "Launch" page in Figma file <file key or link>
```

Claude then works through the whole loop: brief → beat sheet → storyboard in Figma → film spec → review cut and checks
→ final render. At the end it reports the file, its length, the transitions it used and the measured sound numbers.

### Want to approve each stage?

Add `step`. Claude stops for your yes after the storyboard, after the stills and after the review cut:

```
/animate-my-work step a 60 s launch film from the frames on my "Launch" page
```

### All the ways to call it

| Type | What happens |
|-|-|
| `/animate-my-work <brief>` | the whole loop with no questions, and an MP4 at the end |
| `/animate-my-work step <brief>` | pauses for your approval at the storyboard, the stills and the review cut |
| `/animate-my-work storyboard <brief>` | only the beat sheet and the full storyboard in Figma, with no render |
| `/animate-my-work gif <frames>` | a looping GIF of Figma frames, sized for posting on X |

You can also just describe what you want ("animate this Figma file", "make an explainer for my app"), and Claude
picks up the skill on its own.

### What makes a good brief

Put these in one message, or let Claude use its defaults:

- **What it's for, and who watches.** A product launch on X, a client pitch, a portfolio piece.
- **The source.** The Figma file and page, an image folder, or a website URL.
- **Length and shape.** For example 30 s, 60 s or 2 min, and 16:9, 1:1 or 9:16.
- **What must be on screen.** The logo, a price, a feature name, the call to action.

Example briefs:

```
/animate-my-work a 30 s teaser for X from my "Krea 3" page, 16:9, end on the Krea 3 logo
/animate-my-work step a 90 s explainer for how to use region edits, from the frames on page "Explainer"
/animate-my-work gif the 6 frames on my "Shoes" page, 1200 px wide
```

---

## Sound

- The studio comes with a sound pack in `public/sfx/` (whoosh, swish, click, pop, tick, shimmer, swell, sub) and a
  128 BPM track in `public/music/`.
- Drop your own track into `public/music/` and tell Claude to use it. Claude measures its tempo first and doesn't
  guess it.
- Nothing is paid for or generated unless you ask. There's no voiceover unless you ask.

---

## Where your files end up

| Path (in your studio) | What it is |
|-|-|
| `out/<film>/<film>.mp4` | the finished film, with sound |
| `out/<film>/review.mp4` and `contact.png` | the silent review cut and a contact sheet |
| `out/<film>/stills/` | stills at every cut |
| `src/<film>/` | the film spec Claude wrote (`film.ts`, `video.tsx`, `timing.ts`) |
| `SCRIPT.md` | the beat sheet |

To scrub through a film by hand, run `npm run studio` to open Remotion Studio.

---

## Troubleshooting

| Problem | Fix |
|-|-|
| `ffmpeg: command not found` | `brew install ffmpeg`. If Homebrew hangs on `formulae.brew.sh`, try `HOMEBREW_NO_INSTALL_FROM_API=1 brew install ffmpeg`. |
| Fonts fail to load from `fonts.googleapis.com` | the template already loads Inter Tight locally, from `public/fonts/` |
| Headless Chrome won't start (Linux) | see [references/pipeline.md](references/pipeline.md), "Setup" step 4 |
| The jump check flags a designed move | Claude adds those frames to `STEPS` in `timing.ts`, rather than loosening the check |
| A sound is too quiet | Claude raises its gain in `scripts/mix.py` and mixes again, and the report shows the change |
| Figma isn't connected | connect Figma's MCP server to Claude Code: search "Figma MCP server" at [help.figma.com](https://help.figma.com) for Figma's current steps |

---

## What's inside this folder

| Path | What it is |
|-|-|
| [SKILL.md](SKILL.md) | the instructions Claude follows |
| [references/](references/) | the detailed guides: story, storyboard, Figma export, engine, transitions, motion, sound, review, pipeline |
| [template/](template/) | the Remotion studio: the engine, a kit demo of every transition, the sound pack and the music |

## Credits

The Remotion template builds on [design.how](https://github.com/arla6ka/design.how)'s make-motion template (MIT, see
`template/LICENSE-design-how`).
