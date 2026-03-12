export interface Coordinates {
  lat: number
  lng: number
  name: string
}

export function getLocationFromEnv(): Coordinates {
  const lat = parseFloat(process.env.NEXT_PUBLIC_LOCATION_LAT ?? '')
  const lng = parseFloat(process.env.NEXT_PUBLIC_LOCATION_LNG ?? '')
  const name = process.env.NEXT_PUBLIC_LOCATION_NAME ?? 'Unknown location'

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error(
      'NEXT_PUBLIC_LOCATION_LAT and NEXT_PUBLIC_LOCATION_LNG must be set in .env.local'
    )
  }

  return { lat, lng, name }
}
