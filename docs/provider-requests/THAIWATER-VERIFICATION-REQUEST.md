# ThaiWater (HII) Integration Verification Request

This document details the open items that require owner/HII verification before configuring a production adapter.

## Verification Checklist

### 1. Endpoint Access & Authentication
- [ ] Confirm if there is a public REST API feed supporting standard data formats (Type A - observed `/Rainfall`, `/Runoff`, etc.).
- [ ] Obtain the OAuth/Token or header authentication credentials needed to access standard feeds.
- [ ] Confirm access limits, rate policies, and CORS header rules for server-side ingestion.

### 2. Licensing & Redistribution
- [ ] Verify that HII permits data ingestion and display for business continuity decision support.
- [ ] Confirm that public dashboard display is permitted under standard data agreements.
- [ ] Identify required attribution language.

### 3. Data Integration & Validation
- [ ] Verify dataset update frequency and latency metrics.
- [ ] Obtain JSON schemas and quality assurance protocols (e.g. flag indicators for suspected or corrupted measurements).
