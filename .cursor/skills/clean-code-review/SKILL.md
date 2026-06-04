---
name: clean-code-review
description: Use this skill when reviewing or improving code readability, naming, function shape, and maintainability.
---

# Clean Code Review

This skill adds depth to the always-on rule `001-general-clean-code.mdc` and the on-demand rule `006-clean-code-review.mdc`. Invoke it for dedicated code reviews, not for every code change.

Review code for:

- clear names
- small focused functions
- simple control flow
- explicit side effects
- meaningful boundaries
- useful tests
- minimal duplication
- no unnecessary cleverness

Do not rewrite everything.
Improve the smallest useful surface.

References (read when performing a deep review):
- `.cursor/rules/external/ciembor/clean-code.mini.md` — Clean Code principles
- `.cursor/rules/external/ciembor/philosophy-of-software-design.mini.md` — design depth principles
