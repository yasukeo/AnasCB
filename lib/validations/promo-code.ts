import { z } from 'zod'

// Schéma pour créer un code promo
export const promoCodeSchema = z.object({
  code: z.string()
    .min(3, 'Le code doit contenir au moins 3 caractères')
    .max(50, 'Le code est trop long')
    .regex(
      /^[A-Z0-9-_]+$/,
      'Le code doit contenir uniquement des lettres majuscules, chiffres, tirets et underscores'
    )
    .transform(val => val.toUpperCase().trim()),
  
  pourcentage: z.number()
    .int('Le pourcentage doit être un nombre entier')
    .min(1, 'Le pourcentage minimum est 1%')
    .max(100, 'Le pourcentage maximum est 100%'),
  
  date_debut: z.string()
    .datetime('Date de début invalide'),
  
  date_fin: z.string()
    .datetime('Date de fin invalide'),
  
  est_actif: z.boolean()
    .default(true),
})
.refine(
  (data) => new Date(data.date_fin) > new Date(data.date_debut),
  {
    message: 'La date de fin doit être après la date de début',
    path: ['date_fin'],
  }
)

// Schéma pour vérifier un code promo
export const verifyPromoCodeSchema = z.object({
  code: z.string()
    .min(1, 'Veuillez entrer un code promo')
    .transform(val => val.toUpperCase().trim()),
  
  sous_total: z.number()
    .positive('Le sous-total doit être positif'),
})

export type PromoCodeFormValues = z.infer<typeof promoCodeSchema>
export type VerifyPromoCodeValues = z.infer<typeof verifyPromoCodeSchema>
