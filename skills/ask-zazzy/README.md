# ask-zazzy

**Category:** 🧭 Start here · **Works with:** Claude Code or any agent that reads Agent Skills · **Version:** see [marketplace.json](../../.claude-plugin/marketplace.json)

Not sure which skill to use? Describe what you want to make, and ask-zazzy points you to the right skill (or the right
mode of a skill), tells you exactly what to type, and says what comes next.

---

## What you get

- **One clear recommendation**, not a list of everything.
- **The exact command to type,** with your own brief already filled in.
- **What you need first,** for example a Figma connection or ffmpeg, if the skill needs something you don't seem to
  have yet.
- **The next step** after this one.
- **An honest "not yet"** when no skill in the collection covers your job, followed by direct help.

---

## Before you start

You only need [Claude Code](https://claude.com/claude-code), or another agent that reads Agent Skills. ask-zazzy reads
the other skills to give accurate advice, so install the whole collection rather than this skill alone.

---

## Install

Pick **one** of these.

### Option A: as a Claude Code plugin (recommended)

```
/plugin marketplace add zazzygfx/skills
/plugin install zazzy-motion@zazzy-skills
```

As a plugin, the command may appear as `/zazzy-motion:ask-zazzy`.

### Option B: copy it into your skills folder

```bash
git clone https://github.com/zazzygfx/skills.git zazzy-skills
mkdir -p ~/.claude/skills
cp -R zazzy-skills/skills/* ~/.claude/skills/
```

This copies every skill, so ask-zazzy can read the others.

### Option C: any agent that reads Agent Skills

```bash
npx skills@latest add zazzygfx/skills
```

---

## How to use it

Type `/ask-zazzy`, then describe your situation in plain words:

```
/ask-zazzy I have 8 Figma frames for a sneaker drop and want something for X by Friday
/ask-zazzy I want to explain how my app's region edit works, about 90 seconds
/ask-zazzy which skill turns my Krea images into a video?
```

A typical answer:

> Use **`/animate-my-work step`**. It's a launch piece, and step mode lets you approve the storyboard before anything
> renders. Type:
> `/animate-my-work step a 30 s sneaker drop teaser for X from the frames on my "Drop" page`
> You'll need the Figma MCP connected. Next: once you like the cut, ask it for a GIF version with
> `/animate-my-work gif`.

ask-zazzy only runs when you call it. It never takes over on its own.

---

## Troubleshooting

| Problem | Fix |
|-|-|
| `/ask-zazzy` doesn't appear | check that the folder is at `~/.claude/skills/ask-zazzy/`, or that the plugin is installed, then start a new session |
| It recommends a skill you don't have | install the whole collection (Option A or C), not just this folder |
| It says "not yet" | that kind of skill isn't in the collection yet. Follow [@zazzygfx](https://x.com/zazzygfx) for new ones |

---

## What's inside this folder

| Path | What it is |
|-|-|
| [SKILL.md](SKILL.md) | the router Claude follows: how to answer, the design-to-film flow, and common situations |
