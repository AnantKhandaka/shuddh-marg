import { supabase } from './supabase'

// Companies
export async function getAllCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_verified', true)
    .order('name')
  if (error) throw error
  return data
}

export async function getCompanyBySlug(slug: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getCompaniesByCategory(category: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_verified', true)
    .eq('category', category)
    .order('name')
  if (error) throw error
  return data
}

// Products
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, companies(name, slug, logo_url)')
    .eq('is_verified', true)
    .order('name')
  if (error) throw error
  return data
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, companies(name, slug, logo_url)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getProductsByCompany(companyId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_verified', true)
    .order('name')
  if (error) throw error
  return data
}

// Alternatives
export async function getAlternativesByProduct(productId: string) {
  const { data, error } = await supabase
    .from('alternatives')
    .select('*')
    .eq('product_id', productId)
    .order('name')
  if (error) throw error
  return data
}

// Search
export async function searchCompanies(query: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_verified', true)
    .textSearch('fts', query)
    .limit(20)
  if (error) throw error
  return data
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, companies(name, slug)')
    .eq('is_verified', true)
    .textSearch('fts', query)
    .limit(20)
  if (error) throw error
  return data
}

// Categories
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}