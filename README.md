# NHPRI eForms Regression

Playwright regression tests for NHPRI provider forms.

## Self-healing locators

Shared form actions and assertions first use accessible names (labels,
placeholders, or roles). Page-header, step, field-value, field-text, and
validation checks use the same recovery layer. If the configured locator is
stale, recovery is allowed only if exactly one visible semantic candidate
exists. Ambiguous recoveries fail with locator counts and the current URL rather
than guessing. Successful recoveries are written to the test output with a
message identifying the recovered control.

Recovery is deterministic and runs locally in the browser; it does not send page
content or test data to an external AI service. It cannot safely recover a
control that has no accessible name or a unique configured selector. Recovery
applies to interactions and assertions routed through the shared form and
assertion helpers; direct Playwright locators elsewhere are not automatically
rewritten.

Run the recovery checks with:

```powershell
npx playwright test tests/selfHealingLocator.spec.ts
```

Run the full regression suite with:

```powershell
npx playwright test
```
