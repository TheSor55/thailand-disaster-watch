# Known Limitations & Backlog — Thailand Disaster Watch v1.0.0

To ensure transparency and rigorous governance, all current system boundaries and future roadmap items are documented below.

---

## 1. Known Limitations in v1.0

1. **Non-Operational Preview Status**:
   - The platform is released under `DEVELOPMENT & DECISION-SUPPORT PREVIEW` (`realDataConnected=false`, `operationalUseApproved=false`).
   - Official government disaster warnings issued by the Thai Meteorological Department (TMD) and Department of Disaster Prevention and Mitigation (DDPM) supersede any data displayed on this platform.
2. **Pending Provider Agreements**:
   - GISTDA satellite flood inundation tiles and Royal Irrigation Department (RID) hydrological water level feeds remain gated until formal written agreements are completed.
3. **Radar Remote Sensing Disclaimers**:
   - RainViewer radar mosaics are subject to potential beam blockage in mountainous regions and radar-gap zones across Southeast Asia.
   - Radar data is classified strictly as `OBSERVED_REMOTE_SENSING` and is **not** used to infer quantitative mm/hr rainfall rates or automated storm alerts.
4. **No Automated Actions**:
   - The system does **not** trigger automatic facility shutdowns, evacuation sirens, or automated Business Continuity Management (BCM) actions.

---

## 2. Future Backlog (v1.1+)

The following features were intentionally excluded from v1.0 to preserve safety and are scheduled for future phases:

- **Phase 4**: Precipitation Nowcasting & Short-term Radar Extrapolation (0–3 hours) with optical flow research.
- **Phase 5**: River Basin & Reservoir Telemetry integration (RID & HII feeds).
- **Phase 6**: Authorized Disaster CCTV stream integration.
- **Phase 7**: Full "My Sites" corporate asset risk monitoring & custom notification rules.
- **Phase 8**: Advanced multi-model ensemble comparisons and automated BCM workflows.
- **Phase 9+**: Seismic & Tsunami monitoring extensions.
