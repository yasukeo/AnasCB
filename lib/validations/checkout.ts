import { z } from 'zod'

// Schéma pour le formulaire de checkout
export const checkoutSchema = z.object({
  // Informations personnelles
  prenom: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom est trop long'),
    
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long'),
  
  email: z.string()
    .email('Email invalide')
    .toLowerCase(),
  
  telephone: z.string()
    .regex(
      /^(0|\+212)[5-7][0-9]{8}$/,
      'Numéro de téléphone marocain invalide (ex: 0612345678)'
    ),
  
  // Adresse de livraison
  adresse: z.string()
    .min(10, "L'adresse doit contenir au moins 10 caractères")
    .max(500, "L'adresse est trop longue"),
    
  adresse2: z.string()
    .max(500, "L'adresse complémentaire est trop longue")
    .optional(),
  
  ville: z.string()
    .min(2, 'Veuillez sélectionner une ville'),
  
  codePostal: z.string()
    .regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),
  
  notes: z.string()
    .max(500, 'Les notes sont trop longues')
    .optional(),
  
  // Code promo (optionnel)
  code_promo: z.string()
    .optional()
    .transform(val => val?.toUpperCase().trim()),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
