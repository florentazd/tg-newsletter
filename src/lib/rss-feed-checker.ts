import Parser from "rss-parser"

/**
 * Prend en paramètres un lien et dit si oui ou non le lien fournit contient un flux RSS
 */
export default async function rssFeedChecker(httpLink: string) {
    try {
        const parser = new Parser()

        const feed = await parser.parseURL(httpLink)

        if (feed.title && feed.items.length > 0) {
            return true
        } else {
            return false
        }
    } catch {
        return false
    }
}
rssFeedChecker("https://google.com")