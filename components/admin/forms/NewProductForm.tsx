'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'

type MetaCompany = { id: string; name: string; slug: string }
type MetaCategory = { id: number; name: string; slug: string; type: 'company' | 'product' | 'both' }

type ProductFormState = {
  company_id: string
  name: string
  slug: string
  description: string
  image_url: string
  barcode: string
  category: string
  halal_logo_visible: boolean
  is_verified: boolean
}

const initialState: ProductFormState = {
  company_id: '',
  name: '',
  slug: '',
  description: '',
  image_url: '',
  barcode: '',
  category: '',
  halal_logo_visible: false,
  is_verified: true,
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type Props = {
  companies: MetaCompany[]
  categories: MetaCategory[]
}

export default function NewProductForm({ companies, categories }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormState>(initialState)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const setField = (key: keyof ProductFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setForm((prev) => ({ ...prev, name, slug: slugTouched ? prev.slug : toSlug(name) }))
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'product-images')

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

    setSaving(true)
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        description: form.description || null,
        image_url: form.image_url || null,
        barcode: form.barcode || null,
      }),
    })
    const payload = await response.json()
    setSaving(false)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Failed to create product.' })
      return
    }

    router.push('/admin/products')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name*</label>
          <input value={form.name} onChange={onNameChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Slug*</label>
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true)
              setField('slug', toSlug(event.target.value))
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Company*</label>
          <select
            value={form.company_id}
            onChange={(event) => setField('company_id', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select company</option>
            {companies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category*</label>
          <select
            value={form.category}
            onChange={(event) => setField('category', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Barcode</label>
          <input value={form.barcode} onChange={(event) => setField('barcode', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Upload Image</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} className="h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.halal_logo_visible}
            onChange={(event) => setField('halal_logo_visible', event.target.checked)}
          />
          Halal logo visible
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_verified} onChange={(event) => setField('is_verified', event.target.checked)} />
          Verified
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving || uploading}>
          Save Product
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} /> : null}
    </form>
  )
}
