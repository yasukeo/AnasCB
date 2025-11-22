import { z } from 'zod'

// Schéma pour créer/modifier un produit
export const productSchema = z.object({
  nom: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(200, 'Le nom est trop long'),
  
  slug: z.string()
    .min(3, 'Le slug doit contenir au moins 3 caractères')
    .max(200, 'Le slug est trop long')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
    ),
  
  description: z.string()
    .max(2000, 'La description est trop longue')
    .optional(),
  
  prix: z.number()
    .positive('Le prix doit être positif')
    .min(1, 'Le prix minimum est 1 DHS')
    .max(999999, 'Le prix est trop élevé'),
  
  category_id: z.string()
    .uuid('ID de catégorie invalide')
    .optional()
    .nullable(),
  
  images: z.array(z.string().url('URL d\'image invalide'))
    .min(1, 'Au moins une image est requise')
    .max(5, 'Maximum 5 images'),
  
  est_actif: z.boolean()
    .default(true),
})

// Schéma pour une variante de produit
export const productVariantSchema = z.object({
  product_id: z.string().uuid(),
  
  taille: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'], {
    errorMap: () => ({ message: 'Taille invalide' })
  }),
  
  couleur: z.string()
    .min(2, 'Le nom de la couleur doit contenir au moins 2 caractères')
    .max(50, 'Le nom de la couleur est trop long'),
  
  couleur_hex: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Code couleur hex invalide (ex: #FF0000)')
    .optional()
    .nullable(),
  
  stock: z.number()
    .int('Le stock doit être un nombre entier')
    .nonnegative('Le stock ne peut pas être négatif')
    .max(9999, 'Stock trop élevé'),
  
  sku: z.string()
    .max(100, 'Le SKU est trop long')
    .optional()
    .nullable(),
})

// Schéma pour créer un produit avec des variantes
export const productWithVariantsSchema = z.object({
  product: productSchema,
  variants: z.array(productVariantSchema)
    .min(1, 'Au moins une variante est requise'),
})

export type ProductFormValues = z.infer<typeof productSchema>
export type ProductVariantFormValues = z.infer<typeof productVariantSchema>
export type ProductWithVariantsFormValues = z.infer<typeof productWithVariantsSchema>
