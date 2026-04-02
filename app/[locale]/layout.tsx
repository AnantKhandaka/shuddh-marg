import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import QueryProvider from '@/components/providers/QueryProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShuddhBharat — Discover Pure Dharmic Products',
  description: 'Find halal-certified brands and discover pure dharmic alternatives for every Hindu, Sikh, and Jain.',
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryProvider>
        <div className="flex min-h-screen flex-col" suppressHydrationWarning>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </QueryProvider>
    </NextIntlClientProvider>
  )
}