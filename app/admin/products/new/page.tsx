import NewProductForm from '@/components/admin/forms/NewProductForm'
import { getSupabaseAdmin } from '@/lib/supabase'

type MetaCompany = { id: string; name: string; slug: string }
type MetaCategory = { id: number; name: string; slug: string; type: 'company' | 'product' | 'both' }

export default async function NewProductPage() {
  const admin = getSupabaseAdmin()

  const [companiesResponse, categoriesResponse] = await Promise.all([
    admin.from('companies').select('id, name, slug').order('name'),
    admin.from('categories').select('id, name, slug, type').order('name'),
  ])

  const companies = (companiesResponse.data ?? []) as MetaCompany[]
  const categories = ((categoriesResponse.data ?? []) as MetaCategory[]).filter(
    (item) => item.type === 'product' || item.type === 'both'
  )

  return <NewProductForm companies={companies} categories={categories} />
}
