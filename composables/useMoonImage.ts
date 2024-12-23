export const useMoonImage = () => {
    // Phase mapping for static images
    const phaseToImage = (phase: number): string => {
        const phaseMap = [
            { max: 0.0625, image: 'new-moon.png' },
            { max: 0.1875, image: 'waxing-crescent.png' },
            { max: 0.3125, image: 'first-quarter.png' },
            { max: 0.4375, image: 'waxing-gibbous.png' },
            { max: 0.5625, image: 'full-moon.png' },
            { max: 0.6875, image: 'waning-gibbous.png' },
            { max: 0.8125, image: 'last-quarter.png' },
            { max: 0.9375, image: 'waning-crescent.png' },
            { max: 1.0, image: 'new-moon.png' }
        ];

        const moonPhase = phaseMap.find(p => phase <= p.max);
        return `/images/moon-phase-images/${moonPhase?.image || 'full-moon.png'}`;
    };

    // Hook for future NASA API integration
    const getNasaImage = async (date: Date): Promise<string> => {
        // TODO: Implement NASA image fetching
        return phaseToImage(0);
    };

    // Hook for future 3D generation
    const get3DImage = async (phase: number): Promise<string> => {
        // TODO: Implement 3D generation
        return phaseToImage(phase);
    };

    return {
        phaseToImage,
        getNasaImage,
        get3DImage
    };
};