import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { getRandomCat } from "../../services/catService"
import "./Cat.css"
import "../../components/layout/Dashboard.css"

function Cat() {
    const [catUrl, setCatUrl] = useState("")
    const [loading, setLoading] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        async function loadCat() {
            const today = new Date().toDateString()

            const savedDate = localStorage.getItem("catDate")
            const savedCat = localStorage.getItem("catUrl")

            if (savedDate === today && savedCat) {
                setCatUrl(savedCat)
                setLoading(false)
                return
            }

            try {
                const url = await getRandomCat()

                localStorage.setItem("catDate", today)
                localStorage.setItem("catUrl", url)

                setCatUrl(url)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadCat()
    }, [])

    useEffect(() => {
        if (!isExpanded) return

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setIsExpanded(false)
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", closeOnEscape)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [isExpanded])

    return (
        <section className="widget cat">
            <h2 className="cat-title">Cat of the Day</h2>

            <div className="widget-content">
                {loading ? (
                    <div className="loading-circle" />
                ) : (
                    <div className="cat-image-container">
                        <button
                            type="button"
                            className="cat-image-button"
                            onClick={() => setIsExpanded(true)}
                            aria-label="Expand Cat of the Day image"
                        >
                            <img src={catUrl} alt="Cat of the Day" className="cat-image" />
                        </button>
                    </div>
                )}
            </div>

            {isExpanded && createPortal(
                <div
                    className="cat-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Expanded Cat of the Day image"
                    onClick={() => setIsExpanded(false)}
                >
                    <button
                        type="button"
                        className="cat-lightbox-close"
                        onClick={() => setIsExpanded(false)}
                        aria-label="Close expanded image"
                        autoFocus
                    >
                        &times;
                    </button>
                    <img
                        src={catUrl}
                        alt="Cat of the Day"
                        className="cat-lightbox-image"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>,
                document.body,
            )}
        </section>
    )
}

export default Cat