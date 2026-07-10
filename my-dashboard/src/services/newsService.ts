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
const RSS_CACHE_WINDOW_MS = 300000

type RssToJsonItem = {
    title?: string
    description?: string
    link?: string
    pubDate?: string
    thumbnail?: string
    enclosure?: {
        link?: string
    }
    categories?: string[]
}

type RssToJsonResponse = {
    status?: string
    items?: RssToJsonItem[]
}

export async function getTopVgArticle(): Promise<NewsArticle> {
    try {
        return await getTopVgArticleFromXml(VG_RSS_PROXY_URL)
    } catch (error) {
        console.warn("Could not fetch VG feed through local proxy.", error)
    }

    try {
        return await getTopVgArticleFromJson()
    } catch (error) {
        console.warn("Could not fetch VG feed through RSS JSON fallback.", error)
    }

    return getTopVgArticleFromXml(VG_RSS_FEED_URL)
}

async function getTopVgArticleFromXml(url: string): Promise<NewsArticle> {
    const feedXml = await fetchText(url)
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

async function getTopVgArticleFromJson(): Promise<NewsArticle> {
    const response = await fetch(getRssToJsonUrl(), {
        cache: "no-store"
    })

    if (!response.ok) {
        throw new Error("Could not fetch VG JSON feed")
    }

    const data = await response.json() as RssToJsonResponse
    const topItem = data.items?.[0]

    if (data.status !== "ok" || !topItem) {
        throw new Error("VG JSON feed does not contain articles")
    }

    return {
        title: getRequiredJsonText(topItem.title, "title"),
        description: decodeHtml(topItem.description ?? ""),
        link: getRequiredJsonText(topItem.link, "link"),
        category: topItem.categories?.[0] ?? "",
        publishedAt: topItem.pubDate ?? "",
        imageUrl: decodeHtml(topItem.enclosure?.link ?? topItem.thumbnail ?? "")
    }
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url, {
        cache: "no-store"
    })

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

function getRssToJsonUrl(): string {
    const freshnessKey = Math.floor(Date.now() / RSS_CACHE_WINDOW_MS)
    const freshFeedUrl = `${VG_RSS_FEED_URL}?fresh=${freshnessKey}`

    return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(freshFeedUrl)}`
}

function getRequiredJsonText(value: string | undefined, fieldName: string): string {
    const text = decodeHtml(value ?? "")

    if (!text) {
        throw new Error(`VG article is missing ${fieldName}`)
    }

    return text
}

function decodeHtml(value: string): string {
    const htmlDocument = new DOMParser().parseFromString(value, "text/html")

    return htmlDocument.documentElement.textContent?.trim() ?? value
}
