# zazzy-skills

Skills for AI-driven design and motion, built and tested by Zazzy ([@zazzygfx](https://x.com/zazzygfx)).
Every skill lives in its own folder under [`skills/`](skills/). Click a skill below to open its page.

## Skill catalog

<!-- skills:start -->

### 🎨 Design

Skills for making and reviewing the design work itself.

| Skill | What it does | Use it with |
|-|-|-|
| _None yet. The next design skill goes here._ | | |

### 🎬 Motion

Skills that turn designs into animation and film.

| Skill | What it does | Use it with |
|-|-|-|
| [**animate-my-work**](skills/animate-my-work/) | Animates your designs into motion films: a storyboard in Figma, then a film spec Remotion renders, with designed transitions, music re-cut on bars and measured, audible SFX. | Figma, Remotion |

<!-- skills:end -->

## Install

**Claude Code** (all skills at once):

```
/plugin marketplace add zazzygfx/zazzy-skills
/plugin install zazzy-motion@zazzy-skills
```

**Any agent that reads Agent Skills:** `npx skills@latest add zazzygfx/zazzy-skills`

**Claude app:** download a skill folder, zip it, and upload it in your skills settings.

**Just one skill:** copy its folder from `skills/<name>/` into `~/.claude/skills/<name>/`.

## Try it

Open a project in Claude Code with the Figma MCP connected and say:

> /animate-my-work a 60 s launch film from the frames on my "Launch" page

## How this repo is laid out

```
skills/
  <skill-name>/
    README.md      the skill's page on GitHub (what it does, how to use it)
    SKILL.md       the instructions Claude follows
    references/    the detailed guides SKILL.md points to
    template/      a starter project, when the skill needs one
.claude-plugin/
  marketplace.json the plugin list Claude Code installs from
```

## Credits

The Remotion template in `animate-my-work` builds on [design.how](https://github.com/arla6ka/design.how)'s make-motion
template (MIT). Remotion is free for individuals and companies of up to 3 people (remotion.dev/license).
