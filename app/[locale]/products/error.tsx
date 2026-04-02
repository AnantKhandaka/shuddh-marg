'use client'

import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'

type Props = {
  error: Error
  reset: () => void
}

export default function ProductsError({ reset }: Props) {
  const t = useTranslations('error')

  return (
    <main className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
        <h2 className="mt-4 text-xl font-semibold text-slate-800">{t('title')}</h2>
        <p className="mt-2 text-sm text-slate-600">{t('description')}</p>
        <Button className="mt-5" onClick={reset}>
          {t('retry')}
        </Button>
      </div>
    </main>
  )
}
