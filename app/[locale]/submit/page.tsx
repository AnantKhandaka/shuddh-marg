import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, PencilLine } from 'lucide-react'
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
		title: t('submit_title'),
		description: t('submit_description'),
	}
}

export default async function SubmitPage({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'submit_page' })
	const nav = await getTranslations({ locale, namespace: 'nav' })

	return (
		<main className="bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl rounded-xl border border-orange-100 bg-white p-8 shadow-sm">
				<PencilLine className="h-10 w-10 text-orange-600" />
				<h1 className="mt-4 text-2xl font-bold text-orange-800">{t('heading')}</h1>
				<p className="mt-3 text-sm leading-6 text-slate-600">{t('message')}</p>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Link
						href={withLocale('/companies', locale)}
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
					>
						{nav('companies')}
						<ArrowRight className="h-4 w-4" />
					</Link>
					<Link
						href={withLocale('/products', locale)}
						className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-600 px-4 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-50"
					>
						{nav('products')}
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</main>
	)
}
