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
        position: {
            altitude: number;
            azimuth: number;
            distance: number;
        };
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
                distance: number;
                parallactic_angle: number;
                phase_angle: number;
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
            upcoming_phases: MoonPhases;
            illumination_details: {
                percentage: number;
                visible_fraction: number;
                phase_angle: number;
            };
        };
        events: {
            moonrise_visible: boolean;
            moonset_visible: boolean;
            optimal_viewing_period: {
                start_time: string;
                end_time: string;
                duration_hours: number;
                viewing_quality: string;
                recommendations: string[];
            };
        };
    };
    moon_phases?: MoonPhases;
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

        const rawText = await response.text();
        const lastJsonBraceIndex = rawText.lastIndexOf('}}');
        
        if (lastJsonBraceIndex === -1) {
          throw new Error('Could not find valid JSON structure in response');
        }

        const cleanedJson = rawText.substring(0, lastJsonBraceIndex + 2);
        let data;
        
        try {
          data = JSON.parse(cleanedJson);
        } catch (parseError: unknown) {
          throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }

        // Check if the detailed upcoming_phases exists and create moon_phases property if it doesn't exist
        if (data?.moon?.detailed?.upcoming_phases && !data.moon_phases) {
          data.moon_phases = data.moon.detailed.upcoming_phases;
        }

        // Validate that we have the required data 
        if (!data?.moon_phases?.full_moon?.next && !data?.moon?.detailed?.upcoming_phases?.full_moon?.next) {
          throw new Error('Invalid data structure received from API');
        }

        this.moonData = data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error occurred';
        throw error;
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