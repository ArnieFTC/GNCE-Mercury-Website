---
name: vercel
description: Review UI code against Vercel's Web Interface Guidelines (accessibility, focus states, forms, animation, typography, content handling, images, performance, navigation, touch, layout, theming, i18n, copy). Use when asked to review UI or HTML/CSS/JS files, check accessibility or UX, or audit a page against web interface best practices.
argument-hint: <file-or-pattern>
---

# Vercel Web Interface Guidelines

Review files for compliance with Vercel's Web Interface Guidelines.

## Guidelines source

Fetch the latest guidelines before every review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch (or `curl -sSL <url>`). The fetched file contains every rule and the required output format.
If the fetch fails, use the bundled copy in [guidelines.md](guidelines.md) (snapshot taken 2026-11-03) and say that you used it.

## Usage

When a user provides a file or pattern argument:

1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
