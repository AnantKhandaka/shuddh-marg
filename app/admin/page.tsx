'use client'

import { Building2, Inbox, Leaf, Package } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Stats = {
	totalCompanies: number
	totalProducts: number
	totalAlternatives: number
	pendingSubmissions: number
}

const initialStats: Stats = {
	totalCompanies: 0,
	totalProducts: 0,
	totalAlternatives: 0,
	pendingSubmissions: 0,
}

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<Stats>(initialStats)

	useEffect(() => {
		const load = async () => {
			const response = await fetch('/api/admin/stats')
			const payload = await response.json()
			if (!response.ok) return
			setStats(payload)
		}

		load()
	}, [])

	return (
		<div className="space-y-6">
			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					<div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-700">
						<Building2 className="h-5 w-5" />
					</div>
					<p className="text-3xl font-bold text-orange-700">{stats.totalCompanies}</p>
					<p className="text-sm text-gray-600">Total Companies</p>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					<div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-700">
						<Package className="h-5 w-5" />
					</div>
					<p className="text-3xl font-bold text-orange-700">{stats.totalProducts}</p>
					<p className="text-sm text-gray-600">Total Products</p>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					<div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-700">
						<Leaf className="h-5 w-5" />
					</div>
					<p className="text-3xl font-bold text-orange-700">{stats.totalAlternatives}</p>
					<p className="text-sm text-gray-600">Total Alternatives</p>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					<div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-700">
						<Inbox className="h-5 w-5" />
					</div>
					<p className="text-3xl font-bold text-orange-700">{stats.pendingSubmissions}</p>
					<p className="text-sm text-gray-600">Pending Submissions</p>
				</div>
			</section>

			<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
				<h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
				<div className="mt-4 flex flex-wrap gap-3">
					<Link href="/admin/companies/new" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
						Add Company
					</Link>
					<Link href="/admin/products/new" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
						Add Product
					</Link>
					<Link href="/admin/alternatives/new" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
						Add Alternative
					</Link>
				</div>
			</section>
		</div>
	)
}
