import { useEffect, useState } from "react"
import { getCurrentPosition } from "../../services/locationService"
import { getWeatherByCoordinates, type WeatherData } from "../../services/weatherService"
import { getWeatherInfo } from "../../utils/weatherCode"
import "./Weather.css"

function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadWeather() {
            try {
                const coordinates = await getCurrentPosition()
                const weatherData = await getWeatherByCoordinates(coordinates)

                setWeather(weatherData)
            } catch (error) {
                console.error(error)
                setError("Could not load weather.")
            } finally {
                setIsLoading(false)
            }
        }

        loadWeather()

        const interval = setInterval(() => {
            loadWeather()
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <section className="widget weather">
                <h2>Weather</h2>
                <p>Loading...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="widget weather">
                <h2>Weather</h2>
                <p>{error}</p>
            </section>
        )
    }

    if (!weather) {
        return null
    }

    const weatherInfo = getWeatherInfo(weather.weatherCode)

    return (
        <section className="widget weather">
            <h2>{weather.city}</h2>
            <h2 className="weather-icon">{weatherInfo.icon}</h2>
            <h3>{weather.temperature}°C</h3>
            <p>Wind: {weather.windSpeed} m/s</p>
        </section>
    )
}

export default Weather