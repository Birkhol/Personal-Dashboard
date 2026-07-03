import { useEffect, useState } from "react"
import "./Notes.css"

function Notes() {
    const [note, setNote] = useState(() => {
        const savedNote = localStorage.getItem("note")

        if (savedNote === null) {
            return ""
        }

        return savedNote
    })

    useEffect(() => {
        localStorage.setItem("note", note)
    }, [note])
    return (
        <section className="widget notes">
            <h2>Notes</h2>
            <div className="widget-content">
                <textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Write your notes here..." />
            </div>
        </section>
    )
}

export default Notes