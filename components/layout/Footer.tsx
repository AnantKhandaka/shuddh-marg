"use client"

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

function withLocale(path: string, locale: string) {
	if (path === '/') {
		return `/${locale}`
	}
	return `/${locale}${path}`
}

export default function Footer() {
	const t = useTranslations('nav')
	const ft = useTranslations('footer')
	const locale = useLocale()

	return (
		<footer className="bg-orange-800 text-orange-100">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<Link href={withLocale('/', locale)} className="text-xl font-bold text-white">
						Shuddhmarg
					</Link>

					<div className="flex flex-wrap gap-4 text-sm">
						<Link href={withLocale('/', locale)} className="hover:text-white">
							{t('home')}
						</Link>
						<Link href={withLocale('/companies', locale)} className="hover:text-white">
							{t('companies')}
						</Link>
						<Link href={withLocale('/products', locale)} className="hover:text-white">
							{t('products')}
						</Link>
						<Link href={withLocale('/map', locale)} className="hover:text-white">
							{t('map')}
						</Link>
						<Link href={withLocale('/submit', locale)} className="hover:text-white">
							{t('submit')}
						</Link>
					</div>
				</div>

				<p className="text-sm text-orange-200">{ft('tagline')}</p>

				<p className="text-xs text-orange-200">{ft('copyright')}</p>
			</div>
		</footer>
	)
}
