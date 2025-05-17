/**
 * The shape of the weather response returned from the server.
 */
interface WeatherResponse {
    location: string;
    temp: number;
    weather: {
        main: string;
        description: string;
    };
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string}
 */
function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Type guard to check if a value is a WeatherResponse.
 * @param {unknown} data
 * @returns {data is WeatherResponse}
 */
function isWeatherResponse(data: unknown): data is WeatherResponse {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    const obj = data as Record<string, unknown>;
    if (typeof obj.location !== "string" || typeof obj.temp !== "number" || typeof obj.weather !== "object" || obj.weather === null) {
        return false;
    }
    const weather = obj.weather as Record<string, unknown>;
    return (
        typeof weather.main === "string" &&
        typeof weather.description === "string"
    );
}

/**
 * Gets the current weather for the user's location using the browser's geolocation API.
 * @returns {Promise<WeatherResponse>} Resolves with weather data or rejects on error.
 */
function getWeather(): Promise<WeatherResponse> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async position => {
                // Send coordinates to the server to get weather data
                const response = await fetch("/api/weather", {
                    headers: {
                        "Content-type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }),
                });
                const json = (await response.json()) as unknown;
                if (isWeatherResponse(json)) {
                    // Capitalize the weather description for display
                    json.weather.description = capitalize(json.weather.description);
                    resolve(json);
                } else {
                    reject(new Error("Invalid response from server when getting weather data."));
                }
            },
            err => {
                reject(new Error(err.message));
            },
        );
    });
}

export default getWeather;
