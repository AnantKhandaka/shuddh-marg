'use client'

import { AlertCircle, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CompanyCard from '@/components/company/CompanyCard'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import { getAllCompanies, getAllProducts, searchCompanies, searchProducts } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import type { Company, Product } from '@/types/database'

type ProductWithCompany = Product & {
  companies: {
    name: string
    slug: string
    logo_url: string | null
  } | null
}

type HomeSearchResults = {
  companies: Company[]
  products: ProductWithCompany[]
}

function withLocale(path: string, locale: string) {
  if (path === '/') return `/${locale}`
  return `/${locale}${path}`
}

export default function HomePageClient() {
  const tHome = useTranslations('home')
  const tCommon = useTranslations('common')
  const tPages = useTranslations('pages')
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['home-companies'],
    queryFn: getAllCompanies,
  })

  const { data: products = [] } = useQuery<ProductWithCompany[]>({
    queryKey: ['home-products'],
    queryFn: async () => (await getAllProducts()) as ProductWithCompany[],
  })

  const { data: alternativesCount = 0 } = useQuery({
    queryKey: ['home-alternatives-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('alternatives')
        .select('id', { count: 'exact', head: true })

      if (error) throw error
      return count ?? 0
    },
  })

  const { data: searchResults } = useQuery<HomeSearchResults>({
    queryKey: ['home-search', searchTerm],
    queryFn: async () => {
      const query = searchTerm.trim()
      if (!query) {
        return { companies: [], products: [] }
      }
      const [companyResults, productResults] = await Promise.all([
        searchCompanies(query),
        searchProducts(query),
      ])
      return {
        companies: companyResults,
        products: productResults as ProductWithCompany[],
      }
    },
    enabled: searchTerm.trim().length > 0,
  })

  const resolvedSearchResults = searchResults ?? { companies: [], products: [] }

  const featuredCompanies = useMemo(() => companies.slice(0, 6), [companies])
  const featuredProducts = useMemo(() => (products as ProductWithCompany[]).slice(0, 6), [products])
  const hasSearchResults =
    resolvedSearchResults.companies.length > 0 || resolvedSearchResults.products.length > 0

  return (
    <main className="bg-orange-50">
      <section className="bg-linear-to-br from-orange-600 to-orange-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{tHome('hero_title')}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-orange-100 sm:text-base">{tHome('hero_subtitle')}</p>

          <div className="relative mx-auto mt-8 max-w-2xl">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder={tHome('search_placeholder')}
              className="text-left"
            />

            {searchTerm.trim() ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-lg border border-orange-200 bg-white p-3 text-left shadow-lg">
                {hasSearchResults ? (
                  <div className="space-y-2">
                    {resolvedSearchResults.companies.slice(0, 4).map((company) => (
                      <Link
                        key={company.id}
                        href={withLocale(`/companies/${company.slug}`, locale)}
                        className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-orange-50"
                      >
                        <span>{company.name}</span>
                        <span className="text-xs text-orange-700">{tPages('company')}</span>
                      </Link>
                    ))}
                    {resolvedSearchResults.products.slice(0, 4).map((product) => (
                      <Link
                        key={product.id}
                        href={withLocale(`/products/${product.slug}`, locale)}
                        className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-orange-50"
                      >
                        <span>{product.name}</span>
                        <span className="text-xs text-orange-700">{tPages('product')}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">{tCommon('no_results')}</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={withLocale('/companies', locale)}>
              <Button size="lg">{tHome('browse_companies')}</Button>
            </Link>
            <Link href={withLocale('/products', locale)}>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-orange-700">
                {tHome('browse_products')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-800">{companies.length}</p>
            <p className="mt-1 text-sm text-slate-600">{tPages('total_companies')}</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-800">{products.length}</p>
            <p className="mt-1 text-sm text-slate-600">{tPages('total_products')}</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-800">{alternativesCount}</p>
            <p className="mt-1 text-sm text-slate-600">{tPages('total_alternatives')}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-orange-800">{tPages('halal_companies_heading')}</h2>
            <Link href={withLocale('/companies', locale)} className="text-sm font-medium text-orange-700 hover:underline">
              {tPages('view_all_companies')}
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {featuredCompanies.map((company) => (
              <div key={company.id} className="min-w-70 shrink-0 lg:min-w-0">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-orange-800">{tPages('halal_products_heading')}</h2>
            <Link href={withLocale('/products', locale)} className="text-sm font-medium text-orange-700 hover:underline">
              {tPages('view_all_products')}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-100/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-orange-800">{tPages('how_it_works')}</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
              <Search className="mx-auto h-7 w-7 text-orange-700" />
              <p className="mt-3 text-sm font-medium text-slate-700">{tPages('step_search')}</p>
            </div>
            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
              <AlertCircle className="mx-auto h-7 w-7 text-orange-700" />
              <p className="mt-3 text-sm font-medium text-slate-700">{tPages('step_details')}</p>
            </div>
            <div className="rounded-xl bg-white p-5 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-7 w-7 text-orange-700" />
              <p className="mt-3 text-sm font-medium text-slate-700">{tPages('step_alternatives')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
