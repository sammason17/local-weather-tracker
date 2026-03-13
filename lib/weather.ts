import { Coordinates } from './location'

export interface DayForecast {
  date: string
  tempMax: number
  tempMin: number
  precipProb: number
  cloudCover: number
}

export interface ModelForecast {
  model: string
  label: string
  days: DayForecast[]
}

export interface SeasonalDay {
  date: string
  tempMax: number
  tempMin: number
}

const MODELS = [
  { model: 'ecmwf_ifs', label: 'ECMWF IFS' },
  { model: 'ukmo_seamless', label: 'Met Office' },
  { model: 'gfs_seamless', label: 'NOAA GFS' },
]

// Derive precipitation probability from precipitation amount (mm)
// Used when precipitation_probability_max is not available
function derivePrecipProb(precipSum: number | null | undefined): number {
  if (precipSum == null || precipSum <= 0) return 0
  if (precipSum < 1) return 30
  if (precipSum < 2) return 50
  if (precipSum < 5) return 70
  if (precipSum < 10) return 85
  return 95
}

export async function fetchWeekForecasts(coords: Coordinates): Promise<ModelForecast[]> {
  const { lat, lng } = coords
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,cloud_cover_mean',
    forecast_days: '7',
    timezone: 'Europe/London',
  })

  const results = await Promise.all(
    MODELS.map(async ({ model, label }) => {
      const url = `https://api.open-meteo.com/v1/forecast?${params}&models=${model}`
      const res = await fetch(url, { next: { revalidate: 1800 } } as RequestInit)
      if (!res.ok) throw new Error(`Open-Meteo error for ${label}: ${res.status}`)
      const data = await res.json()
      const { daily } = data

      const days: DayForecast[] = daily.time.map((date: string, i: number) => {
        const precipProbDirect = daily.precipitation_probability_max?.[i]
        const precipSum = daily.precipitation_sum?.[i]
        const precipProb = precipProbDirect != null
          ? Math.round(precipProbDirect)
          : derivePrecipProb(precipSum)

        return {
          date,
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          precipProb,
          cloudCover: Math.round(daily.cloud_cover_mean[i] ?? 0),
        }
      })

      return { model, label, days }
    })
  )

  return results
}

export async function fetchSeasonalForecast(coords: Coordinates): Promise<SeasonalDay[]> {
  const { lat, lng } = coords
  const url = `https://seasonal-api.open-meteo.com/v1/seasonal?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min&forecast_days=92&timezone=Europe/London`
  const res = await fetch(url, { next: { revalidate: 21600 } } as RequestInit)
  if (!res.ok) throw new Error(`Seasonal API error: ${res.status}`)
  const data = await res.json()
  const { daily } = data

  return daily.time.map((date: string, i: number) => ({
    date,
    tempMax: Math.round(daily.temperature_2m_max[i]),
    tempMin: Math.round(daily.temperature_2m_min[i]),
  }))
}
