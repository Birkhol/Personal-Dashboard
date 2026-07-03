import "./Shortcuts.css"
import { FaGithub, FaYoutube, FaSpotify, FaFacebook, FaTwitch } from "react-icons/fa"
import { SiGmail } from "react-icons/si"

const shortcuts = [
    {
        name: "YouTube",
        url: "https://youtube.com",
        icon: <FaYoutube />
    },
    {
        name: "Twitch",
        url: "https://twitch.com",
        icon: <FaTwitch />
    },
    {
        name: "Facebook",
        url: "https://facebook.com",
        icon: <FaFacebook />
    },
    {
        name: "Gmail",
        url: "https://gmail.com",
        icon: <SiGmail />
    },
    {
        name: "GitHub",
        url: "https://github.com",
        icon: <FaGithub />
    },
]

function Shortcuts() {
    return (
        <section className="widget shortcuts">
            <h2>Favorites</h2>

            <div className="widget-content">
                <div className="shortcuts-grid">
                    {shortcuts.map(shortcut => (
                        <a
                            key={shortcut.name}
                            href={shortcut.url}
                            target="_blank"
                            rel="noreferrer"
                            className="shortcut"
                        >
                            <span className="shortcut-icon">{shortcut.icon}</span>
                            <span>{shortcut.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Shortcuts