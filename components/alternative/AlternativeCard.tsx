import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { Alternative } from '@/types/database'

type AlternativeCardProps = {
	alternative: Alternative
}

export default function AlternativeCard({ alternative }: AlternativeCardProps) {
	const t = useTranslations('common')
	const pagesT = useTranslations('pages')

	return (
		<Card className="h-full">
			<div className="flex gap-3">
				{alternative.image_url ? (
					<Image
						src={alternative.image_url}
						alt={alternative.name}
						width={120}
						height={120}
						className="h-30 w-30 rounded-lg object-cover"
					/>
				) : (
					  <div className="flex h-30 w-30 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
						<ImageIcon className="h-6 w-6" />
					</div>
				)}

				<div className="min-w-0 flex-1 space-y-2">
					<h3 className="text-[15px] font-semibold text-orange-800">{alternative.name}</h3>
					{alternative.brand ? <p className="text-[13px] text-slate-500">{alternative.brand}</p> : null}
					{alternative.description ? (
						<p className="line-clamp-2 text-[13px] text-slate-600">{alternative.description}</p>
					) : null}
					<div className="flex flex-wrap gap-1.5">
						{alternative.dharmic_type.includes('hindu') ? (
							<span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[12px] font-medium text-orange-700">
								{pagesT('hindu')}
							</span>
						) : null}
						{alternative.dharmic_type.includes('sikh') ? (
							<span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[12px] font-medium text-orange-700">
								{pagesT('sikh')}
							</span>
						) : null}
						{alternative.dharmic_type.includes('jain') ? (
							<span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[12px] font-medium text-orange-700">
								{pagesT('jain')}
							</span>
						) : null}
						{alternative.is_vegetarian ? <Badge variant="vegetarian" /> : null}
						{alternative.is_vegan ? <Badge variant="vegan" /> : null}
						{alternative.is_jhatka ? <Badge variant="jhatka" /> : null}
					</div>
				</div>
			</div>

			<div className="mt-4">
				{alternative.buy_link ? (
					<a href={alternative.buy_link} target="_blank" rel="noopener noreferrer" className="block">
						<Button className="w-full">{t('buy_now')}</Button>
					</a>
				) : (
					<Button className="w-full" disabled>
						{pagesT('buy_link_soon')}
					</Button>
				)}
			</div>
		</Card>
	)
}
