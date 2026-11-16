# zazzy-skills

Skills for AI-driven design and motion, built and tested by Zazzy ([@zazzygfx](https://x.com/zazzygfx)).

## Install

Claude Code:

```
/plugin marketplace add zazzygfx/zazzy-skills
/plugin install zazzy-motion@zazzy-skills
```

Any agent that reads Agent Skills: `npx skills@latest add zazzygfx/zazzy-skills`.
Claude app: upload a skill folder as a zip in your skills settings.

## Skills

<!-- skills:start -->
- [animate-my-work](skills/animate-my-work/SKILL.md). Animates your designs into motion films: a storyboard in Figma,
  then a film spec Remotion renders, with designed transitions, music re-cut on bars and measured, audible SFX.
<!-- skills:end -->

## Try it

Open a project in Claude Code with the Figma MCP connected and say:

> /animate-my-work a 60 s launch film from the frames on my "Launch" page

## Credits

The Remotion template in `animate-my-work` builds on [design.how](https://github.com/arla6ka/design.how)'s make-motion
template (MIT). Remotion is free for individuals and companies of up to 3 people (remotion.dev/license).
