'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'
import type { Alternative } from '@/types/database'

type AlternativeWithRelations = Alternative & {
  products?: { name?: string | null } | null
  companies?: { name?: string | null } | null
}

export default function AdminAlternativesPage() {
  const [alternatives, setAlternatives] = useState<AlternativeWithRelations[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchAlternatives = async () => {
    const response = await fetch('/api/admin/alternatives', { cache: 'no-store' })
    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload.error ?? 'Failed to load alternatives.')
    }

    return (payload.data ?? []) as AlternativeWithRelations[]
  }

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchAlternatives()
        if (cancelled) return
        setAlternatives(data)
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Failed to load alternatives.'
        setToast({ type: 'error', message })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return alternatives
    return alternatives.filter((item) => item.name.toLowerCase().includes(term) || (item.brand ?? '').toLowerCase().includes(term))
  }, [alternatives, query])

  const deleteAlternative = async (id: string) => {
    if (!window.confirm('Delete this alternative?')) return

    const response = await fetch(`/api/admin/alternatives?id=${id}`, { method: 'DELETE' })
    const payload = await response.json()
    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Failed to delete alternative.' })
      return
    }

    setToast({ type: 'success', message: 'Alternative deleted.' })
    try {
      const data = await fetchAlternatives()
      setAlternatives(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load alternatives.'
      setToast({ type: 'error', message })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search alternatives..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 sm:max-w-sm"
        />

        <Link href="/admin/alternatives/new">
          <Button>Add Alternative</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-emerald-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Brand</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    No alternatives found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100/70'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">{item.brand ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{item.products?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{item.companies?.name ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/alternatives/${item.id}`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => deleteAlternative(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} /> : null}
    </div>
  )
}
