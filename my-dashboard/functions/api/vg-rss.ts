export async function onRequestGet() {
    try {
        const response = await fetch("https://www.vg.no/rss/feed", {
            headers: {
                Accept: "application/rss+xml, application/xml, text/xml"
            }
        })

        if (!response.ok) {
            return new Response("Failed to fetch VG RSS feed", {
                status: 502
            })
        }

        const xml = await response.text()

        return new Response(xml, {
            headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "public, max-age=300"
            }
        })
    } catch (error) {
        console.error("VG RSS proxy error:", error)

        return new Response("VG RSS feed unavailable", {
            status: 502
        })
    }
}