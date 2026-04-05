'use client'

import { Menu, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const supportedLocales = ['en', 'hi'] as const

type NavItem = {
	key: 'home' | 'companies' | 'products' | 'map' | 'submit'
	href: '/' | '/companies' | '/products' | '/map' | '/submit'
}

const navItems: NavItem[] = [
	{ key: 'home', href: '/' },
	{ key: 'companies', href: '/companies' },
	{ key: 'products', href: '/products' },
	{ key: 'map', href: '/map' },
	{ key: 'submit', href: '/submit' },
]

function stripLocale(pathname: string) {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length === 0) return '/'

	if (supportedLocales.includes(segments[0] as (typeof supportedLocales)[number])) {
		const rest = segments.slice(1)
		return rest.length ? `/${rest.join('/')}` : '/'
	}

	return pathname
}

function withLocale(path: string, locale: string) {
	if (path === '/') {
		return `/${locale}`
	}
	return `/${locale}${path}`
}

export default function Navbar() {
	const t = useTranslations('nav')
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const [open, setOpen] = useState(false)

	const normalizedPathname = useMemo(() => stripLocale(pathname), [pathname])

	const handleLocaleSwitch = (nextLocale: 'en' | 'hi') => {
		const targetPath = withLocale(normalizedPathname, nextLocale)
		router.push(targetPath)
		setOpen(false)
	}

	return (
		<header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href={withLocale('/', locale)} className="text-xl font-bold text-orange-700">
					Shuddhmarg
				</Link>

				<ul className="hidden items-center gap-6 md:flex">
					{navItems.map((item) => {
						const active = normalizedPathname === item.href
						return (
							<li key={item.key}>
								<Link
									href={withLocale(item.href, locale)}
									className={cn(
										'border-b-2 pb-1 text-sm font-medium transition-colors',
										active
											? 'border-orange-700 text-orange-700'
											: 'border-transparent text-slate-600 hover:text-orange-700'
									)}
								>
									{t(item.key)}
								</Link>
							</li>
						)
					})}
				</ul>

				<div className="hidden items-center gap-2 md:flex">
					{supportedLocales.map((nextLocale) => (
						<button
							key={nextLocale}
							type="button"
							onClick={() => handleLocaleSwitch(nextLocale)}
							className={cn(
								'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
								locale === nextLocale
									? 'bg-orange-100 text-orange-700'
									: 'text-slate-500 hover:bg-orange-50 hover:text-orange-700'
							)}
						>
							{nextLocale.toUpperCase()}
						</button>
					))}
				</div>

				<button
					type="button"
					aria-label="Toggle menu"
					className="rounded-md p-2 text-orange-700 transition-colors hover:bg-orange-50 md:hidden"
					onClick={() => setOpen((prev) => !prev)}
				>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</nav>

			{open ? (
				<div className="border-t border-orange-100 bg-white px-4 py-3 md:hidden">
					<ul className="space-y-2">
						{navItems.map((item) => {
							const active = normalizedPathname === item.href
							return (
								<li key={item.key}>
									<Link
										href={withLocale(item.href, locale)}
										className={cn(
											'block rounded-md px-3 py-2 text-sm font-medium',
											active
												? 'bg-orange-100 text-orange-700'
												: 'text-slate-700 hover:bg-orange-50 hover:text-orange-700'
										)}
										onClick={() => setOpen(false)}
									>
										{t(item.key)}
									</Link>
								</li>
							)
						})}
					</ul>

					<div className="mt-3 flex items-center gap-2 border-t border-orange-100 pt-3">
						{supportedLocales.map((nextLocale) => (
							<button
								key={nextLocale}
								type="button"
								onClick={() => handleLocaleSwitch(nextLocale)}
								className={cn(
									'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
									locale === nextLocale
										? 'bg-orange-100 text-orange-700'
										: 'text-slate-500 hover:bg-orange-50 hover:text-orange-700'
								)}
							>
								{nextLocale.toUpperCase()}
							</button>
						))}
					</div>
				</div>
			) : null}
		</header>
	)
}
