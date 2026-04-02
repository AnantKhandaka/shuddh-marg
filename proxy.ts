import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'hi'],
  defaultLocale: 'en',
  localePrefix: 'always'
})

export const config = {
  matcher: [
    '/((?!admin|api|_next|_vercel|.*\\..*).*)'
  ]
}