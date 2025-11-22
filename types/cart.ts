// Type pour un item dans le panier
export interface CartItem {
  // Informations produit
  product_id: string
  variant_id: string
  nom_produit: string
  slug: string
  image: string
  
  // Variante sélectionnée
  taille: string
  couleur: string
  couleur_hex?: string
  
  // Prix et quantité
  prix_unitaire: number
  quantite: number
  stock_disponible: number
}

// Type pour le panier complet
export interface Cart {
  items: CartItem[]
  total_items: number
  sous_total: number
}

// Type pour ajouter un item au panier
export interface AddToCartData {
  product_id: string
  variant_id: string
  nom_produit: string
  slug: string
  image: string
  taille: string
  couleur: string
  couleur_hex?: string
  prix_unitaire: number
  quantite: number
  stock_disponible: number
}

// Type pour mettre à jour la quantité
export interface UpdateCartItemQuantity {
  variant_id: string
  quantite: number
}
