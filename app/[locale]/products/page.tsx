import type { Metadata } from 'next'
import Link from 'next/link'
import ProductList from '@/components/product/ProductList'
import { getAllProducts } from '@/lib/queries'
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
		title: t('products_title'),
		description: t('products_description'),
	}
}

export default async function ProductsPage({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'pages' })
	const products = await getAllProducts()

	return (
		<main className="bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-4 text-sm text-slate-600">
					<Link href={withLocale('/', locale)} className="hover:text-orange-700">
						{t('home')}
					</Link>{' '}
					&gt; <span className="text-orange-700">{t('products')}</span>
				</div>

				<div className="mb-6">
					<h1 className="text-3xl font-bold text-orange-800">{t('halal_products_heading')}</h1>
					<p className="mt-1 text-sm text-slate-600">{t('listed_products', { count: products.length })}</p>
				</div>

				<ProductList />
			</div>
		</main>
	)
}
