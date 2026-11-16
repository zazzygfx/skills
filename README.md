# Skills for Design and Motion

For designers and motion designers who want AI to make work that looks and moves like it was made by hand.

I'm Zazzy ([@zazzygfx](https://x.com/zazzygfx)), an AI creative director. I build these skills in my own work, test
them on real projects, and only publish them here once they hold up. Each skill teaches Claude one part of the craft:
how to storyboard, how to time a transition, how loud a click should sit over the music.

New skills land here as I build them. Follow along on [X](https://x.com/zazzygfx).

## Install

```bash
npx skills@latest add zazzygfx/skills
```

Or in Claude Code:

```
/plugin marketplace add zazzygfx/skills
/plugin install zazzy-motion@zazzy-skills
```

To install just one skill, copy its folder from `skills/<name>/` into `~/.claude/skills/<name>/`.

Every skill has its own page (click its name below) with what you need, how to set it up, the commands and prompts to
try.

## Why use it?

AI is fast, but on its own it has no taste for motion. It cuts hard between scenes, holds on frozen frames, bounces
the whole screen on the beat, and buries sound effects under the music. The result looks like a slideshow.

These skills write down the decisions a motion designer makes without thinking, and make the agent check them with
real numbers: frames that move, cuts that land on the beat, sound that stands clearly over the music. You bring the
design, and the skill brings the craft.

## How to use them

1. Install [Claude Code](https://claude.com/claude-code), or any agent that reads Agent Skills.
2. Install the skills with one of the commands above.
3. Open your project and call a skill by name, for example `/animate-my-work`, followed by what you want. You can also
   just describe the job, and the agent picks the right skill.

## Reference

<!-- skills:start -->

### 🎨 Design

_Coming soon._

### 🎬 Motion

- **[animate-my-work](skills/animate-my-work/)**: Turns your Figma frames (or Krea, FLORA and brand images) into a finished
  motion film. It storyboards in Figma, renders with Remotion, re-cuts the music on bar lines and mixes sound effects you
  can actually hear.

<!-- skills:end -->

## Credits

The Remotion template in `animate-my-work` builds on [design.how](https://github.com/arla6ka/design.how)'s make-motion
template (MIT). Remotion is free for individuals and companies of up to 3 people ([remotion.dev/license](https://remotion.dev/license)).
