import { Database } from './database'

// Types de base depuis la DB
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// Type pour l'utilisateur avec des infos supplémentaires
export interface UserProfile extends User {
  // Ajouter d'autres champs si nécessaire
}

// Type pour l'adresse sauvegardée
export type SavedAddress = Database['public']['Tables']['saved_addresses']['Row']
export type SavedAddressInsert = Database['public']['Tables']['saved_addresses']['Insert']
export type SavedAddressUpdate = Database['public']['Tables']['saved_addresses']['Update']

// Rôles utilisateur
export type UserRole = 'CLIENT' | 'ADMIN'
