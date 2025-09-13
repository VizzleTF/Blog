import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Сказочный девопес",
  DESCRIPTION: "Сказочный девопес, блог о девопсе и его инструментах.",
  AUTHOR: "Ivan K",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Блог",
  DESCRIPTION: "Записи на темы, которые меня интересуют.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Проекты",
  DESCRIPTION: "Последние проекты, над которыми я работал.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Поиск",
  DESCRIPTION: "Поиск всех постов и проектов по ключевым словам.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Главная", 
    HREF: "/", 
  },
  { 
    TEXT: "Блог", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Проекты", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Telegram",
    ICON: "telegram",
    TEXT: "@gemini_commit",
    HREF: "https://t.me/gemini_commit",
  },
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "vizzletf@gmail.com",
    HREF: "mailto:vizzletf@gmail.com",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "vizzletf",
    HREF: "https://github.com/vizzletf"
  },
]

