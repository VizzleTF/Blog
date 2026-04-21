import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://onlyyaml.dev",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      serialize(item) {
        if (item.url.includes('/blog/')) {
          item.changefreq = 'weekly'
          item.priority = 0.9
        } else {
          item.changefreq = 'monthly'
          item.priority = 0.6
        }
        return item
      }
    }),
    solidJs(),
    tailwind({ applyBaseStyles: false })
  ],
})