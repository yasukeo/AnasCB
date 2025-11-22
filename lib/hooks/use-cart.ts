import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, AddToCartData } from '@/types/cart'

interface CartStore {
  items: CartItem[]
  
  // Actions
  addItem: (item: AddToCartData) => void
  removeItem: (variant_id: string) => void
  updateQuantity: (variant_id: string, quantite: number) => void
  clearCart: () => void
  
  // Computed values
  totalItems: () => number
  sousTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data: AddToCartData) => {
        const { items } = get()
        const existingItem = items.find(item => item.variant_id === data.variant_id)

        if (existingItem) {
          // Si l'item existe déjà, augmenter la quantité
          set({
            items: items.map(item =>
              item.variant_id === data.variant_id
                ? {
                    ...item,
                    quantite: Math.min(
                      item.quantite + data.quantite,
                      item.stock_disponible
                    ),
                  }
                : item
            ),
          })
        } else {
          // Sinon, ajouter le nouvel item
          set({ items: [...items, { ...data }] })
        }
      },

      removeItem: (variant_id: string) => {
        set({ items: get().items.filter(item => item.variant_id !== variant_id) })
      },

      updateQuantity: (variant_id: string, quantite: number) => {
        const { items } = get()
        const item = items.find(i => i.variant_id === variant_id)

        if (!item) return

        // Si quantité = 0, supprimer l'item
        if (quantite <= 0) {
          set({ items: items.filter(i => i.variant_id !== variant_id) })
          return
        }

        // Limiter la quantité au stock disponible
        const newQuantite = Math.min(quantite, item.stock_disponible)

        set({
          items: items.map(i =>
            i.variant_id === variant_id
              ? { ...i, quantite: newQuantite }
              : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantite, 0)
      },

      sousTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.prix_unitaire * item.quantite,
          0
        )
      },
    }),
    {
      name: 'anascb-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
