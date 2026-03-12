'use client'

interface Props {
  precipProb: number
  cloudCover: number
}

export default function WeatherIcon({ precipProb, cloudCover }: Props) {
  if (precipProb >= 60) return <span title="Rainy" className="text-2xl">🌧️</span>
  if (precipProb >= 30) return <span title="Showers possible" className="text-2xl">🌦️</span>
  if (cloudCover >= 70) return <span title="Overcast" className="text-2xl">☁️</span>
  if (cloudCover >= 30) return <span title="Partly cloudy" className="text-2xl">⛅</span>
  return <span title="Sunny" className="text-2xl">☀️</span>
}
