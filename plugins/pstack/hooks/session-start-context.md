<EXTREMELY_IMPORTANT>
You have arq-stack, pstack for T3 Code.

Invoke the `arq-stack:arq-mode` skill and follow its instructions when a task meets any of these:

- it touches more than one file, or changes a signature other files call
- it involves a design or architecture choice
- it is a bug whose cause is not yet known, or a performance issue

It routes to the right pstack skill from there. On Codex, open its SKILL.md whole, in a shell call of its own with `max_output_tokens: 10000`, since a smaller budget cuts out its middle. For smaller tasks, such as a contained change to one file with an obvious test, a question, or a one-line edit, work directly and verify on the real artifact.

When the intent is already specific, such as TDD, a design sketch, how or why something works, or an adversarial review, still enter through `arq-stack:arq-mode` and open that skill from the bundled path it names. The other pstack skills run only from arq-mode or when the user types them.

This runs on T3: before the first subagent or panel in a session, read the model sheet, `~/.config/arq-stack/models.md` (`$XDG_CONFIG_HOME/arq-stack/models.md` when that is set), or `arq-stack-models.md` in this host's config directory when that file is missing. This chat runs the playbook and writes the code itself, with at most two subagents per task. Each goes through `delegate_task` to its sheet line, and the reply lists which provider and model ran it. A `delegate_task` child is a leaf instead. It does the work itself and starts no subagent.

User instructions (CLAUDE.md, AGENTS.md, direct requests) take precedence. Other session-start mandates, such as superpowers, still apply. Their skill checks run as before, and when a task meets the criteria above they route implementation through arq-mode.
</EXTREMELY_IMPORTANT>
