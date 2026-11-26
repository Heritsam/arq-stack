---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Adversaries try to break a change or design, and only findings proven by a run survive."
disable-model-invocation: true
---

# Interrogate

Adversaries try to break a change or a design. A finding survives only when a run proves it. Report the findings. Do not apply fixes.

## Frame

The scope is what the user names. Otherwise it is the branch diff from its merge base with the base branch, through the working tree. State the intent with the **in-your-own-words** skill, from the user's message, the commits, and the PR description. Ask the user when the intent is unclear.

## Fan out

The `interrogate reviewers` line in the model sheet lists the models to choose from, by default the entries in [Models](#models). It is not a ranking. Take one reviewer, picking the model and effort that fit how complex the change is, from a model family other than the one that wrote the code. Add a second, from a third family, only when the change is complex and arq-mode's two-subagent limit still has room. A change is complex when it crosses modules or a public API, touches auth, data, money, migrations, or concurrency, or a first attempt failed. Run a reviewer at `medium` effort, or `high` for a complex change, never higher. Keep `fastMode=false`. A model's family is the first segment of its ID's last `/` part, such as `claude`, `grok`, or `gemini`, except that Fable (`claude-fable-*`) is its own family. An `auto` or `inherit-parent` entry omits `target`. If `delegate_task` rejects an entry, pick another listed one, and say so.

Spawn each adversary as a `delegate_task` child with `mode: "async"`, `role: "review"`, no persona brief, and its own worktree, per arq-mode's Dispatch on T3. Copy the scope's uncommitted changes into each worktree. Open each brief as arq-mode says, then give the scope, the intent, and this:

> Break this change. Prove each finding with a run against the real code, such as a failing test, a repro script, or command output that shows the wrong behavior. For a design or plan, run a prototype or probe the current tree. Keep repros in your own worktree. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Leave out anything you did not run. That covers style, naming, structure, and risks that need a future change to matter. No findings is a valid result.

## Verify

Verify each finding by rerunning its command. Keep a finding when the output shows the failure and the failure breaks the intent. Drop the rest. Merge findings that share a root cause.

Adversaries find different failures, so the verdict keeps every verified finding, not one adversary's list.

## Output

- **Intent**: the restatement.
- **Findings**: for each verified finding, the command, its output, how it breaks the intent, and the adversaries that found it. Say "no verified findings" when none survive.
- **Dropped**: for each adversary, the count of dropped findings and why.

## Models

Role defaults on T3, stamped from `plugins/pstack/models.json`. A role line in the model sheet overrides each one. The sheet is `~/.config/arq-stack/models.md` (`$XDG_CONFIG_HOME/arq-stack/models.md` when that is set), one per machine, and `/setup-arq-stack` writes it. When it is missing, read `arq-stack-models.md` in the host's config directory (`$CLAUDE_CONFIG_DIR` or `~/.claude` on Claude Code, `$CODEX_HOME` or `~/.codex` on Codex). An entry is `<providerInstanceId>/<modelId>` plus `<optionId>=<value>` pairs, and it maps onto `delegate_task`'s `target`, with the provider instance as `providerInstanceId`, the model as `model`, and the pairs as `options`. It splits at its first `/`, so a model ID with its own `/`, such as OpenCode's `<provider>/<model>`, is written whole after it. Option IDs differ per provider, so take them from `orchestrator_capabilities`. `inherit-parent` or `auto` omits `target`.

- interrogate reviewers: `cursor/grok-4.7 reasoning_effort=medium fastMode=false`, `cursor/grok-4.6 effort=medium fastMode=false`, `antigravity/gemini-4-neon thought_level=medium`, `claudeAgent/claude-sonnet-5-5 effort=medium`
