'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'
import type { Product } from '@/types/database'

type ProductWithCompany = Product & {
	companies?: { name?: string | null } | null
}

export default function AdminProductsPage() {
	const [products, setProducts] = useState<ProductWithCompany[]>([])
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(true)
	const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

	const fetchProducts = async () => {
		const response = await fetch('/api/admin/products', { cache: 'no-store' })
		const payload = await response.json()

		if (!response.ok) {
			throw new Error(payload.error ?? 'Failed to load products.')
		}

		return (payload.data ?? []) as ProductWithCompany[]
	}

	useEffect(() => {
		let cancelled = false

		const load = async () => {
			try {
				const data = await fetchProducts()
				if (cancelled) return
				setProducts(data)
			} catch (error) {
				if (cancelled) return
				const message = error instanceof Error ? error.message : 'Failed to load products.'
				setToast({ type: 'error', message })
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		void load()
		return () => {
			cancelled = true
		}
	}, [])

	const filtered = useMemo(() => {
		const term = query.trim().toLowerCase()
		if (!term) return products
		return products.filter((item) => item.name.toLowerCase().includes(term) || item.slug.toLowerCase().includes(term))
	}, [products, query])

	const deleteProduct = async (id: string) => {
		if (!window.confirm('Delete this product?')) return

		const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
		const payload = await response.json()
		if (!response.ok) {
			setToast({ type: 'error', message: payload.error ?? 'Failed to delete product.' })
			return
		}

		setToast({ type: 'success', message: 'Product deleted.' })
		try {
			const data = await fetchProducts()
			setProducts(data)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to load products.'
			setToast({ type: 'error', message })
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search products..."
					className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 sm:max-w-sm"
				/>

				<Link href="/admin/products/new">
					<Button>Add Product</Button>
				</Link>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-emerald-50 text-gray-700">
							<tr>
								<th className="px-4 py-3 font-semibold">Name</th>
								<th className="px-4 py-3 font-semibold">Company</th>
								<th className="px-4 py-3 font-semibold">Slug</th>
								<th className="px-4 py-3 font-semibold">Category</th>
								<th className="px-4 py-3 font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td className="px-4 py-4" colSpan={5}>
										Loading...
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td className="px-4 py-4" colSpan={5}>
										No products found.
									</td>
								</tr>
							) : (
								filtered.map((item, index) => (
									<tr key={item.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100/70'}>
										<td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
										<td className="px-4 py-3 text-gray-700">{item.companies?.name ?? '-'}</td>
										<td className="px-4 py-3 text-gray-700">{item.slug}</td>
										<td className="px-4 py-3 text-gray-700">{item.category}</td>
										<td className="px-4 py-3">
											<div className="flex gap-2">
												<Link href={`/admin/products/${item.id}`}>
													<Button size="sm" variant="outline">
														Edit
													</Button>
												</Link>
												<Button size="sm" variant="ghost" onClick={() => deleteProduct(item.id)}>
													Delete
												</Button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{toast ? <Toast type={toast.type} message={toast.message} /> : null}
		</div>
	)
}
