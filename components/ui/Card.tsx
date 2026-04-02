import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement>

export default function Card({ children, className, onClick, ...props }: CardProps) {
	return (
		<div
			className={cn(
				'rounded-xl border border-orange-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
				onClick ? 'cursor-pointer' : '',
				className
			)}
			onClick={onClick}
			{...props}
		>
			{children}
		</div>
	)
}
