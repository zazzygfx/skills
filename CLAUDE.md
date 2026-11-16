zazzy-skills: house rules for Claude
This repo is a Claude Code plugin marketplace of my skills. Each skill lives in skills/<name>/ with SKILL.md (frontmatter: name, description), references/ and, if it needs one, template/.
When I say "ship skill <name>" (after I've tested it and like it):

1. Put it in skills/<name>/ in the same structure. Kebab-case name; never "claude" or "anthropic" in it.
2. Check SKILL.md: the frontmatter parses, the description says when to use it in under 1024 characters, and every file SKILL.md mentions exists.
3. Add "./skills/<name>" to the skills list in .claude-plugin/marketplace.json, and bump metadata.version (minor).
4. Add one line to the list between <!-- skills:start --> and <!-- skills:end --> in README.md.
5. Also copy it to ~/.claude/skills/<name> so I can use it right away.
6. Commit as "add <name>: <one line>" and push main. Never force-push, never rewrite history. When I say "update skill <name>": same checks, bump the patch version, commit "update <name>: <what changed>", push, and refresh ~/.claude/skills/<name>. Never commit node_modules, out/, .remotion/ or secrets.
