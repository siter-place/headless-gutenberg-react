# AGENTS.md

This repository contains a public npm React + TypeScript package for rendering WordPress Gutenberg content in headless React and Lovable applications.

## Current Phase

We are currently in Phase 1.

Phase 1 goal:
- scaffold the project
- set up coding-agent rules
- set up documentation
- set up TypeScript, build, linting and tests
- set up a Vite playground
- set up Playwright
- create only a simple HelloWorld component

Do not implement the full Gutenberg renderer yet.

## Long-Term Product Goal

The final package will:
- render WordPress REST API `content.rendered`
- load generated CSS from `siter_headless.css_urls`
- respect `siter_headless.wrapper`
- preserve Gutenberg and WordPress Interactivity API attributes
- optionally hydrate interactive Gutenberg blocks
- work in Lovable, Vite and standard React apps
- be published publicly to npm

## Core Architecture Decision

Do not convert Gutenberg blocks into custom React components in the MVP.

WordPress-rendered HTML is the source of truth.

The WordPress plugin will:
- render Gutenberg HTML
- expose `content.rendered`
- expose `siter_headless`
- generate scoped CSS
- expose the block list

The React package will:
- fetch REST content later
- sanitize HTML later
- render HTML safely later
- inject CSS links later
- load WordPress interactivity scripts later only when needed

## Working Rules

- Inspect existing files before editing.
- Make small focused changes.
- Do not rewrite unrelated files.
- Keep public APIs stable unless explicitly asked.
- Prefer simple, maintainable code.
- Use TypeScript strictly.
- Avoid `any` unless there is a strong reason.
- Keep React components focused.
- Add or update tests when changing behavior.
- Run typecheck, lint, unit tests and build before finishing when possible.
- Run Playwright tests when UI behavior changes.
- Do not introduce production dependencies without justification.
- Do not hardcode secrets, tokens or local machine paths.
- Do not remove error handling to make code shorter.
- Do not disable tests or lint rules to force success.

## Rules and Skills Infrastructure

This project uses a layered rules and skills system. Understanding it prevents duplication and ensures the right guidance is applied.

### Always-on rules (`.cursor/rules/`)

These rules apply automatically to every task:

| Rule | Purpose |
|------|---------|
| `001-general-clean-code.mdc` | Clean code baseline |
| `002-refactoring-discipline.mdc` | Refactoring safety guardrails |
| `003-security-rules.mdc` | Security for package development |
| `004-react-typescript.mdc` | React and TypeScript quality |
| `005-project-headless-gutenberg.mdc` | Project-specific Gutenberg constraints |
| `008-agent-skills-usage.mdc` | When and how to use skills |

### On-demand rules

| Rule | Trigger |
|------|---------|
| `006-clean-code-review.mdc` | Explicit code review tasks |
| `007-refactoring-pass.mdc` | Explicit refactoring tasks |

### External rules and references (`.cursor/rules/external/`)

Includes `secure-mcp-usage.mdc` (always-on for MCP safety) and on-demand rules (`secure-dev-node.mdc`, `dangerous-flows.mdc`). Also includes passive reference files from ciembor/agent-rules-books and tech-leads-club/agent-skills loaded by rules and skills when needed. Sources documented in `docs/agent-rules-sources.md`.

### Skills (`.cursor/skills/`)

Use skills only when relevant, per rule `008-agent-skills-usage.mdc`:

| Skill | When to invoke |
|-------|----------------|
| `coding-guidelines` | When writing, modifying, or reviewing code |
| `clean-code-review` | When reviewing code for readability |
| `refactoring-pass` | When refactoring existing code |
| `security-review` | When touching HTML rendering, dependencies, publishing, or risky code |

For the full architecture of rules and skills, see `docs/agent-rules-and-skills.md`.

## Commands

For a quick human-readable command reference, see `docs/quickstart.md`.

Install dependencies:

```bash
npm install
```

Run local playground:

```bash
npm run dev
```

Run typecheck:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test
```

Run Playwright tests:

```bash
npm run test:e2e
```

Build package:

```bash
npm run build
```

Run full local check:

```bash
npm run check
```

## Completion Criteria

A task is complete only when:

* the implementation is simple and focused
* tests are added or updated
* typecheck passes
* lint passes
* unit tests pass
* build passes
* Playwright passes when UI behavior is changed
* the final response explains what changed and what remains
