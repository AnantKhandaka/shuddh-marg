'use client'

import { PackageSearch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/product/ProductCard'
import SearchBar from '@/components/ui/SearchBar'
import { getAllCategories, getAllProducts, searchProducts } from '@/lib/queries'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/types/database'

type ProductWithCompany = Product & {
	companies: {
		name: string
		slug: string
		logo_url: string | null
	} | null
}

type ProductListProps = {
	initialCategory?: string
}

export default function ProductList({ initialCategory = 'all' }: ProductListProps) {
	const t = useTranslations('common')
	const pagesT = useTranslations('pages')
	const homeT = useTranslations('home')
	const [activeCategory, setActiveCategory] = useState(initialCategory)
	const [searchTerm, setSearchTerm] = useState('')

	const { data: categories = [] } = useQuery({
		queryKey: ['categories', 'product'],
		queryFn: getAllCategories,
	})

	const { data: products = [], isLoading } = useQuery({
		queryKey: ['products', searchTerm],
		queryFn: async () => {
			const query = searchTerm.trim()
			if (query) {
				return searchProducts(query)
			}
			return getAllProducts()
		},
	})

	const productCategories = useMemo(
		() => categories.filter((category: Category) => category.type === 'product' || category.type === 'both'),
		[categories]
	)

	const filteredProducts = useMemo(() => {
		if (activeCategory === 'all') {
			return products as ProductWithCompany[]
		}
		return (products as ProductWithCompany[]).filter((product) => product.category === activeCategory)
	}, [products, activeCategory])

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => setActiveCategory('all')}
					className={cn(
						'rounded-full border px-3 py-1.5 text-sm transition-colors',
						activeCategory === 'all'
							? 'border-orange-600 bg-orange-600 text-white'
							: 'border-orange-200 bg-white text-orange-700 hover:bg-orange-50'
					)}
				>
					{pagesT('all')}
				</button>
				{productCategories.map((category: Category) => (
					<button
						key={category.id}
						type="button"
						onClick={() => setActiveCategory(category.slug)}
						className={cn(
							'rounded-full border px-3 py-1.5 text-sm transition-colors',
							activeCategory === category.slug
								? 'border-orange-600 bg-orange-600 text-white'
								: 'border-orange-200 bg-white text-orange-700 hover:bg-orange-50'
						)}
					>
						{category.name}
					</button>
				))}
			</div>

			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				onClear={() => setSearchTerm('')}
				placeholder={homeT('search_placeholder')}
			/>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 9 }).map((_, index) => (
						<div
							key={index}
							className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-200"
						/>
					))}
				</div>
			) : filteredProducts.length ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<div className="rounded-xl border border-orange-200 bg-orange-50 p-8 text-center">
					<PackageSearch className="mx-auto h-8 w-8 text-orange-300" />
					<p className="mt-3 text-sm font-medium text-orange-700">{t('no_results')}</p>
				</div>
			)}
		</div>
	)
}
