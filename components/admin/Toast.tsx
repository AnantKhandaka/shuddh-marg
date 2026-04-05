'use client'

import { cn } from '@/lib/utils'

type ToastProps = {
  message: string
  type: 'success' | 'error'
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-[100] rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg',
        type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
      )}
    >
      {message}
    </div>
  )
}
