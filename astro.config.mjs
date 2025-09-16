import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://devops.vaka.work",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/')
    }),
    solidJs(),
    tailwind({ applyBaseStyles: false })
  ],
})