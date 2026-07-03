const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

const authorizationEndpoint = "https://accounts.spotify.com/authorize"
const tokenEndpoint = "https://accounts.spotify.com/api/token"
const currentlyPlayingEndpoint = "https://api.spotify.com/v1/me/player/currently-playing"

const scopes = ["user-read-currently-playing", "user-read-playback-state"]

export type SpotifyTrack = {
    title: string
    artist: string
    albumImageUrl: string
    isPlaying: boolean
}

function generateRandomString(length: number) {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let text = ""

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await crypto.subtle.digest("SHA-256", data)

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

export async function loginWithSpotify() {
    const codeVerifier = generateRandomString(64)
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    localStorage.setItem("spotify_code_verifier", codeVerifier)

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scopes.join(" "),
        code_challenge_method: "S256",
        code_challenge: codeChallenge
    })

    window.location.href = `${authorizationEndpoint}?${params.toString()}`
}

export async function handleSpotifyCallback() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (!code) {
        return
    }

    window.history.replaceState({}, document.title, "/")

    const codeVerifier = localStorage.getItem("spotify_code_verifier")

    if (!codeVerifier) {
        return
    }

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    })

    const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body
    })

    if (!response.ok) {
        const errorData = await response.json()
        console.error("Spotify token error:", errorData)
        return
    }

    const data = await response.json()

    localStorage.setItem("spotify_access_token", data.access_token)
    localStorage.removeItem("spotify_code_verifier")
}

export async function getCurrentlyPlaying(): Promise<SpotifyTrack | null> {
    const accessToken = localStorage.getItem("spotify_access_token")

    if (!accessToken) {
        return null
    }

    const response = await fetch(currentlyPlayingEndpoint, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (response.status === 204) {
        return null
    }

    if (!response.ok) {
        throw new Error("Could not fetch currently playing track")
    }

    const data = await response.json()

    return {
        title: data.item.name,
        artist: data.item.artists.map((artist: { name: string }) => artist.name).join(", "),
        albumImageUrl: data.item.album.images[0]?.url ?? "",
        isPlaying: data.is_playing
    }
}

export function isSpotifyLoggedIn() {
    return localStorage.getItem("spotify_access_token") !== null
}

export function logoutSpotify() {
    localStorage.removeItem("spotify_access_token")
    localStorage.removeItem("spotify_code_verifier")
}