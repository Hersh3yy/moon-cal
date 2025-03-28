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
        next_lunar_eclipse?: {
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
            upcoming_phases: {
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
            };
            illumination_details?: {
                percentage: number;
                visible_fraction: number;
                phase_angle: number;
            };
        };
        events?: {
            moonrise_visible: boolean;
            moonset_visible: boolean;
            optimal_viewing_period?: {
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
    cityName: "Amsterdam",
    dataStructureWarnings: [] as string[]
  }),

  actions: {
    async fetchMoonData() {
      console.log('Starting fetchMoonData...')
      this.loading = true;
      this.error = null;
      this.dataStructureWarnings = [];

      try {
        const config = useRuntimeConfig();
        console.log('Fetching from API with coordinates:', this.coordinates)
        
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
        console.log('Raw API response:', rawText.substring(0, 200) + '...') // Log first 200 chars
        
        const lastJsonBraceIndex = rawText.lastIndexOf('}}');
        
        if (lastJsonBraceIndex === -1) {
          throw new Error('Could not find valid JSON structure in response');
        }

        const cleanedJson = rawText.substring(0, lastJsonBraceIndex + 2);
        let data;
        
        try {
          data = JSON.parse(cleanedJson);
          console.log('Parsed API response structure:', {
            hasMoon: !!data.moon,
            hasDetailed: !!data.moon?.detailed,
            phase: data.moon?.phase_name,
            illumination: data.moon?.illumination,
            detailedPercentage: data.moon?.detailed?.illumination_details?.percentage
          })
        } catch (parseError: unknown) {
          console.error('JSON parse error:', parseError)
          throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }

        // Validate essential data structure
        const requiredFields = [
          'moon.phase',
          'moon.phase_name',
          'moon.illumination',
          'moon.detailed.upcoming_phases.full_moon.next',
          'sun.sunrise_timestamp',
          'sun.sunset_timestamp'
        ];

        const missingFields = requiredFields.filter(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], data);
          return value === undefined;
        });

        if (missingFields.length > 0) {
          console.warn('API response missing required fields:', missingFields);
          this.dataStructureWarnings.push(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Log any unexpected structure changes
        if (data.moon_phases) {
          console.warn('API response contains deprecated moon_phases structure');
          this.dataStructureWarnings.push('API response contains deprecated moon_phases structure');
        }

        // Set the data
        this.moonData = data;
        console.log('Successfully set moonData in store')
      } catch (error) {
        console.error('Error in fetchMoonData:', error)
        this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      } finally {
        this.loading = false;
      }
    },

    async updateLocation(city: string) {
      console.log('Starting updateLocation for city:', city)
      if (!city?.trim()) {
        this.error = 'Please enter a valid city name';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const { fetchCoordinates, coordinates, displayName } = useCoordinateLookup();
        await fetchCoordinates(city);
        console.log('Coordinates lookup result:', coordinates.value)

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
        console.error('Error in updateLocation:', error)
        this.error = error instanceof Error ? error.message : 'Failed to update location';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});