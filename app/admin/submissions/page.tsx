import SubmissionsClient from '@/components/admin/submissions/SubmissionsClient'
import { getSupabaseAdmin } from '@/lib/supabase'
import type { Submission } from '@/types/database'

export default async function AdminSubmissionsPage() {
	const admin = getSupabaseAdmin()
	const { data } = await admin
		.from('submissions')
		.select('*')
		.eq('status', 'pending' as never)
		.order('created_at', { ascending: false })

	return <SubmissionsClient initialSubmissions={(data ?? []) as Submission[]} />
}
