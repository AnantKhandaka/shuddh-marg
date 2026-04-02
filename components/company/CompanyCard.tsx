'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { Company } from '@/types/database'

type CompanyCardProps = {
	company: Company
}

function withLocale(path: string, locale: string) {
	return `/${locale}${path}`
}

export default function CompanyCard({ company }: CompanyCardProps) {
	const t = useTranslations('common')
	const pagesT = useTranslations('pages')
	const locale = useLocale()
	const router = useRouter()

	return (
		<Card
			onClick={() => router.push(withLocale(`/companies/${company.slug}`, locale))}
			className="h-full"
		>
			<div className="flex items-start gap-3">
				{company.logo_url ? (
					<Image
						src={company.logo_url}
						alt={company.name}
						width={64}
						height={64}
						className="h-16 w-16 rounded-lg object-cover"
					/>
				) : (
					<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100 text-xl font-bold text-orange-700">
						{company.name.charAt(0).toUpperCase()}
					</div>
				)}

				<div className="min-w-0 flex-1">
					<h3 className="truncate text-base font-semibold text-orange-800">{company.name}</h3>
					<span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
						{company.category}
					</span>
					<p className="mt-2 text-xs text-slate-500">
						{company.state ? `${company.state}, ${company.country}` : company.country}
					</p>
					{company.halal_cert_body ? (
						<p className="mt-1 text-xs text-red-600">
							{pagesT('halal_by', { body: company.halal_cert_body })}
						</p>
					) : null}
					{company.is_verified ? <Badge variant="verified" className="mt-2" /> : null}
				</div>
			</div>
			<p className="mt-3 text-xs font-medium text-orange-700">{t('view_details')}</p>
		</Card>
	)
}
