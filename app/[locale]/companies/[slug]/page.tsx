import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import Badge from '@/components/ui/Badge'
import { getProductsByCompany } from '@/lib/queries'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getTranslations } from 'next-intl/server'
import type { Company, Product } from '@/types/database'

type Props = {
	params: Promise<{ locale: string; slug: string }>
}

function withLocale(path: string, locale: string) {
	if (path === '/') return `/${locale}`
	return `/${locale}${path}`
}

function isCompany(value: unknown): value is Company {
	return (
		typeof value === 'object' &&
		value !== null &&
		'id' in value &&
		'name' in value &&
		'slug' in value
	)
}

async function getCompanyBySlugForDetail(slug: string): Promise<Company | null> {
	const admin = getSupabaseAdmin()
	const { data, error } = await admin
		.from('companies')
		.select('*')
		.filter('slug', 'eq', slug)
		.maybeSingle()

	if (error) {
		throw error
	}

	if (!isCompany(data)) {
		return null
	}

	return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, slug } = await params
	const t = await getTranslations({ locale, namespace: 'meta' })

	try {
		const company = await getCompanyBySlugForDetail(slug)
		if (!company) {
			return {
				title: t('company_not_found_title'),
				description: t('company_not_found_description'),
			}
		}
		return {
			title: t('company_detail_title', { name: company.name }),
			description: company.description ?? t('company_detail_description', { name: company.name }),
		}
	} catch {
		return {
			title: t('company_not_found_title'),
			description: t('company_not_found_description'),
		}
	}
}

export default async function CompanyDetailPage({ params }: Props) {
	const { locale, slug } = await params
	const t = await getTranslations({ locale, namespace: 'pages' })
	const company = await getCompanyBySlugForDetail(slug).catch(() => null)
	if (!company) {
		notFound()
	}

	const products = (await getProductsByCompany(company.id).catch(() => [])) as Product[]
	const productsWithCompany = products.map((product) => ({
		id: product.id,
		company_id: product.company_id,
		name: product.name,
		slug: product.slug,
		description: product.description,
		image_url: product.image_url,
		barcode: product.barcode,
		category: product.category,
		halal_logo_visible: product.halal_logo_visible,
		is_verified: product.is_verified,
		created_at: product.created_at,
		updated_at: product.updated_at,
		companies: {
			name: company.name,
			slug: company.slug,
			logo_url: company.logo_url,
		},
	}))

	return (
		<main className="bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-4 text-sm text-slate-600">
					<Link href={withLocale('/', locale)} className="hover:text-orange-700">
						{t('home')}
					</Link>{' '}
					&gt;{' '}
					<Link href={withLocale('/companies', locale)} className="hover:text-orange-700">
						{t('companies')}
					</Link>{' '}
					&gt; <span className="text-orange-700">{company.name}</span>
				</div>

				<section className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
						{company.logo_url ? (
							<Image
								src={company.logo_url}
								alt={company.name}
								width={96}
								height={96}
								className="h-24 w-24 rounded-xl object-cover"
							/>
						) : (
							<div className="flex h-24 w-24 items-center justify-center rounded-xl bg-orange-100 text-2xl font-bold text-orange-700">
								{company.name.charAt(0).toUpperCase()}
							</div>
						)}

						<div className="space-y-2">
							<h1 className="text-2xl font-bold text-orange-800">{company.name}</h1>
							{company.description ? <p className="text-sm text-slate-600">{company.description}</p> : null}
							<div className="flex flex-wrap gap-2">
								<Badge variant="halal" />
								{company.is_verified ? <Badge variant="verified" /> : null}
							</div>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
						<p>
							<span className="font-medium text-slate-900">{t('halal_cert_body')}:</span>{' '}
							{company.halal_cert_body ?? t('not_listed')}
						</p>
						<p>
							<span className="font-medium text-slate-900">{t('certificate_number')}:</span>{' '}
							{company.cert_number ?? t('not_listed')}
						</p>
						<p>
							<span className="font-medium text-slate-900">{t('website')}:</span>{' '}
							{company.website_url ? (
								<a
									href={company.website_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-orange-700 underline"
								>
									{company.website_url}
								</a>
							) : (
								t('not_listed')
							)}
						</p>
					</div>
				</section>

				<section className="mt-8">
					<h2 className="mb-4 text-xl font-bold text-orange-800">{t('products_by', { name: company.name })}</h2>
					{productsWithCompany.length ? (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{productsWithCompany.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					) : (
						<div className="rounded-xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
							{t('no_products_company')}
						</div>
					)}
				</section>
			</div>
		</main>
	)
}
