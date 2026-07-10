export type NewsArticle = {
    title: string
    description: string
    link: string
    category: string
    publishedAt: string
    imageUrl: string
}

const VG_RSS_FEED_URL = "https://www.vg.no/rss/feed"
const VG_RSS_PROXY_URL = "/api/vg-rss"

export async function getTopVgArticle(): Promise<NewsArticle> {
    const feedXml = await fetchVgFeed()
    const rssDocument = new DOMParser().parseFromString(feedXml, "application/xml")
    const parserError = rssDocument.querySelector("parsererror")

    if (parserError) {
        throw new Error("Could not parse VG feed")
    }

    const topItem = rssDocument.querySelector("channel > item")

    if (!topItem) {
        throw new Error("VG feed does not contain articles")
    }

    return {
        title: getRequiredText(topItem, "title"),
        description: getText(topItem, "description"),
        link: getRequiredText(topItem, "link"),
        category: getText(topItem, "category"),
        publishedAt: getText(topItem, "pubDate"),
        imageUrl: getImageUrl(topItem)
    }
}

async function fetchVgFeed(): Promise<string> {
    try {
        return await fetchText(VG_RSS_PROXY_URL)
    } catch (error) {
        console.warn("Could not fetch VG feed through local proxy.", error)
        return fetchText(VG_RSS_FEED_URL)
    }
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error("Could not fetch VG feed")
    }

    return response.text()
}

function getRequiredText(item: Element, selector: string): string {
    const text = getText(item, selector)

    if (!text) {
        throw new Error(`VG article is missing ${selector}`)
    }

    return text
}

function getText(item: Element, selector: string): string {
    return item.querySelector(selector)?.textContent?.trim() ?? ""
}

function getImageUrl(item: Element): string {
    return (
        getText(item, "image") ||
        getText(item, "imgRegular") ||
        item.getElementsByTagName("vg:img")[0]?.textContent?.trim() ||
        item.querySelector("enclosure")?.getAttribute("url") ||
        ""
    )
}
