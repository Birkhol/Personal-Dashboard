export type CatImage = {
    url: string
}

const API_URL = "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg,png"

export async function getRandomCat(): Promise<string> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Could not load cat")
    }

    const data: CatImage[] = await response.json()

    return data[0].url
}