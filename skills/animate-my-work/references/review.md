# Review

Measured checks must pass. Taste is weighed against the one-sentence story. Never call a check passed that didn't run.

## Measured

- **Stills.** `npm run stills <film>` renders `STILLS`: the key moments plus 11 frames before and after every cut. Lay
  them in a contact sheet (PIL, 6 across, labelled) and look at every one:
  - no blank or near-empty frame at a cut (a white flash on an implode's cut frame is designed);
  - nothing cut off at the edges;
  - every highlight on the right object;
  - text readable;
  - no copy that contradicts the cut.
- **Jumps.** `npm run review <film>`, then `npm run jumps <film>`. 0 unplanned jumps. The cuts and transition frames
  come from `timing.ts`, so designed motion isn't flagged.
- **Energy.** `npm run energy <film>` must pass. Then hold the cut to the higher bar in `motion.md`: at least 70% of
  frames moving and at least 2% of pixels. Fix a weak scene with camera keys, overlapping moves and a third thing
  alive.
- **Sound.** mix.py's report meets the targets in `sound.md`. The final hit lands on the end card.

## QA list (before the render)

- [ ] Every cut has a designed transition, and something carries the eye across it.
- [ ] No dead stop at a cut: A leaves fast, B arrives fast.
- [ ] No whole-frame bounce. Overshoot only on chips.
- [ ] Demo scenes show the action literally: travel, drag, type, click, render, wipe, prove.
- [ ] Before/after pairs registered (`align.py`), highlights on the changes.
- [ ] Persistent chrome stays still across its scenes.
- [ ] Every sound matches a visible event. No double whooshes.
- [ ] No credit card. No voiceover unless asked. No temporary sheets left in Figma.
- [ ] Copy matches the cut (length, numbers, names).

## Fixing

A fix goes into a new review cut, never straight into the final render. Re-run the stills of the cuts you touched,
then jumps and energy, then render.
