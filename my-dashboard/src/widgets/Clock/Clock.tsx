import { useEffect, useState } from "react"
import "./Clock.css"

function Clock() {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const hours = currentTime.getHours().toString().padStart(2, "0")
    const minutes = currentTime.getMinutes().toString().padStart(2, "0")
    const seconds = currentTime.getSeconds().toString().padStart(2, "0")
    const day = currentTime.toLocaleDateString("en-US", { day: "numeric" })
    const month = currentTime.toLocaleDateString("en-US", { month: "long" })
    const weekday = currentTime.toLocaleDateString("en-US", { weekday: "long" })

    return (
        <section className="widget clock">
            <h2>
                {hours}:{minutes}:{seconds}
            </h2>
            <h4>
                {weekday}, {day} {month}
            </h4>
        </section>
    )
}

export default Clock