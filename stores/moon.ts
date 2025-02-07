// stores/moon.ts
import { defineStore } from "pinia";
import { useCoordinateLookup } from "@/composables/useCoordinateLookup";
import { useRuntimeConfig } from "#app";

interface Coordinates {
    lat: number;
    lon: number;
}

interface MoonPhase {
  timestamp: number;
  datestamp: string;
  days_ago?: number;
  days_ahead?: number;
  name?: string;
  description?: string;
}

interface MoonPhases {
  new_moon?: {
    last?: MoonPhase;
    next?: MoonPhase;
  };
  first_quarter?: {
    last?: MoonPhase;
    next?: MoonPhase;
  };
  full_moon?: {
    last?: MoonPhase;
    next?: MoonPhase;
  };
  last_quarter?: {
    last?: MoonPhase;
    next?: MoonPhase;
  };
}

interface Location {
  latitude?: string;
  longitude?: string;
  precision?: number;
  using_default_location?: boolean;
  note?: string | null;
}

interface MoonData {
    timestamp: number;
    datestamp: string;
    plan: string;
    sun: {
        sunrise: number;
        sunrise_timestamp: string;
        sunset: number;
        sunset_timestamp: string;
        solar_noon: string;
        day_length: string;
        sun_altitude: number;
        sun_distance: number;
        sun_azimuth: number;
        next_solar_eclipse?: {
            timestamp: number;
            datestamp: string;
            type: string;
            visibility_regions: string;
        };
    };
    moon: {
        phase: number;
        phase_name: string;
        major_phase: string;
        stage: string;
        illumination: string;
        age_days: number;
        lunar_cycle: string;
        emoji: string;
        zodiac: {
            sun_sign: string;
            moon_sign: string;
        };
        moonrise: string;
        moonrise_timestamp: number;
        moonset: string;
        moonset_timestamp: number;
        moon_altitude: number;
        moon_distance: number;
        moon_azimuth: number;
        moon_parallactic_angle: number;
        next_lunar_eclipse: {
            timestamp: number;
            datestamp: string;
            type: string;
            visibility_regions: string;
        };
        detailed: {
            position: {
                altitude: number;
                azimuth: number;
                phase_angle: number;
                illumination: number;
            };
            visibility: {
                visible_hours: number;
                best_viewing_time: string;
                visibility_rating: string;
                illumination: string;
                viewing_conditions: {
                    phase_quality: string;
                    recommended_equipment: {
                        filters: string;
                        telescope: string;
                        best_magnification: string;
                    };
                };
            };
        };
    };
    moon_phases: MoonPhases;
    location: Location;
}


export const useMoonStore = defineStore("moon", {
  state: () => ({
    moonData: null as MoonData | null,
    loading: false,
    error: null as string | null,
    coordinates: {
      lat: 52.3676,
      lon: 4.9041,
    } as Coordinates,
    cityName: "Amsterdam"
  }),

  actions: {
    async fetchMoonData() {
      this.loading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `https://moon-phase.p.rapidapi.com/advanced?lat=${this.coordinates.lat}&lon=${this.coordinates.lon}`,
          {
            headers: {
              "x-rapidapi-key": config.public.moonApiKey,
              "x-rapidapi-host": "moon-phase.p.rapidapi.com",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Validate required data structure
        if (!data?.moon_phases?.full_moon?.next) {
          throw new Error('Invalid data structure received from API');
        }

        this.moonData = data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        throw error; // Re-throw for component handling
      } finally {
        this.loading = false;
      }
    },

    async updateLocation(city: string) {
      if (!city?.trim()) {
        this.error = 'Please enter a valid city name';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const { fetchCoordinates, coordinates, displayName } = useCoordinateLookup();
        await fetchCoordinates(city);

        if (!coordinates.value?.lat || !coordinates.value?.lon) {
          throw new Error('Invalid coordinates received from lookup');
        }

        this.coordinates = {
          lat: coordinates.value.lat,
          lon: coordinates.value.lon,
        };
        this.cityName = displayName.value || city;

        await this.fetchMoonData();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update location';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});