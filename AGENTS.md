# Repository working instructions

## Scope

Build Thailand Disaster Watch as a production-quality decision-support platform. Version 1 covers water and flood monitoring only. Do not implement later phases unless the user approves the phase transition.

## Non-negotiable data rules

- Never fabricate external API endpoints, observations, forecasts, warnings, thresholds, timestamps, licenses, or source attribution.
- Treat every external source as `UNKNOWN` until the Phase 2 audit is complete.
- Do not connect a source to production unless its license status is `APPROVED`.
- Keep observed, forecast, model, warning, typical, specification, and calculated data explicitly separated.
- Every production data item must be traceable to source, observation time, receipt time, unit, and verification status.
- Show unavailable, stale, and unknown-time states explicitly. A failed source must never crash the whole application.

## Engineering rules

- Keep user-interface, domain, source-adapter, API, and infrastructure concerns separate.
- Keep secrets server-side and use environment variables. Never commit credentials or customer/project data.
- Preserve unrelated user changes and avoid destructive Git commands.
- Before handoff, run lint, type checking, tests, and production build in proportion to the change.
- Do not commit, push, deploy, or change external systems unless the user explicitly authorizes that action.

## Required reporting

Report phase, status, completed work, files changed, tests, data sources, risks, blockers, and next action. Clearly distinguish facts, assumptions, recommendations, and items requiring confirmation.
