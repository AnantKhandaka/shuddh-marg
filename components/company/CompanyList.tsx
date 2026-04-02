'use client'

import { Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CompanyCard from '@/components/company/CompanyCard'
import SearchBar from '@/components/ui/SearchBar'
import { getAllCategories, getAllCompanies, getCompaniesByCategory, searchCompanies } from '@/lib/queries'
import { cn } from '@/lib/utils'
import type { Category, Company } from '@/types/database'

type CompanyListProps = {
	initialCategory?: string
}

export default function CompanyList({ initialCategory = 'all' }: CompanyListProps) {
	const t = useTranslations('common')
	const pagesT = useTranslations('pages')
	const homeT = useTranslations('home')
	const [activeCategory, setActiveCategory] = useState(initialCategory)
	const [searchTerm, setSearchTerm] = useState('')

	const { data: categories = [] } = useQuery({
		queryKey: ['categories', 'company'],
		queryFn: getAllCategories,
	})

	const { data: companies = [], isLoading } = useQuery({
		queryKey: ['companies', activeCategory, searchTerm],
		queryFn: async () => {
			const query = searchTerm.trim()
			if (query) {
				return searchCompanies(query)
			}
			if (activeCategory !== 'all') {
				return getCompaniesByCategory(activeCategory)
			}
			return getAllCompanies()
		},
	})

	const companyCategories = useMemo(
		() => categories.filter((category: Category) => category.type === 'company' || category.type === 'both'),
		[categories]
	)

	const filteredCompanies = useMemo(() => {
		if (!searchTerm.trim() || activeCategory === 'all') {
			return companies as Company[]
		}

		return (companies as Company[]).filter((company) => company.category === activeCategory)
	}, [companies, searchTerm, activeCategory])

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

				{companyCategories.map((category: Category) => (
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
							className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-200"
						/>
					))}
				</div>
			) : filteredCompanies.length ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredCompanies.map((company) => (
						<CompanyCard key={company.id} company={company} />
					))}
				</div>
			) : (
				<div className="rounded-xl border border-orange-200 bg-orange-50 p-8 text-center">
					<Building2 className="mx-auto h-8 w-8 text-orange-300" />
					<p className="mt-3 text-sm font-medium text-orange-700">{t('no_results')}</p>
				</div>
			)}
		</div>
	)
}
