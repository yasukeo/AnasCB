import { z } from 'zod'

// Schéma pour mettre à jour le statut d'une commande
export const updateOrderStatusSchema = z.object({
  order_id: z.string().uuid('ID de commande invalide'),
  
  nouveau_statut: z.enum([
    'en_attente',
    'confirmee',
    'en_preparation',
    'en_livraison',
    'livree',
    'annulee'
  ], {
    errorMap: () => ({ message: 'Statut invalide' })
  }),
  
  notes: z.string()
    .max(500, 'Les notes sont trop longues')
    .optional(),
  
  raison_annulation: z.string()
    .min(10, 'La raison d\'annulation doit contenir au moins 10 caractères')
    .max(500, 'La raison est trop longue')
    .optional(),
})
.refine(
  (data) => {
    // Si le statut est "annulee", la raison est requise
    if (data.nouveau_statut === 'annulee') {
      return !!data.raison_annulation
    }
    return true
  },
  {
    message: 'La raison d\'annulation est requise',
    path: ['raison_annulation'],
  }
)

// Schéma pour filtrer les commandes
export const orderFiltersSchema = z.object({
  statut: z.enum([
    'en_attente',
    'confirmee',
    'en_preparation',
    'en_livraison',
    'livree',
    'annulee'
  ]).optional(),
  
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional(),
  
  ville: z.string().optional(),
  
  search: z.string().optional(), // Recherche par nom, téléphone, numéro
})

export type UpdateOrderStatusValues = z.infer<typeof updateOrderStatusSchema>
export type OrderFiltersValues = z.infer<typeof orderFiltersSchema>
