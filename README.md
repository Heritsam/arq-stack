# arq-stack

A private, lower-cost fork of [t3-pstack](https://github.com/chhoumann/t3-pstack) 2.7.1 for [T3 Code](https://github.com/pingdotgg/t3code). Tell `arq-mode` your goal and it picks the workflow.

It drops t3-pstack's many-agent skills and limits each task to two subagents, never nested. Model and effort defaults are still t3-pstack's, so they come next.

## Install

```shell
npx -y github:Heritsam/arq-stack install
npx -y github:Heritsam/arq-stack update
npx -y github:Heritsam/arq-stack doctor
```

To run this release's installer, use `npx -y github:Heritsam/arq-stack#v3.1.0 doctor`. The repository is private, so git needs access to it.

Then run `/arq-stack:setup-arq-stack` in a T3 thread. It writes the model sheet, `~/.config/arq-stack/models.md`. Without a sheet, every role runs on the defaults in its skill.

Hosts are the ones t3-pstack supports: Claude Code, Codex, Antigravity, and Kiro. Cursor is not supported yet.

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
