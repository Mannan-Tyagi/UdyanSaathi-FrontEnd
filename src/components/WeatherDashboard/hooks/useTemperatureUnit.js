import { useState, useCallback } from "react";

/**
 * Custom hook for managing temperature unit preference
 */
export const useTemperatureUnit = (defaultUnit = "C") => {
    const [unit, setUnit] = useState(defaultUnit);

    const toggleUnit = useCallback(() => {
        setUnit((prev) => (prev === "C" ? "F" : "C"));
    }, []);

    const setToCelsius = useCallback(() => setUnit("C"), []);
    const setToFahrenheit = useCallback(() => setUnit("F"), []);

    return {
        unit,
        toggleUnit,
        setToCelsius,
        setToFahrenheit,
        isCelsius: unit === "C",
        isFahrenheit: unit === "F",
    };
};

export default useTemperatureUnit;
