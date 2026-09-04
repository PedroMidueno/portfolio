import { Feed } from 'feed'
import { marked } from 'marked'

function stripFrontmatter(rawMarkdown: string): string {
  return rawMarkdown.replace(/^---[\s\S]*?---\s*/, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl

  const feed = new Feed({
    title: 'El blog de pemid.dev',
    description: 'Artículos sobre desarrollo web y más',
    id: siteUrl,
    link: siteUrl,
    language: 'es-MX',
    favicon: `${siteUrl}/favicon.png`,
    copyright: `pemid.dev • © ${new Date().getFullYear()}`,
    feedLinks: {
      atom: `${siteUrl}/rss.xml`
    },
    author: {
      name: 'Pedro Midueño',
      link: siteUrl
    }
  })

  const articles = await queryCollection(event, 'blog').order('pubDate', 'DESC').limit(10).all()

  for (const article of articles) {
    const url = `${siteUrl}${article.path}`

    const cleanMarkdown = article.rawbody ? stripFrontmatter(article.rawbody) : ''

    const htmlContent = cleanMarkdown ? await marked.parse(cleanMarkdown) : ''

    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.description,
      date: new Date(article.pubDate),
      category: article.categories.map(cat => ({ name: cat })),
      content: htmlContent
    })
  }

  let xml = feed.rss2()

  // This was added due to https://github.com/jpmonette/feed/issues/194
  if (!xml.includes('xmlns:atom')) {
    xml = xml.replace(
      '<rss ',
      '<rss xmlns:atom="http://www.w3.org/2005/Atom" '
    )
  }

  // This was added due to https://github.com/jpmonette/feed/issues/194
  if (!xml.includes('atom:link')) {
    xml = xml.replace(
      '<channel>',
      `<channel>\n<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`
    )
  }

  setHeader(event, 'content-type', 'text/xml; charset=utf-8')
  return xml
})
