import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type BadgeVariant = 'halal' | 'verified' | 'dharmic' | 'vegetarian' | 'vegan' | 'jhatka'

type BadgeProps = {
	variant: BadgeVariant
	className?: string
}

const styles: Record<BadgeVariant, string> = {
	halal: 'bg-red-100 text-red-700',
	verified: 'bg-green-100 text-green-700',
	dharmic: 'bg-orange-100 text-orange-700',
	vegetarian: 'bg-green-100 text-green-700',
	vegan: 'bg-emerald-100 text-emerald-700',
	jhatka: 'bg-blue-100 text-blue-700',
}

export default function Badge({ variant, className }: BadgeProps) {
	const t = useTranslations('badges')

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium leading-none',
				styles[variant],
				className
			)}
		>
			{t(variant)}
		</span>
	)
}
