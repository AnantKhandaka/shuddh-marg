import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AlternativeCard from '@/components/alternative/AlternativeCard'
import Badge from '@/components/ui/Badge'
import { getAlternativesByProduct, getProductBySlug } from '@/lib/queries'
import { getTranslations } from 'next-intl/server'

type Props = {
	params: Promise<{ locale: string; slug: string }>
}

function withLocale(path: string, locale: string) {
	if (path === '/') return `/${locale}`
	return `/${locale}${path}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, slug } = await params
	const t = await getTranslations({ locale, namespace: 'meta' })
	try {
		const product = await getProductBySlug(slug)
		return {
			title: t('product_detail_title', { name: product.name }),
			description: product.description ?? t('product_detail_description', { name: product.name }),
		}
	} catch {
		return {
			title: t('product_not_found_title'),
			description: t('product_not_found_description'),
		}
	}
}

export default async function ProductDetailPage({ params }: Props) {
	const { locale, slug } = await params
	const t = await getTranslations({ locale, namespace: 'pages' })
	const product = await getProductBySlug(slug).catch(() => null)
	if (!product) {
		notFound()
	}

	const alternatives = await getAlternativesByProduct(product.id).catch(() => [])

	return (
		<main className="bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-4 text-sm text-slate-600">
					<Link href={withLocale('/', locale)} className="hover:text-orange-700">
						{t('home')}
					</Link>{' '}
					&gt;{' '}
					<Link href={withLocale('/products', locale)} className="hover:text-orange-700">
						{t('products')}
					</Link>{' '}
					&gt; <span className="text-orange-700">{product.name}</span>
				</div>

				<section className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
					<div className="grid grid-cols-1 gap-5 md:grid-cols-[280px_1fr]">
						{product.image_url ? (
							<Image
								src={product.image_url}
								alt={product.name}
								width={560}
								height={560}
								className="h-72 w-full rounded-xl object-cover"
							/>
						) : (
							<div className="h-72 rounded-xl bg-slate-100" />
						)}

						<div className="space-y-3">
							<h1 className="text-2xl font-bold text-orange-800">{product.name}</h1>
							{product.description ? <p className="text-sm text-slate-600">{product.description}</p> : null}
							<p className="text-sm text-slate-600">
								<span className="font-medium text-slate-900">{t('category')}:</span> {product.category}
							</p>

							{product.companies ? (
								<p className="text-sm text-slate-600">
									<span className="font-medium text-slate-900">{t('company')}:</span>{' '}
									<Link
										href={withLocale(`/companies/${product.companies.slug}`, locale)}
										className="text-orange-700 underline"
									>
										{product.companies.name}
									</Link>
								</p>
							) : null}

							{product.halal_logo_visible ? <Badge variant="halal" /> : null}
						</div>
					</div>
				</section>

				<section className="mt-8">
					<h2 className="mb-4 text-xl font-bold text-orange-800">{t('dharmic_alternatives')}</h2>
					{alternatives.length ? (
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							{alternatives.map((alternative) => (
								<AlternativeCard key={alternative.id} alternative={alternative} />
							))}
						</div>
					) : (
						<div className="rounded-xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
							{t('no_alternatives')}
						</div>
					)}
				</section>
			</div>
		</main>
	)
}
