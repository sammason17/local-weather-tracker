import { getLocationFromEnv } from '../lib/location'
import { fetchWeekForecasts, fetchSeasonalForecast } from '../lib/weather'
import ForecastGrid from '../components/ForecastGrid'
import SeasonalChart from '../components/SeasonalChart'
import { Suspense } from 'react'

async function WeatherData() {
  let coords
  let error: string | null = null

  try {
    coords = getLocationFromEnv()
  } catch (e: any) {
    error = e.message
  }

  if (error || !coords) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-red-300">
        <p className="font-semibold mb-1">⚠️ Could not load location</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">
          Make sure <code className="bg-red-950 px-1 rounded">NEXT_PUBLIC_LOCATION_LAT</code> and{' '}
          <code className="bg-red-950 px-1 rounded">NEXT_PUBLIC_LOCATION_LNG</code> are set in{' '}
          <code className="bg-red-950 px-1 rounded">.env.local</code>
        </p>
      </div>
    )
  }

  const [weekForecasts, seasonalData] = await Promise.all([
    fetchWeekForecasts(coords),
    fetchSeasonalForecast(coords),
  ])

  return (
    <>
      <p className="text-slate-500 text-xs mb-6">
        📍 {coords.name} &nbsp;·&nbsp; {coords.lat}°N, {Math.abs(coords.lng)}°W &nbsp;·&nbsp; {weekForecasts.length} models loaded
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-200 mb-1">7-Day Forecast</h2>
        <p className="text-slate-500 text-sm mb-4">Live data from 3 weather models — updated every 30 minutes</p>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <ForecastGrid forecasts={weekForecasts} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-200 mb-1">3-Month Outlook</h2>
        <p className="text-slate-500 text-sm mb-4">
          Ensemble estimates from ECMWF SEAS5 — accuracy decreases further from today
        </p>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <SeasonalChart data={seasonalData} />
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {seasonalData.filter((_, i) => i % 7 === 0).slice(0, 13).map(day => {
            const d = new Date(day.date + 'T12:00:00')
            return (
              <div key={day.date} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">
                  {d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
                <div className="text-orange-400 font-bold text-sm">{day.tempMax}°</div>
                <div className="text-blue-400 text-xs">{day.tempMin}°</div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌤️</span>
            <h1 className="text-3xl font-bold text-white tracking-tight">Local Weather Tracker</h1>
          </div>
          <p className="text-slate-400 text-sm">Hyperlocal forecast for localised reports</p>
        </div>

        <Suspense fallback={
          <div className="flex items-center gap-3 text-slate-400 py-12">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading weather data...</span>
          </div>
        }>
          <WeatherData />
        </Suspense>

        <footer className="mt-16 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
          Data: Open-Meteo (ECMWF · Met Office UKV · NOAA GFS · SEAS5) · All sources free &amp; open
        </footer>
      </div>
    </main>
  )
}
