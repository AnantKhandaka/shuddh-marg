'use client'

import {
	Building2,
	Inbox,
	LayoutDashboard,
	Leaf,
	LogOut,
	Package,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Props = {
	children: ReactNode
}

const navItems = [
	{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
	{ label: 'Companies', href: '/admin/companies', icon: Building2 },
	{ label: 'Products', href: '/admin/products', icon: Package },
	{ label: 'Alternatives', href: '/admin/alternatives', icon: Leaf },
	{ label: 'Submissions', href: '/admin/submissions', icon: Inbox },
]

export default function AdminLayout({ children }: Props) {
	const pathname = usePathname()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [userEmail, setUserEmail] = useState('')

	const isLoginPage = pathname === '/admin/login'

	useEffect(() => {
		let isMounted = true

		const checkAuth = async () => {
			const { data } = await supabase.auth.getUser()

			if (!isMounted) return

			if (!data.user && !isLoginPage) {
				router.replace('/admin/login')
			} else {
				setUserEmail(data.user?.email ?? '')
				setLoading(false)
			}
		}

		checkAuth()

		return () => {
			isMounted = false
		}
	}, [isLoginPage, router])

	const pageTitle = useMemo(() => {
		if (pathname.startsWith('/admin/companies')) return 'Companies'
		if (pathname.startsWith('/admin/products')) return 'Products'
		if (pathname.startsWith('/admin/alternatives')) return 'Alternatives'
		if (pathname.startsWith('/admin/submissions')) return 'Submissions'
		return 'Dashboard'
	}, [pathname])

	const logout = async () => {
		await supabase.auth.signOut()
		router.replace('/admin/login')
	}

	if (isLoginPage) {
		return <>{children}</>
	}

	if (loading) {
		return <div className="min-h-screen bg-gray-50" />
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
				<div className="px-5 py-5 text-xl font-bold text-orange-800">ShuddhBharat Admin</div>

				<nav className="flex-1 space-y-1 px-3">
					{navItems.map((item) => {
						const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
						const Icon = item.icon
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100',
									active ? 'bg-orange-600 text-white hover:bg-orange-700' : ''
								)}
							>
								<Icon className="h-4 w-4" />
								{item.label}
							</Link>
						)
					})}
				</nav>

				<button
					type="button"
					onClick={logout}
					className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
				>
					<LogOut className="h-4 w-4" />
					Logout
				</button>
			</aside>

			<div className="ml-60 min-h-screen">
				<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
					<h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
					<p className="text-sm text-gray-600">{userEmail}</p>
				</header>
				<main className="p-6">{children}</main>
			</div>
		</div>
	)
}
