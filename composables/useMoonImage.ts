// composables/useMoonImage.ts

export const useMoonImage = () => {
    // Constants for moon size calculations
    const MOON_MIN_DISTANCE = 363104  // km (perigee)
    const MOON_MAX_DISTANCE = 405696  // km (apogee)
    const BASE_SIZE = 64  // base size in pixels for our moon display

    // Calculate apparent size based on distance
    const calculateApparentSize = (distance: number): number => {
        // Normalize the distance between 0 and 1
        const normalizedDistance = (distance - MOON_MIN_DISTANCE) / (MOON_MAX_DISTANCE - MOON_MIN_DISTANCE)
        // Inverse relationship - closer means larger
        const sizeMultiplier = 1 - (normalizedDistance * 0.2) // 20% size variation
        return Math.round(BASE_SIZE * sizeMultiplier)
    }

    // Calculate moon's rotation based on location and position
    const calculateMoonRotation = (altitude: number, azimuth: number, parallacticAngle: number): number => {
        // Combine these angles to get the apparent rotation of the moon
        // This affects how the terminator line (the boundary between light and dark) appears
        return parallacticAngle + (azimuth > 180 ? -altitude : altitude)
    }

    // Calculate moon phase mask path
    const getMoonPhaseMask = (
        phase: number,
        illumination: string,
        stage: string
    ): string => {
        const radius = 50;
        const center = 50;
        // Convert illumination percentage string to number
        const illum = parseFloat(illumination.replace('%', '')) / 100;
        
        // Calculate the terminator position based on phase
        // Phase is between 0 and 1, where 0 is new moon and 0.5 is full moon
        const x = center + radius * Math.cos((1 - phase) * Math.PI * 2);
        
        // For waning moon (after full), we show the right side getting darker
        // For waxing moon (before full), we show the left side getting lighter
        const isWaning = stage === 'waning';
        
        if (isWaning) {
            // For waning, mask the right side (dark part)
            return `M${center},0 A${radius},${radius} 0 0,1 ${center},100 A${Math.abs(x - center)},${radius} 0 0,${x < center ? 0 : 1} ${center},0`;
        } else {
            // For waxing, mask the left side (dark part)
            return `M${center},0 A${radius},${radius} 0 0,0 ${center},100 A${Math.abs(x - center)},${radius} 0 0,${x < center ? 1 : 0} ${center},0`;
        }
    }

    // Get moon cycle information
    const getMoonCycleInfo = (moonData: any) => {
        return {
            sidereal: {
                effect: `Moon in ${moonData.moon.zodiac.moon_sign}`
            },
            tropical: {
                effect: `Illumination: ${moonData.moon.illumination}`
            }
        }
    }

    return {
        getMoonPhaseMask,
        calculateApparentSize,
        calculateMoonRotation,
        getMoonCycleInfo
    }
}