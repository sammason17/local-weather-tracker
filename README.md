# 🌤️ Anglesey Weather Tracker

A Next.js single-page weather app for ///revise.spouting.visa (Llanfechell, Anglesey).

## Setup

```bash
npm install
npm run dev
```
Data will be available at: [http://localhost:3000]

No API keys needed — all weather data comes from Open-Meteo (completely free).

## Changing Location

Edit `.env.local`:

```
NEXT_PUBLIC_LOCATION_LAT=53.4084
NEXT_PUBLIC_LOCATION_LNG=-4.3969
NEXT_PUBLIC_LOCATION_NAME=Llanfechell, Anglesey
```

## Data Sources

- 7-day forecasts: ECMWF IFS, Met Office UKV, NOAA GFS via Open-Meteo (refreshed every 30 min)
- 3-month outlook: ECMWF SEAS5 seasonal ensemble via Open-Meteo (refreshed every 6 hours)
