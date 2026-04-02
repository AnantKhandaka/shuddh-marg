'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type SearchBarProps = {
	value: string
	onChange: (value: string) => void
	onClear: () => void
	placeholder?: string
	className?: string
}

export default function SearchBar({
	value,
	onChange,
	onClear,
	placeholder,
	className,
}: SearchBarProps) {
	return (
		<div className={cn('relative w-full', className)}>
			<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
			<input
				type="text"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				className="h-11 w-full rounded-lg border border-orange-200 bg-white pl-9 pr-10 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-500"
			/>
			{value ? (
				<button
					type="button"
					aria-label="Clear search"
					onClick={onClear}
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-orange-500 transition-colors hover:bg-orange-100"
				>
					<X className="h-4 w-4" />
				</button>
			) : null}
		</div>
	)
}
