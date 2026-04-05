'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'
import type { Alternative } from '@/types/database'

type MetaProduct = { id: string; name: string; slug: string }
type MetaCompany = { id: string; name: string; slug: string }

export default function EditAlternativePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<Partial<Alternative> | null>(null)
  const [dharmicTypeRaw, setDharmicTypeRaw] = useState('')
  const [products, setProducts] = useState<MetaProduct[]>([])
  const [companies, setCompanies] = useState<MetaCompany[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const [alternativeResponse, productsResponse, companiesResponse] = await Promise.all([
        fetch('/api/admin/alternatives', { cache: 'no-store' }),
        fetch('/api/admin/meta?type=products', { cache: 'no-store' }),
        fetch('/api/admin/meta?type=companies', { cache: 'no-store' }),
      ])

      const alternativePayload = await alternativeResponse.json()
      const productsPayload = await productsResponse.json()
      const companiesPayload = await companiesResponse.json()

      if (!alternativeResponse.ok) {
        setToast({ type: 'error', message: alternativePayload.error ?? 'Failed to load alternative.' })
        return
      }

      const alternative = (alternativePayload.data ?? []).find((item: Alternative) => item.id === params.id)
      if (!alternative) {
        setToast({ type: 'error', message: 'Alternative not found.' })
        return
      }

      setForm(alternative)
      setDharmicTypeRaw((alternative.dharmic_type ?? []).join(', '))
      if (productsResponse.ok) setProducts(productsPayload.data ?? [])
      if (companiesResponse.ok) setCompanies(companiesPayload.data ?? [])
    }

    loadData()
  }, [params.id])

  const setField = (key: keyof Alternative, value: string | boolean | string[] | null) => {
    setForm((prev) => ({ ...(prev ?? {}), [key]: value }))
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'alternative-images')

    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const payload = await response.json()
    setUploading(false)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Image upload failed.' })
      return
    }

    setField('image_url', payload.publicUrl)
    setToast({ type: 'success', message: 'Image uploaded.' })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return

    setSaving(true)
    const response = await fetch('/api/admin/alternatives', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        dharmic_type: dharmicTypeRaw
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    })
    const payload = await response.json()
    setSaving(false)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Failed to update alternative.' })
      return
    }

    router.push('/admin/alternatives')
  }

  if (!form) {
    return <div className="rounded-xl border border-gray-200 bg-white p-6">Loading...</div>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name*</label>
          <input value={form.name ?? ''} onChange={(event) => setField('name', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
          <input value={form.brand ?? ''} onChange={(event) => setField('brand', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
          <select value={form.product_id ?? ''} onChange={(event) => setField('product_id', event.target.value || null)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select product</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
          <select value={form.company_id ?? ''} onChange={(event) => setField('company_id', event.target.value || null)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select company</option>
            {companies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Buy Link</label>
          <input value={form.buy_link ?? ''} onChange={(event) => setField('buy_link', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Upload Image</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Dharmic Type Tags (comma separated)</label>
        <input value={dharmicTypeRaw} onChange={(event) => setDharmicTypeRaw(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea value={form.description ?? ''} onChange={(event) => setField('description', event.target.value)} className="h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(form.is_vegetarian)}
            onChange={(event) => setField('is_vegetarian', event.target.checked)}
          />
          Vegetarian
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={Boolean(form.is_jhatka)} onChange={(event) => setField('is_jhatka', event.target.checked)} />
          Jhatka
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={Boolean(form.is_vegan)} onChange={(event) => setField('is_vegan', event.target.checked)} />
          Vegan
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving || uploading}>
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/alternatives')}>
          Cancel
        </Button>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} /> : null}
    </form>
  )
}
