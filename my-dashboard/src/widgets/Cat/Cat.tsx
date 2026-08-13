import { useEffect, useState } from "react"
import { getRandomCat } from "../../services/catService"
import "./Cat.css"
import "../../components/layout/Dashboard.css"

function Cat() {
    const [catUrl, setCatUrl] = useState("")
    const [loading, setLoading] = useState(true)

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

    return (
        <section className="widget cat">
            <h2 className="cat-title">Cat of the Day</h2>

            <div className="widget-content">
                {loading ? (
                    <div className="loading-circle" />
                ) : (
                    <div className="cat-image-container">
                        <img
                            src={catUrl}
                            alt="Cat of the Day"
                            className="cat-image"
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default Cat