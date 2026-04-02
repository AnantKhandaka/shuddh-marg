export type Category = {
  id: number
  name: string
  slug: string
  type: 'company' | 'product' | 'both'
}

export type Company = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  halal_cert_body: string | null
  cert_number: string | null
  cert_document_url: string | null
  category: string
  country: string
  state: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  company_id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  barcode: string | null
  category: string
  halal_logo_visible: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Alternative = {
  id: string
  product_id: string | null
  company_id: string | null
  name: string
  brand: string | null
  image_url: string | null
  buy_link: string | null
  description: string | null
  dharmic_type: string[]
  is_vegetarian: boolean
  is_jhatka: boolean
  is_vegan: boolean
  created_at: string
  updated_at: string
}

export type Store = {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  lat: number | null
  lng: number | null
  has_dharmic_section: boolean
  google_maps_url: string | null
  is_verified: boolean
  submitted_by: string | null
  created_at: string
  updated_at: string
}

export type Submission = {
  id: string
  type: 'company' | 'product' | 'store' | 'alternative'
  payload: Record<string, unknown>
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string | null
  reviewed_by: string | null
  review_note: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      companies:    { Row: Company;     Insert: Omit<Company,    'id'|'created_at'|'updated_at'>; Update: Partial<Company> }
      products:     { Row: Product;     Insert: Omit<Product,    'id'|'created_at'|'updated_at'>; Update: Partial<Product> }
      alternatives: { Row: Alternative; Insert: Omit<Alternative,'id'|'created_at'|'updated_at'>; Update: Partial<Alternative> }
      stores:       { Row: Store;       Insert: Omit<Store,      'id'|'created_at'|'updated_at'>; Update: Partial<Store> }
      submissions:  { Row: Submission;  Insert: Omit<Submission, 'id'|'created_at'|'updated_at'>; Update: Partial<Submission> }
      categories:   { Row: Category;    Insert: Omit<Category,   'id'>;                           Update: Partial<Category> }
    }
  }
}