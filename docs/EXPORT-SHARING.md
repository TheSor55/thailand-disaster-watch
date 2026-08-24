# Export and sharing contract

PHASE 2 specifies safe outputs; it does not enable public sharing or external delivery.

## Planned outputs

| Output | Intended use | Mandatory metadata |
|---|---|---|
| PNG snapshot | Briefing/chat preview | title, area, generated time, data/source times, freshness, attribution, classification, exercise watermark |
| PDF situation report | Management/incident review | above plus source register, conflicts, assumptions, approvals, page/version |
| Action-plan export | BCM coordination | incident/rule version, recommendation, owner, approval/action status, audit reference |
| Copy summary | Controlled messaging | plain-language status, source/time, limitations, link/export reference |
| Mobile Web Share / copy summary | User-initiated native sharing | generated/observed time, source, incident ID, version, data status, disclaimer, classification |
| Share link / QR | Time-limited read-only access | tenant scope, expiry, revocation, classification ceiling, redacted view version |

## Security and quality rules

- Export generation checks the highest classification of included fields and the requester's permission.
- `CONFIDENTIAL` and `RESTRICTED` content is excluded from public links and QR views; redaction is explicit, not silent.
- Share links are unguessable, scoped, time-limited, revocable, read-only, and audited. Authentication is required unless a named owner approves a truly public dataset/view.
- All outputs retain official attribution, source times, freshness, conflicts, limitations, and `EXERCISE` watermark.
- A stale/offline cached export states when it was last synchronized. It never says “live”.
- PDF/PNG visual regression, Thai font embedding, accessibility/readability, page breaks, links, and QR destination require testing before release.
- No generated file is uploaded, published, or sent externally without explicit user action and authorization.

Export-document classification is `PUBLIC`, `INTERNAL`, `DRAFT`, or `EXERCISE`; it is separate from field-level security classification. Every export carries Generated At, Observed At, Source, Incident ID, Document Version, Data Status, Disclaimer, and Classification. Unknown values remain visibly unknown.

PHASE 2.6 implements the source-independent `ExportDocument` and mobile share capability contracts only. Native Web Share, download, and copy-summary support are detected independently; future authorization and classification checks remain mandatory. No export rendering, share link, QR code, GISTDA image redistribution, upload, or external send is enabled.
