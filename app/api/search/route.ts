import { NextResponse } from 'next/server'
import { searchCompanies, searchProducts } from '@/lib/queries'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const q = searchParams.get('q')?.trim() ?? ''

		if (!q) {
			return NextResponse.json({ companies: [], products: [] })
		}

		const [companies, products] = await Promise.all([
			searchCompanies(q),
			searchProducts(q),
		])

		return NextResponse.json({ companies: companies ?? [], products: products ?? [] })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Search failed.'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
