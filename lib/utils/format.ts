import { format, formatDistance, formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Formater un prix en DHS
 * @param prix - Prix à formater
 * @returns Prix formaté (ex: "249,00 DHS")
 */
export function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(prix) + ' DHS'
}

/**
 * Formater un prix simple sans devise
 * @param prix - Prix à formater
 * @returns Prix formaté (ex: "249,00")
 */
export function formatPrixSimple(prix: number): string {
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(prix)
}

/**
 * Formate une date en français
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd MMMM yyyy', { locale: fr })
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, "dd MMM yyyy 'à' HH:mm", { locale: fr })
}

/**
 * Formater une date en format court
 */
export function formatDateCourt(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd/MM/yyyy')
}

/**
 * Formater une date relative (il y a X temps)
 */
export function formatDateRelative(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistance(dateObj, new Date(), { 
    addSuffix: true, 
    locale: fr 
  })
}

/**
 * Formate un numéro de téléphone marocain
 */
export function formatTelephone(phone: string): string {
  // Enlève tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '')
  
  // Si le numéro commence par 212, on le retire (indicatif Maroc)
  const withoutCountryCode = cleaned.startsWith('212') 
    ? cleaned.slice(3) 
    : cleaned
  
  // Format: 06 12 34 56 78 (groupes de 2)
  if (withoutCountryCode.length === 10) {
    return withoutCountryCode.match(/.{1,2}/g)?.join(' ') || withoutCountryCode
  }
  
  // Format: 05 22 12 34 56 (téléphone fixe)
  if (withoutCountryCode.length === 9) {
    return withoutCountryCode.match(/.{1,2}/g)?.join(' ') || withoutCountryCode
  }
  
  return phone
}

/**
 * Formater un numéro de téléphone pour un lien tel:
 */
export function formatTelephoneLien(telephone: string): string {
  const cleaned = telephone.replace(/\D/g, '')
  
  // Si pas d'indicatif, ajouter +212
  if (cleaned.startsWith('0')) {
    return `+212${cleaned.slice(1)}`
  }
  
  if (cleaned.startsWith('212')) {
    return `+${cleaned}`
  }
  
  return `+212${cleaned}`
}

// Backward compatibility
export const formatPhone = formatTelephone

/**
 * Génère un slug à partir d'un texte
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Tronque un texte avec ellipse
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Formater un pourcentage
 */
export function formatPourcentage(pourcentage: number): string {
  return `${pourcentage} %`
}

/**
 * Formater un numéro de commande
 */
export function formatNumeroCommande(numero: string): string {
  return numero.toUpperCase()
}

/**
 * Calculer le montant de la réduction
 */
export function calculerReduction(sous_total: number, pourcentage: number): number {
  return (sous_total * pourcentage) / 100
}

/**
 * Calculer le total de la commande
 */
export function calculerTotal(
  sous_total: number, 
  frais_livraison: number, 
  reduction: number = 0
): number {
  return sous_total + frais_livraison - reduction
}
