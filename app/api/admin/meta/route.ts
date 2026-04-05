import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const admin = getSupabaseAdmin()

    if (type === 'categories') {
      const { data, error } = await admin.from('categories').select('*').order('name')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'companies') {
      const { data, error } = await admin.from('companies').select('id, name, slug').order('name')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'products') {
      const { data, error } = await admin.from('products').select('id, name, slug').order('name')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: 'Invalid type.' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load metadata.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
