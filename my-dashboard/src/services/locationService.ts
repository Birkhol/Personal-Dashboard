export type Coordinates = {
    latitude: number
    longitude: number
}

const fallbackCoordinates: Coordinates = {
    latitude: 62.3072,
    longitude: 6.9346
}

export function getCurrentPosition(): Promise<Coordinates> {
    return new Promise(resolve => {
        if (!navigator.geolocation) {
            resolve(fallbackCoordinates)
            return
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            error => {
                console.warn("Using fallback location", error)
                resolve(fallbackCoordinates)
            }
        )
    })
}