import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPinned } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = {
	params: Promise<{ locale: string }>
}

function withLocale(path: string, locale: string) {
	if (path === '/') return `/${locale}`
	return `/${locale}${path}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'meta' })

	return {
		title: t('map_title'),
		description: t('map_description'),
	}
}

export default async function MapPage({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'map_page' })
	const nav = await getTranslations({ locale, namespace: 'nav' })

	return (
		<main className="bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl rounded-xl border border-orange-100 bg-white p-8 text-center shadow-sm">
				<MapPinned className="mx-auto h-12 w-12 text-orange-600" />
				<h1 className="mt-4 text-2xl font-bold text-orange-800">{t('heading')}</h1>
				<p className="mt-3 text-sm leading-6 text-slate-600">
					{t('message')}
				</p>

				<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
					<Link
						href={withLocale('/companies', locale)}
						className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
					>
						{nav('companies')}
					</Link>
					<Link
						href={withLocale('/products', locale)}
						className="inline-flex items-center justify-center rounded-lg border border-orange-600 px-4 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-50"
					>
						{nav('products')}
					</Link>
				</div>
			</div>
		</main>
	)
}
