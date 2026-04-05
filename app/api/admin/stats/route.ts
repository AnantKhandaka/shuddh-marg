import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const admin = getSupabaseAdmin()

    const [companies, products, alternatives, submissions] = await Promise.all([
      admin.from('companies').select('id', { count: 'exact', head: true }),
      admin.from('products').select('id', { count: 'exact', head: true }),
      admin.from('alternatives').select('id', { count: 'exact', head: true }),
      admin.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending' as never),
    ])

    const errors = [companies.error, products.error, alternatives.error, submissions.error].filter(Boolean)
    if (errors.length) {
      return NextResponse.json({ error: errors[0]?.message || 'Failed to load stats.' }, { status: 500 })
    }

    return NextResponse.json({
      totalCompanies: companies.count ?? 0,
      totalProducts: products.count ?? 0,
      totalAlternatives: alternatives.count ?? 0,
      pendingSubmissions: submissions.count ?? 0,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load stats.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
