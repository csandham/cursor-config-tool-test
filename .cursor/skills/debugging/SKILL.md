---
name: debugging
description: Step-by-step debugging playbook for diagnosing and fixing issues in this repo. Use when asked to debug a problem, trace an error, or investigate unexpected behavior.
---

# Debugging Playbook

Follow these steps in order when diagnosing an issue.

## 1. Reproduce the problem

- Confirm the exact steps to reproduce the issue
- Identify the smallest input that triggers the problem
- Note the expected vs. actual behavior

## 2. Gather context

- Read the relevant source files and recent git history
- Check for related issues or past fixes in the commit log
- Look at error messages, stack traces, and logs carefully

## 3. Isolate the cause

- Narrow down the affected code path
- Check recent changes that could have introduced the regression
- Form a hypothesis about the root cause

## 4. Fix and verify

- Implement the minimal fix
- Verify the original reproduction case no longer fails
- Check that no adjacent behavior was broken

## 5. Document

- Leave a comment if the fix addresses a non-obvious constraint
- Update tests to prevent regression
