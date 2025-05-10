interface WeatherResponse {
    location: string;
    temp: number;
    weather: {
        main: string;
        description: string;
    };
}

function isWeatherResponse(data: unknown): data is WeatherResponse {
    return typeof data === "object" &&
        data !== null &&
        "location" in data &&
        "temp" in data &&
        "weather" in data &&
        typeof data.location === "string" &&
        typeof data.temp === "number" &&
        typeof data.weather === "object" &&
        data.weather !== null &&
        "main" in data.weather &&
        "description" in data.weather &&
        typeof data.weather.main === "string" &&
        typeof data.weather.description === "string";
}

function getWeather(): Promise<WeatherResponse> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async position => {
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
            const json = await response.json() as unknown;
            if(isWeatherResponse(json)) {
                resolve(json);
            } else {
                reject(new Error("Invalid response from server when getting weather data."));
            }
        });
    });
}

export default getWeather;
