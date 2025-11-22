'use server'

import { createClient } from '@/lib/supabase/server'
import { ProductWithDetails, ProductFilters, ProductSortBy } from '@/types/product'

/**
 * Récupérer tous les produits avec filtres et tri
 */
export async function getProducts(
  filters?: ProductFilters,
  sortBy: ProductSortBy = 'recent'
) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .eq('est_actif', true)

  // Filtre par catégorie
  if (filters?.category_slug) {
    query = query.eq('category.slug', filters.category_slug)
  }

  // Filtre par recherche
  if (filters?.search) {
    query = query.ilike('nom', `%${filters.search}%`)
  }

  // Filtre par prix
  if (filters?.prix_min !== undefined) {
    query = query.gte('prix', filters.prix_min)
  }
  if (filters?.prix_max !== undefined) {
    query = query.lte('prix', filters.prix_max)
  }

  // Tri
  switch (sortBy) {
    case 'prix_asc':
      query = query.order('prix', { ascending: true })
      break
    case 'prix_desc':
      query = query.order('prix', { ascending: false })
      break
    case 'nom_asc':
      query = query.order('nom', { ascending: true })
      break
    case 'nom_desc':
      query = query.order('nom', { ascending: false })
      break
    case 'ancien':
      query = query.order('created_at', { ascending: true })
      break
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }

  return data as unknown as ProductWithDetails[]
}

/**
 * Récupérer un produit par son slug
 */
export async function getProductBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .eq('est_actif', true)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return null
  }

  return data as unknown as ProductWithDetails
}

/**
 * Récupérer les produits similaires (même catégorie)
 */
export async function getSimilarProducts(productId: string, categoryId: string, limit = 4) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*)
    `)
    .eq('category_id', categoryId)
    .eq('est_actif', true)
    .neq('id', productId)
    .limit(limit)

  if (error) {
    console.error('Erreur lors de la récupération des produits similaires:', error)
    return []
  }

  return data as unknown as ProductWithDetails[]
}

/**
 * Récupérer toutes les catégories
 */
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('ordre', { ascending: true })

  if (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }

  return data
}
