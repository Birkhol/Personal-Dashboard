import type { Coordinates } from "./locationService"

export type WeatherData = {
    city: string
    temperature: number
    windSpeed: number
    weatherCode: number
}

export async function getWeatherByCoordinates(
    coordinates: Coordinates
): Promise<WeatherData> {
    const { latitude, longitude } = coordinates

    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&wind_speed_unit=ms`
    )

    const weatherData = await weatherResponse.json()

    const city = await getCityName(coordinates)

    return {
        city,
        temperature: weatherData.current_weather.temperature,
        windSpeed: weatherData.current_weather.windspeed,
        weatherCode: weatherData.current_weather.weathercode
    }
}

async function getCityName(coordinates: Coordinates): Promise<string> {
    const { latitude, longitude } = coordinates

    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    )

    const data = await response.json()

    return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality ||
        data.address.county ||
        "Unknown location"
    )
}