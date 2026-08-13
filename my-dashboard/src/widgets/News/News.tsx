import { useEffect, useRef, useState } from "react"
import { getTopVgArticle, type NewsArticle } from "../../services/newsService"
import "./News.css"
import "../../components/layout/Dashboard.css"

function News() {
    const [article, setArticle] = useState<NewsArticle | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const hasLoadedArticle = useRef(false)

    useEffect(() => {
        async function loadTopArticle() {
            try {
                const topArticle = await getTopVgArticle()

                setArticle(topArticle)
                setError("")
                hasLoadedArticle.current = true
            } catch (error) {
                console.error(error)

                if (!hasLoadedArticle.current) {
                    setError("Could not load VG news.")
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadTopArticle()

        const interval = setInterval(() => {
            loadTopArticle()
        }, 300000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="widget news">
            <h2>News</h2>

            <div className="widget-content">
                {isLoading && <div className="loading-circle" />}
                {!isLoading && error && <p>{error}</p>}
                {!isLoading && article && (
                    <a
                        className="news-article"
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {article.imageUrl && (
                            <img
                                className="news-image"
                                src={article.imageUrl}
                                alt=""
                            />
                        )}

                        <div className="news-copy">
                            <p className="news-source">
                                VG
                                {article.category && ` / ${article.category}`}
                            </p>
                            <h3>{article.title}</h3>
                            {article.description && (
                                <p className="news-description">
                                    {article.description}
                                </p>
                            )}
                            {article.publishedAt && (
                                <p className="news-time">
                                    {formatPublishedAt(article.publishedAt)}
                                </p>
                            )}
                        </div>
                    </a>
                )}
            </div>
        </section>
    )
}

function formatPublishedAt(publishedAt: string): string {
    const normalizedPublishedAt = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(publishedAt)
        ? `${publishedAt.replace(" ", "T")}Z`
        : publishedAt
    const date = new Date(normalizedPublishedAt)

    if (Number.isNaN(date.getTime())) {
        return ""
    }

    const time = new Intl.DateTimeFormat("nb-NO", {
        timeZone: "Europe/Oslo",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date)

    return [time].filter(Boolean).join(" ")
}

export default News
