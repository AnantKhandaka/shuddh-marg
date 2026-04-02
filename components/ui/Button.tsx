'use client'

import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant
	size?: ButtonSize
	loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-400',
	outline: 'border border-orange-600 text-orange-600 hover:bg-orange-50 disabled:border-orange-300 disabled:text-orange-300',
	ghost: 'text-orange-600 hover:bg-orange-100 disabled:text-orange-300',
}

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'h-9 px-3 text-sm',
	md: 'h-10 px-4 text-sm',
	lg: 'h-12 px-5 text-base',
}

export default function Button({
	variant = 'primary',
	size = 'md',
	loading = false,
	className,
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
				variantClasses[variant],
				sizeClasses[size],
				className
			)}
			disabled={disabled || loading}
			{...props}
		>
			{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
			{children}
		</button>
	)
}
