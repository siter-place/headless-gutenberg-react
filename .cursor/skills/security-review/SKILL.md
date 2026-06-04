---
name: security-review
description: Use this skill when reviewing code for security risks, secrets, unsafe commands, dependencies, HTML rendering, script loading, or publishing.
---

# Security Review

This skill adds depth to the always-on rule `003-security-rules.mdc`. Invoke it for dedicated security reviews, not for every code change.

Review for:

- exposed secrets or hardcoded credentials
- unsafe shell commands
- dangerous dependency additions
- unsafe HTML rendering or missing sanitization
- unsafe script or CSS injection
- leaking private URLs or tokens
- insecure GitHub Actions or npm publishing setup

For this project specifically:
- future Gutenberg HTML rendering must be sanitized
- future `dangerouslySetInnerHTML` must never use unsanitized HTML
- future remote CSS URLs must come from trusted WordPress REST data
- future script-module loading must avoid duplicate injection
- npm publishing must not use hardcoded tokens

References (read when performing a deep review):
- `.cursor/rules/external/security/secure-dev-node.mdc` — Node.js/TypeScript security
- `.cursor/rules/external/security/dangerous-flows.mdc` — dangerous flow tracing
- `.cursor/rules/external/security/secure-mcp-usage.mdc` — MCP interaction safety
