'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'

type MetaProduct = { id: string; name: string; slug: string }
type MetaCompany = { id: string; name: string; slug: string }

type AlternativeFormState = {
  product_id: string
  company_id: string
  name: string
  brand: string
  image_url: string
  buy_link: string
  description: string
  dharmic_hindu: boolean
  dharmic_sikh: boolean
  dharmic_jain: boolean
  is_vegetarian: boolean
  is_jhatka: boolean
  is_vegan: boolean
}

const initialState: AlternativeFormState = {
  product_id: '',
  company_id: '',
  name: '',
  brand: '',
  image_url: '',
  buy_link: '',
  description: '',
  dharmic_hindu: false,
  dharmic_sikh: false,
  dharmic_jain: false,
  is_vegetarian: true,
  is_jhatka: false,
  is_vegan: false,
}

export default function NewAlternativePage() {
  const router = useRouter()
  const [form, setForm] = useState<AlternativeFormState>(initialState)
  const [products, setProducts] = useState<MetaProduct[]>([])
  const [companies, setCompanies] = useState<MetaCompany[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadMeta = async () => {
      const [productsResponse, companiesResponse] = await Promise.all([
        fetch('/api/admin/meta?type=products', { cache: 'no-store' }),
        fetch('/api/admin/meta?type=companies', { cache: 'no-store' }),
      ])
      const productsPayload = await productsResponse.json()
      const companiesPayload = await companiesResponse.json()

      if (productsResponse.ok) setProducts(productsPayload.data ?? [])
      if (companiesResponse.ok) setCompanies(companiesPayload.data ?? [])
    }

    loadMeta()
  }, [])

  const setField = (key: keyof AlternativeFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
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

    setSaving(true)
    const dharmic_type = [
      form.dharmic_hindu ? 'hindu' : null,
      form.dharmic_sikh ? 'sikh' : null,
      form.dharmic_jain ? 'jain' : null,
    ].filter(Boolean)

    const response = await fetch('/api/admin/alternatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: form.product_id || null,
        company_id: form.company_id || null,
        name: form.name,
        brand: form.brand || null,
        image_url: form.image_url || null,
        buy_link: form.buy_link || null,
        description: form.description || null,
        dharmic_type,
        is_vegetarian: form.is_vegetarian,
        is_jhatka: form.is_jhatka,
        is_vegan: form.is_vegan,
      }),
    })
    const payload = await response.json()
    setSaving(false)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Failed to create alternative.' })
      return
    }

    router.push('/admin/alternatives')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name*</label>
          <input value={form.name} onChange={(event) => setField('name', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
          <input value={form.brand} onChange={(event) => setField('brand', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
          <select value={form.product_id} onChange={(event) => setField('product_id', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
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
          <select value={form.company_id} onChange={(event) => setField('company_id', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
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
          <input value={form.buy_link} onChange={(event) => setField('buy_link', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Upload Image</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-gray-700">Dharmic Type</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.dharmic_hindu} onChange={(event) => setField('dharmic_hindu', event.target.checked)} />
            Hindu
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.dharmic_sikh} onChange={(event) => setField('dharmic_sikh', event.target.checked)} />
            Sikh
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.dharmic_jain} onChange={(event) => setField('dharmic_jain', event.target.checked)} />
            Jain
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} className="h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_vegetarian} onChange={(event) => setField('is_vegetarian', event.target.checked)} />
          Vegetarian
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_jhatka} onChange={(event) => setField('is_jhatka', event.target.checked)} />
          Jhatka
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_vegan} onChange={(event) => setField('is_vegan', event.target.checked)} />
          Vegan
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving || uploading}>
          Save Alternative
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/alternatives')}>
          Cancel
        </Button>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} /> : null}
    </form>
  )
}
