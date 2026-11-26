---
name: setup-arq-stack
description: Configure which T3 provider and model pstack uses per role and at what reasoning level. Detects the models T3 can run and writes the model sheet that overrides the skill defaults. Use for /setup-arq-stack, "configure pstack models", "pstack budget", or changing pstack's model choices.
---

# Setup pstack

Write the model sheet, `~/.config/arq-stack/models.md` (`$XDG_CONFIG_HOME/arq-stack/models.md` when that is set), one per machine. It sets pstack's T3 provider and model per role, and every pstack skill reads it before it dispatches.

## Steps

### 1. Detect available models

Call `orchestrator_capabilities`, or `acp-mcp-call orchestrator_capabilities '{}'` where the T3 tools are not exposed. Its provider instances and their models are the dependable source. A target is valid only when its provider instance can run a child task and lists the model. Note each provider's own option IDs and values, such as `effort` on Claude, `reasoningEffort` on Codex and Grok, and `thought_level` on Antigravity. Never write a target you have not seen there. The aliases `inherit-parent` and `auto` are always valid.

### 2. Load current state

The default role-to-target mapping is the sheet shape in step 5 below. If the sheet already exists, read it and treat its role values as the current choices. If it does not, read `arq-stack-models.md` in the host's config directory (`$CLAUDE_CONFIG_DIR` or `~/.claude` on Claude Code, `$CODEX_HOME` or `~/.codex` on Codex) the same way. Otherwise start from those defaults. Drop every line whose role is not in step 5, and any value that is not a T3 entry, such as a bare family name, a `claude-` slug, or an `@<level>` suffix, and a `default effort` line. Tell the user which lines you dropped.

### 3. Map and confirm

**(a) Build the table** from the defaults, and on a re-run keep any role you changed. Replace a default this machine cannot run with the closest detected target. No entry goes above `high`. Write `fastMode=false` for every model whose `fastMode` defaults to on.

**(b) Show the roles and confirm.** Show every role with its entry, and list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected targets at `high` or below plus `inherit-parent` and `auto` (both mean: this role runs on the parent chat's model).

`search` and `interrogate reviewers` list the models to choose from. The order means nothing. One subagent runs, on the entry that fits the task, so a longer list does not run more subagents. Each list needs at least two model families among its targets. A model's family is the first segment of its ID's last `/` part, such as `claude`, `grok`, or `gemini`, except that Fable (`claude-fable-*`) is its own family. The reviewer is from a family other than the one that wrote the code. A reviewer runs at `medium` or `high`, as the task's complexity calls for, whatever level its line shows.

**(c) Ask about the session-start hook.** Ask whether arq-stack's session-start hook should keep telling new chats when to enter `/arq-mode`. It is off unless the user says yes, since a started run loads the whole mode. Write `session hook: on` or `session hook: off`.

### 4. Validate

Write the candidate to a temp file. Call `orchestrator_capabilities` again and save its result to a temp file as `{"providers": [...]}`, copying verbatim the entry of every provider instance the candidate or the defaults name. Its list is short, so add to each provider's `models` every model the candidate or the defaults name that it omits, as `search` with that model's ID returns it. Run `node <plugin root>/skills/setup-arq-stack/scripts/t3-sheet.mjs <candidate> <catalog.json>`, where `<plugin root>` is the directory that holds this plugin's `skills/`, and fix every line it prints. Every entry's reasoning option must be at `high` or below. If `node` is missing, check each entry against the catalog by reading, and say so. A role with no line runs on its default, so add a line for any role whose default this machine cannot run.

### 5. Write the sheet

Overwrite the sheet with the candidate, creating its directory and writing through any symlink at its path (resolve it with `realpath`). The candidate carries the `# defaults: 3` line. If a different file is already there, run the checker on it and ask before you replace it. Overwrite the whole file so re-runs stay idempotent. Then replace `arq-stack-models.md` in the host's config directory with a link to the sheet (`ln -sf`), so an older arq-stack reads the same sheet. Step 2 already read what it held. On Codex, remove any pstack model rows an earlier setup pasted into `<codex-home>/AGENTS.md`. With every default kept, the sheet reads:

```markdown
# pstack model configuration (T3). One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat's model (`delegate_task` omits `target`). A list holds choices in no order: one subagent runs on the entry that fits the task.
# defaults: 3
feature, refactoring: claudeAgent/claude-sonnet-5-5 effort=medium
bug-fix: claudeAgent/claude-sonnet-5-5 effort=medium
perf-issue: claudeAgent/claude-sonnet-5-5 effort=medium
hillclimb: claudeAgent/claude-sonnet-5-5 effort=medium
judgment and prose: claudeAgent/claude-sonnet-5-5 effort=medium
search: cursor/composer-2.5 fastMode=false, claudeAgent/claude-haiku-5-5 effort=high
interrogate reviewers: cursor/grok-4.7 reasoning_effort=medium fastMode=false, cursor/grok-4.6 effort=medium fastMode=false, antigravity/gemini-4-neon thought_level=medium, claudeAgent/claude-sonnet-5-5 effort=medium
session hook: off
```

### 6. Confirm

Tell the user the sheet was written and that it applies to new sessions. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, read [`../create-verification-skill/SKILL.md`](../create-verification-skill/SKILL.md) from this file and follow it. Do not call the Skill tool for it, since that tool refuses a skill only the user may invoke. On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, read [`../create-formal-verification-skill/SKILL.md`](../create-formal-verification-skill/SKILL.md) from this file and follow it. Do not call the Skill tool for it, since that tool refuses a skill only the user may invoke. On no, move on without pushing.
