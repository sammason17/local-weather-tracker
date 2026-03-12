'use client'

import WeatherIcon from './WeatherIcon'
import { ModelForecast } from '../lib/weather'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDay(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return DAYS_SHORT[d.getDay()]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

interface Props {
  forecasts: ModelForecast[]
}

export default function ForecastGrid({ forecasts }: Props) {
  if (!forecasts.length) return null
  const dates = forecasts[0].days.map(d => d.date)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="py-3 px-2 text-left text-slate-400 font-medium w-28">Date</th>
            {forecasts.map(f => (
              <th key={f.model} colSpan={3} className="py-3 px-2 text-center text-sky-400 font-semibold border-l border-slate-700">
                {f.label}
              </th>
            ))}
          </tr>
          <tr className="text-xs text-slate-500 uppercase tracking-wide">
            <th className="pb-2 px-2"></th>
            {forecasts.map(f => (
              <>
                <th key={f.model + '-temp'} className="pb-2 px-2 text-center border-l border-slate-700">Temp</th>
                <th key={f.model + '-rain'} className="pb-2 px-2 text-center">Rain %</th>
                <th key={f.model + '-cloud'} className="pb-2 px-2 text-center">Cloud</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map((date, i) => {
            const isToday = i === 0
            return (
              <tr
                key={date}
                className={`border-t border-slate-800 transition-colors hover:bg-slate-800/40 ${isToday ? 'bg-slate-800/60' : ''}`}
              >
                <td className="py-3 px-2">
                  <div className="font-semibold text-slate-200">{isToday ? 'Today' : formatDay(date)}</div>
                  <div className="text-xs text-slate-500">{formatDate(date)}</div>
                </td>
                {forecasts.map(f => {
                  const day = f.days[i]
                  if (!day) return <td key={f.model} colSpan={3} className="border-l border-slate-700 text-center text-slate-600">N/A</td>
                  return (
                    <>
                      <td key={f.model + '-temp'} className="py-3 px-3 text-center border-l border-slate-700">
                        <div className="flex flex-col items-center gap-1">
                          <WeatherIcon precipProb={day.precipProb} cloudCover={day.cloudCover} />
                          <span className="text-orange-400 font-bold">{day.tempMax}°</span>
                          <span className="text-blue-400 text-xs">{day.tempMin}°</span>
                        </div>
                      </td>
                      <td key={f.model + '-rain'} className="py-3 px-3 text-center">
                        <div className={`font-semibold ${day.precipProb >= 60 ? 'text-blue-400' : day.precipProb >= 30 ? 'text-sky-400' : 'text-slate-400'}`}>
                          {day.precipProb}%
                        </div>
                      </td>
                      <td key={f.model + '-cloud'} className="py-3 px-3 text-center text-slate-400">
                        {day.cloudCover}%
                      </td>
                    </>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
