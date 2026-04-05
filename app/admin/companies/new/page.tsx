import NewCompanyForm from '@/components/admin/forms/NewCompanyForm'
import { getSupabaseAdmin } from '@/lib/supabase'

export default async function NewCompanyPage() {
  const admin = getSupabaseAdmin()
  await admin.from('companies').select('id').limit(0)
  return <NewCompanyForm />
}
