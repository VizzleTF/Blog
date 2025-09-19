import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE } from "@consts"

type Context = {
  site: string
}

export async function GET(context: Context) {
	const posts = await getCollection("blog")
  const projects = await getCollection("projects")

  const items = [...posts, ...projects]

  items.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items: items.map((item) => {
      const baseDescription = item.collection === "blog" && item.data.rss 
        ? item.data.rss 
        : item.data.summary;
      
      const articleLink = item.collection === "blog"
        ? `${context.site}blog/${item.slug}/`
        : `${context.site}projects/${item.slug}/`;
      
      const fullDescription = item.collection === "blog" 
        ? `${baseDescription}\n\nЧитать статью: ${articleLink}`
        : baseDescription;

      return {
        title: item.data.title,
        description: fullDescription,
        pubDate: item.data.date,
        link: item.collection === "blog"
          ? `/blog/${item.slug}/`
          : `/projects/${item.slug}/`,
      };
    }),
  })
}
