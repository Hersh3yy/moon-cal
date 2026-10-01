// Shape of the moon-phase API response (moon-phase.p.rapidapi.com /advanced), as the app uses it.
// Field names are the API's own; keep them.

export interface Coordinates {
  lat: number
  lon: number
}

export type LocationSource = 'default' | 'saved' | 'gps' | 'search'

export interface PhaseEvent {
  timestamp: number // unix seconds
  datestamp: string
  days_ago?: number
  days_ahead?: number
  name?: string
  description?: string
}

export interface PhasePair {
  last?: PhaseEvent
  next?: PhaseEvent
}

export interface UpcomingPhases {
  new_moon?: PhasePair
  first_quarter?: PhasePair
  full_moon?: PhasePair
  last_quarter?: PhasePair
}

export interface SunData {
  sunrise: number
  sunrise_timestamp: string // "07:41", local to the queried location
  sunset: number
  sunset_timestamp: string
  solar_noon: string
  day_length: string
  position: {
    altitude: number
    azimuth: number
    distance: number // metres
  }
}

export interface MoonPosition {
  altitude: number
  azimuth: number
  distance: number // metres
  parallactic_angle: number
  phase_angle: number
}

export interface MoonVisibility {
  visible_hours: number
  best_viewing_time: string
  visibility_rating: string
  illumination: string
  viewing_conditions?: {
    phase_quality?: string
    recommended_equipment?: {
      filters?: string
      telescope?: string
      best_magnification?: string
    }
  }
}

export interface OptimalViewingPeriod {
  start_time: string
  end_time: string
  duration_hours: number
  viewing_quality: string
  recommendations: string[]
}

export interface MoonSection {
  phase: number // 0 new → 0.5 full → 1 new
  phase_name: string
  major_phase: string
  stage: 'waxing' | 'waning' | string
  illumination: string // "71%"
  age_days: number
  lunar_cycle: string // "71.45%"
  emoji: string
  zodiac: {
    sun_sign: string
    moon_sign: string
  }
  moonrise: string
  moonrise_timestamp: number
  moonset: string
  moonset_timestamp: number
  detailed: {
    position: MoonPosition
    visibility?: MoonVisibility
    upcoming_phases?: UpcomingPhases
    illumination_details?: {
      percentage: number
      visible_fraction: number
      phase_angle: number
    }
  }
  events?: {
    moonrise_visible?: boolean
    moonset_visible?: boolean
    optimal_viewing_period?: OptimalViewingPeriod
  }
}

export interface MoonData {
  timestamp: number
  datestamp: string
  plan?: string
  sun: SunData
  moon: MoonSection
}
