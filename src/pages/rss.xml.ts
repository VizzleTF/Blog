import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE } from "@consts"

type Context = {
  site: string
}

export async function GET(context: Context) {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      const description = post.data.rss ?? post.data.summary
      const articleLink = `${context.site}blog/${post.slug}/`
      const fullDescription = `${description}\n\nЧитать статью: ${articleLink}`

      return {
        title: post.data.title,
        description: fullDescription,
        pubDate: post.data.date,
        link: `/blog/${post.slug}/`,
        categories: post.data.tags,
        author: SITE.AUTHOR,
      }
    }),
  })
}
