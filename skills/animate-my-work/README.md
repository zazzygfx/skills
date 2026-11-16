# animate-my-work

**Category:** 🎬 Motion · **Works with:** Figma, Remotion · **Version:** see [marketplace.json](../../.claude-plugin/marketplace.json)

Animates your own designs (Figma frames, Krea or FLORA images, brand and partner work) into transition-driven motion
films. It storyboards in Figma first, then writes a film spec that Remotion renders, with music re-cut on bar lines and
sound effects measured to stand clearly over the music.

## Use it

| Type | It does |
|-|-|
| `/animate-my-work <brief>` | the whole loop, no questions, an MP4 at the end |
| `/animate-my-work step <brief>` | stops for your yes after the storyboard, the stills and the review cut |
| `/animate-my-work storyboard <brief>` | the beat sheet plus the full storyboard in Figma |
| `/animate-my-work gif <frames>` | a looping GIF of Figma frames |

Example:

> /animate-my-work a 60 s launch film from the frames on my "Launch" page

## What you need

- Claude Code, with the Figma MCP connected
- Node 22.6 or later, ffmpeg, git and Python 3
- Setup steps are in [references/pipeline.md](references/pipeline.md) under "Setup"

## What's inside

| Path | What it is |
|-|-|
| [SKILL.md](SKILL.md) | the instructions Claude follows |
| [references/](references/) | the guides: story, storyboard, engine, transitions, motion, sound, review, pipeline |
| [template/](template/) | the Remotion project, with a working kit demo, a sound pack and a 128 BPM track |

Remotion is free for individuals and companies of up to 3 people; a bigger company needs a Remotion company licence
(remotion.dev/license).
