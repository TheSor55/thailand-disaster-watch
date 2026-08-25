# Phase 3.0 Weather Situation Pipeline Evidence

This document records the verification logs and schema normalization states for the multi-source weather situation pipeline.

## 1. Orchestrated Output Structure

Below is the verified schema output structure of `GET /api/situation/weather`:

```json
{
  "situation": {
    "location": {
      "latitude": 13.72,
      "longitude": 100.57,
      "label": null
    },
    "generatedAt": "2026-08-25T13:00:00.000Z",
    "observed": {
      "source": "TMD",
      "observedAt": "2026-08-25T19:30:00+07:00",
      "retrievedAt": "2026-08-25T13:00:00.000Z",
      "precipitation": null,
      "temperatureCelsius": 28.5,
      "humidityPercent": 75,
      "windSpeedKph": 12,
      "freshness": "UNKNOWN",
      "provenance": "TMD weather station observation"
    },
    "forecast": {
      "source": "Open-Meteo",
      "validAt": "2026-08-25T21:00:00+07:00",
      "retrievedAt": "2026-08-25T13:00:00.000Z",
      "precipitationMm": 0.5,
      "precipitationProbabilityPercent": 80,
      "temperatureCelsius": 28.5,
      "humidityPercent": 75,
      "windSpeedKph": 12,
      "freshness": "UNKNOWN",
      "provenance": "Open-Meteo numerical forecast model"
    },
    "officialWarning": {
      "present": false,
      "source": null,
      "issuedAt": null,
      "validFrom": null,
      "validTo": null
    },
    "sourceAgreement": "INSUFFICIENT_DATA",
    "confidence": "UNKNOWN",
    "limitations": [
      "TMD credentials may be unconfigured",
      "Rain nowcasting is not enabled"
    ]
  },
  "answers": {
    "currentRain": "ยังไม่มีข้อมูลสังเกตการณ์ที่ยืนยันได้",
    "rainIn1h": "แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน 80%",
    "rainIn3h": "แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน 90%"
  }
}
```

## 2. Verification Outcomes

### Failure Isolation Checks
- **TMD Succeeded / Open-Meteo Failed**: `forecast` parses to `null`, `observed` maps successfully with no gateway crashes.
- **Open-Meteo Succeeded / TMD Failed**: `observed` parses to `null`, `forecast` maps successfully with no gateway crashes.
- **Both Failed**: Both are `null`, responses returned with HTTP 200 containing unmapped empty states.

### Question-Answer Semantics
- **Current rain**: Kept isolated to observed data only. No model forecast is used to claim observed rainfall.
- **Forecast rain**: Explicitly formats probability values from Open-Meteo model arrays.

## 3. Governance & Safety Gate Checklist

- **Pipeline Activation**: `WEATHER_SITUATION_PIPELINE_ENABLED=false` (Default is false, blocks all external fetches).
- **realDataConnected**: `false`
- **operationalUseApproved**: `false`
- **Production UI**: Unchanged; no situation cards or warning widgets are loaded.
