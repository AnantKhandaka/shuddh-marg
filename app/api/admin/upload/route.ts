import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const allowedBuckets = new Set(['company-logos', 'product-images', 'alternative-images'])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bucket = formData.get('bucket')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    if (typeof bucket !== 'string' || !allowedBuckets.has(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${randomUUID()}.${ext}`
    const filePath = `admin/${fileName}`
    const bytes = await file.arrayBuffer()

    const { error } = await admin.storage
      .from(bucket)
      .upload(filePath, bytes, { contentType: file.type || 'application/octet-stream', upsert: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!baseUrl) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL.' }, { status: 500 })
    }

    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`
    return NextResponse.json({ publicUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
