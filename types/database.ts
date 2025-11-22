// Types générés depuis le schéma Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nom_complet: string | null
          telephone: string | null
          role: 'CLIENT' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nom_complet?: string | null
          telephone?: string | null
          role?: 'CLIENT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nom_complet?: string | null
          telephone?: string | null
          role?: 'CLIENT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          nom: string
          slug: string
          description: string | null
          image_url: string | null
          ordre: number
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          slug: string
          description?: string | null
          image_url?: string | null
          ordre?: number
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          ordre?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          nom: string
          slug: string
          description: string | null
          prix: number
          category_id: string | null
          images: string[]
          est_actif: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          slug: string
          description?: string | null
          prix: number
          category_id?: string | null
          images?: string[]
          est_actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          slug?: string
          description?: string | null
          prix?: number
          category_id?: string | null
          images?: string[]
          est_actif?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          taille: string
          couleur: string
          couleur_hex: string | null
          stock: number
          sku: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          taille: string
          couleur: string
          couleur_hex?: string | null
          stock?: number
          sku?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          taille?: string
          couleur?: string
          couleur_hex?: string | null
          stock?: number
          sku?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          numero_commande: string
          user_id: string | null
          client_nom: string
          client_email: string
          client_telephone: string
          client_adresse: string
          client_ville: string
          client_code_postal: string | null
          client_notes: string | null
          sous_total: number
          frais_livraison: number
          reduction_promo: number
          code_promo_utilise: string | null
          total: number
          statut: 'en_attente' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee'
          raison_annulation: string | null
          created_at: string
          updated_at: string
          confirmee_at: string | null
          livree_at: string | null
        }
        Insert: {
          id?: string
          numero_commande?: string
          user_id?: string | null
          client_nom: string
          client_email: string
          client_telephone: string
          client_adresse: string
          client_ville: string
          client_code_postal?: string | null
          client_notes?: string | null
          sous_total: number
          frais_livraison?: number
          reduction_promo?: number
          code_promo_utilise?: string | null
          total: number
          statut?: 'en_attente' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee'
          raison_annulation?: string | null
          created_at?: string
          updated_at?: string
          confirmee_at?: string | null
          livree_at?: string | null
        }
        Update: {
          id?: string
          numero_commande?: string
          user_id?: string | null
          client_nom?: string
          client_email?: string
          client_telephone?: string
          client_adresse?: string
          client_ville?: string
          client_code_postal?: string | null
          client_notes?: string | null
          sous_total?: number
          frais_livraison?: number
          reduction_promo?: number
          code_promo_utilise?: string | null
          total?: number
          statut?: 'en_attente' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee'
          raison_annulation?: string | null
          created_at?: string
          updated_at?: string
          confirmee_at?: string | null
          livree_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string
          nom_produit: string
          taille: string
          couleur: string
          prix_unitaire: number
          quantite: number
          sous_total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id: string
          nom_produit: string
          taille: string
          couleur: string
          prix_unitaire: number
          quantite: number
          sous_total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string
          nom_produit?: string
          taille?: string
          couleur?: string
          prix_unitaire?: number
          quantite?: number
          sous_total?: number
          created_at?: string
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          ancien_statut: string | null
          nouveau_statut: string
          changed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          ancien_statut?: string | null
          nouveau_statut: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          ancien_statut?: string | null
          nouveau_statut?: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          pourcentage: number
          date_debut: string
          date_fin: string
          est_actif: boolean
          utilisation_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          pourcentage: number
          date_debut: string
          date_fin: string
          est_actif?: boolean
          utilisation_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          pourcentage?: number
          date_debut?: string
          date_fin?: string
          est_actif?: boolean
          utilisation_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      saved_addresses: {
        Row: {
          id: string
          user_id: string
          nom_adresse: string
          adresse: string
          ville: string
          code_postal: string | null
          telephone: string | null
          est_principale: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom_adresse: string
          adresse: string
          ville: string
          code_postal?: string | null
          telephone?: string | null
          est_principale?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom_adresse?: string
          adresse?: string
          ville?: string
          code_postal?: string | null
          telephone?: string | null
          est_principale?: boolean
          created_at?: string
        }
      }
    }
  }
}
