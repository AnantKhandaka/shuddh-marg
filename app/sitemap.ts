import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.shuddhmarg.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/en', '/hi', '/en/companies', '/hi/companies', '/en/products', '/hi/products', '/en/map', '/hi/map', '/en/submit', '/hi/submit']

  return routes.map((route, index) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'daily' : 'weekly',
    priority: index === 0 ? 1 : 0.8,
  }))
}
