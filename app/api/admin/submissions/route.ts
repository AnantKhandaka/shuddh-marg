import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

type AdminSubmissionMutationClient = {
  from: (table: string) => {
    update: (values: { status: string; review_note: string | null }) => {
      eq: (column: string, value: string) => {
        select: (columns: string) => {
          single: () => Promise<{ data: unknown; error: { message: string } | null }>
        }
      }
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const admin = getSupabaseAdmin()

    let query = admin
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status as never)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch submissions.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string
      status?: 'pending' | 'approved' | 'rejected' | string
      review_note?: string | null
    }
    const { id, status, review_note } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Submission id is required.' }, { status: 400 })
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ error: 'Status is required.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin() as unknown as AdminSubmissionMutationClient
    const { data, error } = await admin
      .from('submissions')
      .update({ status, review_note: review_note ?? null })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update submission.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
