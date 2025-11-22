// Catégories de produits
export const CATEGORIES = [
  { id: 't-shirts', nom: 'T-shirts', slug: 't-shirts' },
  { id: 'pantalons', nom: 'Pantalons', slug: 'pantalons' },
  { id: 'robes', nom: 'Robes', slug: 'robes' },
  { id: 'vestes', nom: 'Vestes', slug: 'vestes' },
  { id: 'manteaux', nom: 'Manteaux', slug: 'manteaux' },
  { id: 'capuchons', nom: 'Capuchons', slug: 'capuchons' },
  { id: 'body', nom: 'Body', slug: 'body' },
  { id: 'shorts', nom: 'Shorts', slug: 'shorts' },
  { id: 'jupes', nom: 'Jupes', slug: 'jupes' },
] as const;

// Tailles disponibles
export const TAILLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

// Statuts de commande
export const STATUTS_COMMANDE = {
  EN_ATTENTE: 'en_attente',
  CONFIRMEE: 'confirmee',
  EN_PREPARATION: 'en_preparation',
  EN_LIVRAISON: 'en_livraison',
  LIVREE: 'livree',
  ANNULEE: 'annulee',
} as const;

// Labels des statuts en français
export const STATUT_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_preparation: 'En préparation',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
};

// Couleurs des badges de statut
export const STATUT_COLORS: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  en_preparation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  en_livraison: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  livree: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  annulee: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// Rôles utilisateur
export const ROLES = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
} as const;

// Frais de livraison (en DHS)
export const FRAIS_LIVRAISON = 35;

// Limite d'admins
export const MAX_ADMINS = 3;

// Villes du Maroc (principales)
export const VILLES_MAROC = [
  'Rabat',
  'Casablanca',
  'Fès',
  'Marrakech',
  'Tanger',
  'Salé',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Agadir',
  'Tétouan',
  'Temara',
  'Safi',
  'Mohammedia',
  'El Jadida',
  'Beni Mellal',
  'Nador',
  'Khouribga',
  'Taza',
  'Settat',
] as const;
