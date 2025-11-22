import { Database } from './database'

// Types de base depuis la DB
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

export type OrderStatusHistory = Database['public']['Tables']['order_status_history']['Row']
export type OrderStatusHistoryInsert = Database['public']['Tables']['order_status_history']['Insert']

// Statuts de commande
export type OrderStatus = 
  | 'en_attente' 
  | 'confirmee' 
  | 'en_preparation' 
  | 'en_livraison' 
  | 'livree' 
  | 'annulee'

// Type pour une commande avec ses items et historique
export interface OrderWithDetails extends Order {
  items: OrderItem[]
  status_history: OrderStatusHistory[]
}

// Type pour une commande dans la liste admin
export interface OrderListItem {
  id: string
  numero_commande: string
  client_nom: string
  client_telephone: string
  client_ville: string
  total: number
  statut: OrderStatus
  created_at: string
  items_count: number
}

// Type pour les informations client dans le formulaire checkout
export interface CheckoutFormData {
  // Informations personnelles
  nom: string
  email: string
  telephone: string
  
  // Adresse de livraison
  adresse: string
  ville: string
  code_postal?: string
  notes?: string
  
  // Code promo (optionnel)
  code_promo?: string
}

// Type pour le résumé de commande
export interface OrderSummary {
  sous_total: number
  frais_livraison: number
  reduction_promo: number
  code_promo_utilise?: string
  total: number
}

// Type pour les filtres de commandes (admin)
export interface OrderFilters {
  statut?: OrderStatus
  date_debut?: string
  date_fin?: string
  ville?: string
  search?: string // Recherche par nom, téléphone, numéro
}
