zazzy-skills: house rules for Claude
This repo is a Claude Code plugin marketplace of my skills. Each skill lives in skills/<name>/ with SKILL.md (frontmatter: name, description), references/ and, if it needs one, template/.
When I say "ship skill <name>" (after I've tested it and like it):

1. Put it in skills/<name>/ in the same structure. Kebab-case name; never "claude" or "anthropic" in it.
2. Check SKILL.md: the frontmatter parses, the description says when to use it in under 1024 characters, and every file SKILL.md mentions exists.
3. Add "./skills/<name>" to the skills list in .claude-plugin/marketplace.json, and bump metadata.version (minor).
4. Pick its category (🎨 Design or 🎬 Motion; add a new ### category section only if neither fits). In README.md, between <!-- skills:start --> and <!-- skills:end -->, add one table row under that category: linked name (skills/<name>/), what it does in one sentence, what it works with. Replace a "None yet" row if there is one. Add the same entry to skills/README.md under the same category.
4b. Write skills/<name>/README.md, the skill's page on GitHub, in the same shape as skills/animate-my-work/README.md: category, what it does, how to use it, what you need, what's inside.
5. Also copy it to ~/.claude/skills/<name> so I can use it right away.
6. Commit as "add <name>: <one line>" and push main. Never force-push, never rewrite history. When I say "update skill <name>": same checks, bump the patch version, commit "update <name>: <what changed>", push, and refresh ~/.claude/skills/<name>. Never commit node_modules, out/, .remotion/ or secrets.
