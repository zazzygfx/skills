---
name: ask-zazzy
description: Ask which of Zazzy's skills (or which mode of one) fits what you want to make. A router over the design and motion skills in zazzygfx/skills. Use when someone says "/ask-zazzy", "which skill should I use", or describes a design or motion job without naming a skill.
disable-model-invocation: true
---

# Ask Zazzy

You help someone pick the right skill from this collection for what they want to make.

## How to answer

1. **Read before you recommend.** Find the skill's SKILL.md (in `~/.claude/skills/<name>/`, in the installed plugin, or
   in `skills/<name>/` of the repo) and read it before saying what it does. The map below is only for orientation, and
   the SKILL.md is the truth.
2. **Recommend one thing:** one skill, or one mode of a skill, or one short sequence. Say why in one sentence.
3. **Give them the exact line to type,** with their own words filled into the brief, for example
   `/animate-my-work step a 30 s teaser from my "Launch" page`.
4. **Name the next step,** the skill or mode they'll reach for after this one.
5. **Say what they need first** if the skill has a "Before you start" list (a Figma connection, Node, ffmpeg) and it
   looks like they don't have it yet.
6. **Be honest when nothing fits.** If no skill here covers the job, say so plainly and help them directly. Don't
   stretch a skill to fit.

Don't read the whole map back at them. Ask at most one question, and only if two skills fit equally well.

## The main flow: design → film

Most work here travels one path: from designs you already made to a finished motion piece.

1. **Have designs, want a film?** Use **`/animate-my-work`**. It storyboards in Figma, writes the film as code,
   renders it with Remotion, re-cuts the music on bar lines and measures the sound effects over the music.
   - **Trust it to run alone:** `/animate-my-work <brief>`. No questions, and an MP4 at the end.
   - **Want to approve as it goes:** `/animate-my-work step <brief>`. It stops after the storyboard, the stills and
     the review cut. This is the best choice for a first film or for client work.
   - **Only want the plan:** `/animate-my-work storyboard <brief>`. A beat sheet and the full storyboard in Figma, with
     no render. Good for pitching an idea before committing to it.
2. **Want something quick to post?** Use **`/animate-my-work gif <frames>`**. A looping GIF of Figma frames, sized for
   X.
3. **Not happy with a cut?** Stay in `/animate-my-work`, and say what's wrong in plain words ("the second cut feels
   slow", "the clicks are too quiet"). Its review step re-renders only what changed.

## Design skills

Coming soon. When someone wants help with the design itself (layouts, type, colour, a brand system), say that this
collection doesn't have that skill yet, and help them directly.

## Common situations

| You say | Reach for |
|-|-|
| "Animate my Figma file" / "make a launch film" | `/animate-my-work` |
| "I want to check each stage first" | `/animate-my-work step` |
| "Storyboard this before we animate" | `/animate-my-work storyboard` |
| "Make a GIF of these frames for X" | `/animate-my-work gif` |
| "Explainer for how to use my product" | `/animate-my-work step`; it researches the product first, so every claim on screen is true |
| "Turn my Krea / FLORA images into a video" | `/animate-my-work` |
| "The sound effects are buried" | `/animate-my-work`; ask it to re-mix, and it reports the measured levels |
| "How do I install these?" | the install steps in the repo README: `npx skills@latest add zazzygfx/skills` |
| "Which skill should I use?" | you're already in the right place |

## Keeping this map current

When a new skill joins the collection, it gets a line in the flow above, or under Design skills, and a row in Common
situations. A skill that isn't listed here can still be recommended once its SKILL.md has been read.
