import { Database } from './database'

// Types de base depuis la DB
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

// Type pour un produit avec ses variantes et catégorie
export interface ProductWithDetails extends Product {
  category: Category | null
  variants: ProductVariant[]
}

// Type pour un produit dans une liste (optimisé)
export interface ProductListItem {
  id: string
  nom: string
  slug: string
  prix: number
  images: string[]
  category: {
    nom: string
    slug: string
  } | null
  // Première image pour l'affichage
  image_principale?: string
  // Indicateur de disponibilité
  en_stock: boolean
}

// Type pour les filtres de produits
export interface ProductFilters {
  category_slug?: string
  search?: string
  prix_min?: number
  prix_max?: number
  tailles?: string[]
  couleurs?: string[]
  en_stock_seulement?: boolean
}

// Type pour le tri
export type ProductSortBy = 
  | 'nom_asc' 
  | 'nom_desc' 
  | 'prix_asc' 
  | 'prix_desc' 
  | 'recent'
  | 'ancien'
