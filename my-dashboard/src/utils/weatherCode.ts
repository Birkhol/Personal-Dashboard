export type WeatherInfo = {
    description: string
    icon: string
}

export function getWeatherInfo(code: number): WeatherInfo {
    switch (code) {
        case 0:
            return { description: "Clear sky", icon: "☀️" }

        case 1:
            return { description: "Mainly clear", icon: "🌤️" }

        case 2:
            return { description: "Partly cloudy", icon: "⛅" }

        case 3:
            return { description: "Overcast", icon: "☁️" }

        case 45:
        case 48:
            return { description: "Fog", icon: "🌫️" }

        case 51:
        case 53:
        case 55:
            return { description: "Drizzle", icon: "🌦️" }

        case 56:
        case 57:
            return { description: "Freezing drizzle", icon: "🌧️" }

        case 61:
        case 63:
        case 65:
            return { description: "Rain", icon: "🌧️" }

        case 66:
        case 67:
            return { description: "Freezing rain", icon: "🌧️" }

        case 71:
        case 73:
        case 75:
            return { description: "Snow", icon: "❄️" }

        case 77:
            return { description: "Snow grains", icon: "🌨️" }

        case 80:
        case 81:
        case 82:
            return { description: "Rain showers", icon: "🌦️" }

        case 85:
        case 86:
            return { description: "Snow showers", icon: "🌨️" }

        case 95:
            return { description: "Thunderstorm", icon: "⛈️" }

        case 96:
        case 99:
            return { description: "Thunderstorm with hail", icon: "⛈️" }

        default:
            return { description: "Unknown weather", icon: "❔" }
    }
}