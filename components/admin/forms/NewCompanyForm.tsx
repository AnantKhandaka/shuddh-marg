'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import Toast from '@/components/admin/Toast'
import Button from '@/components/ui/Button'
import { slugify } from '@/lib/utils'

type CompanyFormState = {
  name: string
  slug: string
  description: string
  website_url: string
  halal_cert_body: string
  cert_number: string
  cert_document_url: string
  category: string
  country: string
  state: string
  is_verified: boolean
  logo_url: string
}

const initialState: CompanyFormState = {
  name: '',
  slug: '',
  description: '',
  website_url: '',
  halal_cert_body: '',
  cert_number: '',
  cert_document_url: '',
  category: '',
  country: 'India',
  state: '',
  is_verified: true,
  logo_url: '',
}

export default function NewCompanyForm() {
  const router = useRouter()
  const [form, setForm] = useState<CompanyFormState>(initialState)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const canSubmit = useMemo(() => form.name.trim() && form.slug.trim() && form.category.trim() && form.country.trim(), [form])

  const setField = (key: keyof CompanyFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
    }))
  }

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'company-logos')

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    const payload = await response.json()
    setUploading(false)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Logo upload failed.' })
      return
    }

    setField('logo_url', payload.publicUrl)
    setToast({ type: 'success', message: 'Logo uploaded.' })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    setSaving(true)
    const response = await fetch('/api/admin/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        description: form.description || null,
        website_url: form.website_url || null,
        halal_cert_body: form.halal_cert_body || null,
        cert_number: form.cert_number || null,
        cert_document_url: form.cert_document_url || null,
        state: form.state || null,
        logo_url: form.logo_url || null,
      }),
    })
    const payload = await response.json()
    setSaving(false)

    if (!response.ok) {
      setToast({ type: 'error', message: payload.error ?? 'Failed to create company.' })
      return
    }

    setToast({ type: 'success', message: 'Company created successfully.' })
    router.push('/admin/companies')
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
              setField('slug', slugify(event.target.value))
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category*</label>
          <input value={form.category} onChange={(event) => setField('category', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Country*</label>
          <input value={form.country} onChange={(event) => setField('country', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
          <input value={form.state} onChange={(event) => setField('state', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Website URL</label>
          <input value={form.website_url} onChange={(event) => setField('website_url', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Halal Cert Body</label>
          <input value={form.halal_cert_body} onChange={(event) => setField('halal_cert_body', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Certificate Number</label>
          <input value={form.cert_number} onChange={(event) => setField('cert_number', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} className="h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Certificate Document URL</label>
        <input value={form.cert_document_url} onChange={(event) => setField('cert_document_url', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Upload Logo</label>
          <input type="file" accept="image/*" onChange={uploadLogo} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          {form.logo_url ? <p className="mt-1 text-xs text-emerald-700">Logo uploaded</p> : null}
        </div>

        <label className="mt-7 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_verified} onChange={(event) => setField('is_verified', event.target.checked)} />
          Verified
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving || uploading} disabled={!canSubmit}>
          Save Company
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/companies')}>
          Cancel
        </Button>
      </div>

      {toast ? <Toast type={toast.type} message={toast.message} /> : null}
    </form>
  )
}
