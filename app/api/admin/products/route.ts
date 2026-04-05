import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

type AdminMutationClient = {
  from: (table: string) => {
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => {
        select: (columns: string) => {
          single: () => Promise<{ data: unknown; error: { message: string } | null }>
        }
      }
    }
  }
}

export async function GET() {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('products')
      .select('*, companies(name, slug)')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const admin = getSupabaseAdmin()
    const { data, error } = await admin.from('products').insert(payload).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string } & Record<string, unknown>
    const { id, ...updates } = body
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Product id is required.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin() as unknown as AdminMutationClient
    const { data, error } = await admin.from('products').update(updates).eq('id', id).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Product id is required.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const { error } = await admin.from('products').delete().eq('id', id as never)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
