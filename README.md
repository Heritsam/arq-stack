# arq-stack

A personalized, lower-cost fork of [t3-pstack](https://github.com/chhoumann/t3-pstack) 2.7.1 for [T3 Code](https://github.com/pingdotgg/t3code). Tell `arq-mode` your goal and it picks the workflow.

It drops t3-pstack's many-agent skills and limits each task to two subagents, never nested. The main chat writes the code. A reviewer comes from another model family, searches run on a small model, and no default goes above `high`.

## Install

```shell
npx -y github:Heritsam/arq-stack install
npx -y github:Heritsam/arq-stack update
npx -y github:Heritsam/arq-stack doctor
```

To run this release's installer, use `npx -y github:Heritsam/arq-stack#v3.4.0 doctor`.

Then run `/arq-stack:setup-arq-stack` in a T3 thread. It writes the model sheet, `~/.config/arq-stack/models.md`. Without a sheet, every role runs on the defaults in its skill.

The installer covers the hosts t3-pstack supports: Claude Code, Codex, Antigravity, and Kiro.

### Cursor

The installer does not cover Cursor. Link the skills from a checkout instead. This leaves any skill you already have under the same name alone.

```shell
git clone https://github.com/Heritsam/arq-stack ~/arq-stack
mkdir -p ~/.cursor/skills
for skill in ~/arq-stack/plugins/pstack/skills/*/; do
  name=$(basename "$skill")
  [ -e ~/.cursor/skills/$name ] || ln -s "${skill%/}" ~/.cursor/skills/$name
done
```

In Cursor the skills have bare names, so start with `/arq-mode`. Cursor also reads `~/.agents/skills` and `~/.claude/skills`, so remove any other pstack copy there, or two skills will share a name.

Auto-routing is off unless your model sheet says `session hook: on`, and Cursor has no hook.

## Contents

The plugin carries 60 skill directories, 24 of them `principle-*` leaves, and 2 agents.

## Development

```shell
bun install --frozen-lockfile
bun tools/generate.mjs
bun test tests/
```

Upstream changes are picked by hand from the `upstream` remote.

## Credits and license

MIT. arq-stack builds on [t3-pstack](https://github.com/chhoumann/t3-pstack) by Christian Bager Bach Houmann, [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, and [pstack-claude](https://github.com/michael-denyer/pstack-claude) by Michael Denyer. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).
