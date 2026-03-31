---
name: release
description: Release process playbook. Use when asked to prepare a release, cut a version, or walk through the release checklist.
---

# Release Playbook

Follow these steps in order to prepare and publish a release.

## 1. Pre-release checks

- Confirm all tests pass on the main branch
- Review open pull requests for anything that should be included
- Check the changelog for completeness

## 2. Version bump

- Update the version in the appropriate file (e.g. `package.json`, `pyproject.toml`)
- Update `CHANGELOG.md` with the release date and summary

## 3. Create the release commit

```bash
git add .
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
```

## 4. Push and publish

```bash
git push origin main --tags
```

## 5. Post-release

- Verify the release artifact is available
- Announce in the appropriate channel
- Close any resolved issues linked to this release
