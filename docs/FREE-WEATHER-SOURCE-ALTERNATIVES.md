# Free Weather Source Alternatives

Since Windy's free testing tier returns scrambled data and its Professional API is paid, this document maps legally compliant, free/open alternatives for each required capability in production.

| Required Capability | Windy Status | Best Free Alternative | Alternative License | Confidence | Details / Integration Method |
|---|---|---|---|---|---|
| **Rain Forecast** | `RESTRICTED` | **Open-Meteo API** | CC BY 4.0 (Free non-commercial <10k/day) | **High** | Query point coordinates directly for hourly rain volume forecasts. |
| **Wind Forecast** | `RESTRICTED` | **Open-Meteo API** / **NOAA GFS** | CC BY 4.0 / Public Domain | **High** | Point queries returning speed (kph) and wind direction. |
| **Temperature** | `RESTRICTED` | **Open-Meteo API** | CC BY 4.0 | **High** | Returns hourly temperature in Celsius. |
| **Pressure** | `RESTRICTED` | **Open-Meteo API** | CC BY 4.0 | **High** | Returns mean sea level pressure (hPa). |
| **Cloud** | `RESTRICTED` | **Open-Meteo API** | CC BY 4.0 | **High** | Returns total cloud cover percentage (%). |
| **Radar** | `NOT_AVAILABLE` | **RainViewer API** | Free with mandatory watermark attribution | **High** | Provides standard tile URLs (`x/y/z`) and JSON animation timeline frames. |
| **Satellite** | `NOT_AVAILABLE` | **NASA GIBS** / **JMA Himawari-8** | Public Domain (NASA GIBS Terms) | **High** | Web Map Service (WMS) tiles for near-real-time global cloud layers. |
| **Rain Accumulation** | `RESTRICTED` | **Open-Meteo API** | CC BY 4.0 | **High** | Calculates 24h, 3-day, or 7-day accumulation from hourly forecast arrays. |
| **Model Comparison** | `RESTRICTED` | **Open-Meteo Multi-Model** | CC BY 4.0 | **High** | Fetch GFS, ECMWF, and ICON forecasts in a single query payload. |

---

## Alternative Licensing Reference

- **CC BY 4.0 (Creative Commons Attribution 4.0 International)**: Allowed for public display and decision-support systems, provided clear attribution is rendered on the UI (e.g., "Weather forecasts by Open-Meteo").
- **Public Domain (NOAA / NASA GIBS)**: Free use and distribution without restrictions. Attribution is recommended but not legally binding.
- **RainViewer Free Terms**: Allows embedding interactive radar layers on web maps at no cost, provided the RainViewer logo/link watermark is visible.
