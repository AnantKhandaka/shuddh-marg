'use client'

import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Product } from '@/types/database'

type ProductWithCompany = Product & {
	companies: {
		name: string
		slug: string
		logo_url: string | null
	} | null
}

type ProductCardProps = {
	product: ProductWithCompany
}

function withLocale(path: string, locale: string) {
	return `/${locale}${path}`
}

export default function ProductCard({ product }: ProductCardProps) {
	const t = useTranslations('common')
	const locale = useLocale()
	const router = useRouter()

	return (
		<Card
			className="overflow-hidden p-0"
			onClick={() => router.push(withLocale(`/products/${product.slug}`, locale))}
		>
			{product.image_url ? (
				<Image
					src={product.image_url}
					alt={product.name}
					width={400}
					height={200}
					className="h-48 w-full rounded-t-xl object-cover"
				/>
			) : (
				<div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-400">
					<ImageIcon className="h-8 w-8" />
				</div>
			)}

			<div className="space-y-3 p-4">
				<h3 className="line-clamp-2 text-base font-semibold text-orange-800">{product.name}</h3>

				{product.companies ? (
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation()
							router.push(withLocale(`/companies/${product.companies!.slug}`, locale))
						}}
						className="text-left text-sm text-slate-600 underline-offset-2 hover:text-orange-700 hover:underline"
					>
						{product.companies.name}
					</button>
				) : null}

				<div className="flex flex-wrap items-center gap-2">
					<span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
						{product.category}
					</span>
					{product.halal_logo_visible ? <Badge variant="halal" /> : null}
				</div>

				<Button variant="outline" size="sm" className="w-full" onClick={(event) => event.stopPropagation()}>
					{t('alternatives')}
				</Button>
			</div>
		</Card>
	)
}
