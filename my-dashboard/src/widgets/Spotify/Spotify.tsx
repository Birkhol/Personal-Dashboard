import { useEffect, useState } from "react"
import { FaSpotify } from "react-icons/fa"
import {
    getCurrentlyPlaying,
    handleSpotifyCallback,
    isSpotifyLoggedIn,
    loginWithSpotify,
    logoutSpotify,
    type SpotifyTrack
} from "../../services/spotifyService"
import "./Spotify.css"

function Spotify() {
    const [track, setTrack] = useState<SpotifyTrack | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(isSpotifyLoggedIn())
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function setupSpotify() {
            try {
                await handleSpotifyCallback()
                setIsLoggedIn(isSpotifyLoggedIn())
            } catch (error) {
                console.error(error)
                setError("Could not connect to Spotify.")
            }
        }

        setupSpotify()
    }, [])

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }

        async function loadCurrentlyPlaying() {
            try {
                const currentlyPlaying = await getCurrentlyPlaying()

                setTrack(currentlyPlaying)
                setError("")
            } catch (error) {
                console.error(error)
                setError("Could not load Spotify track.")
            } finally {
                setIsLoading(false)
            }
        }

        loadCurrentlyPlaying()

        const interval = setInterval(() => {
            loadCurrentlyPlaying()
        }, 1000)

        return () => clearInterval(interval)
    }, [isLoggedIn])

    function handleLogout() {
        logoutSpotify()
        setIsLoggedIn(false)
        setTrack(null)
    }

    if (!isLoggedIn) {
        return (
            <section className="widget spotify">
                <h2 className="spotify-title"><FaSpotify />Spotify</h2>
                <button type="button" className="spotify-button" onClick={loginWithSpotify}>Login with Spotify</button>
            </section>
        )
    }

    return (
        <section className="widget spotify">
            <h2 className="spotify-title"><FaSpotify />Spotify</h2>
            <div className="widget-content">
                {isLoading && <p>Loading...</p>}
                {!isLoading && track === null && <p>Nothing currently playing</p>}
                {track && (
                    <div className="spotify-track">
                        {track.albumImageUrl && (
                            <img src={track.albumImageUrl} alt={`${track.title} album cover`} />
                        )}

                        <div>
                            <h3>{track.title}</h3>
                            <p>{track.artist}</p>
                            <div className="song-status">
                                <p className={track.isPlaying ? "isPlaying" : "isPaused"}>{track.isPlaying ? "Playing" : "Paused"}</p>
                            </div>
                        </div>
                    </div>
                )}

                <button type="button" className="spotify-button" onClick={handleLogout}>Logout</button>
            </div>
            {error && <p>{error}</p>}
        </section>
    )
}

export default Spotify