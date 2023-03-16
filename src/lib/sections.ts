export const sections = {
  about: { url: "/", name: "About", enabled: true },
  weeknotes: { url: "/weeknotes", name: "Weeknotes", enabled: true },
  projects: { url: "/projects", name: "Projects", enabled: true },
  articles: { url: "/articles", name: "Articles", enabled: true },
}

export type Section = keyof typeof sections;
