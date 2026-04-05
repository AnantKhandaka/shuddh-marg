'use client'

import { useEffect, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'
import type { Submission } from '@/types/database'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

type Props = {
  initialSubmissions: Submission[]
}

export default function SubmissionsClient({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchSubmissions = async (nextFilter: StatusFilter) => {
    const response = await fetch(`/api/admin/submissions?status=${nextFilter}`, { cache: 'no-store' })
    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload.error ?? 'Failed to load submissions.')
    }

    return (payload.data ?? []) as Submission[]
  }

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchSubmissions(statusFilter)
        if (cancelled) return
        setSubmissions(data)
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Failed to load submissions.'
        setToast({ type: 'error', message })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [statusFilter])

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const note = window.prompt('Optional review note:') ?? ''
    setProcessingId(id)

    const response = await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, review_note: note.trim() || null }),
    })
    const payload = await response.json()
    setProcessingId(null)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Failed to update submission.' })
      return
    }

    setToast({ type: 'success', message: `Submission ${status}.` })
    try {
      const data = await fetchSubmissions(statusFilter)
      setSubmissions(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load submissions.'
      setToast({ type: 'error', message })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={
              statusFilter === filter
                ? 'rounded-full bg-orange-600 px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded-full bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700'
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-emerald-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted By</th>
                <th className="px-4 py-3 font-semibold">Created At</th>
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
              ) : submissions.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100/70'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.type}</td>
                    <td className="px-4 py-3 text-gray-700">{item.status}</td>
                    <td className="px-4 py-3 text-gray-700">{item.submitted_by ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          loading={processingId === item.id}
                          onClick={() => updateStatus(item.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={processingId === item.id}
                          onClick={() => updateStatus(item.id, 'rejected')}
                        >
                          Reject
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
