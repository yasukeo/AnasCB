'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/hooks/use-cart';
import { formatPrix } from '@/lib/utils/format';
import { FRAIS_LIVRAISON, VILLES_MAROC } from '@/lib/utils/constants';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout';
import { createOrder } from '@/lib/actions/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, ShoppingBag, Lock } from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';
import { useHasHydrated } from '@/lib/hooks/use-hydrated';
import { ZodError } from 'zod';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, totalItems, sousTotal } = useCart();
  const hasHydrated = useHasHydrated();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalItemsCount = hasHydrated ? totalItems() : 0;
  const sousTotalValue = hasHydrated ? sousTotal() : 0;

  // Rediriger si le panier est vide
  useEffect(() => {
    if (!hasHydrated || isSubmitting) return;
    if (items.length === 0) {
      router.push('/panier');
    }
  }, [hasHydrated, items.length, router, isSubmitting]);

  const [formData, setFormData] = useState<CheckoutFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    adresse2: '',
    ville: '',
    codePostal: '',
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CheckoutFormData) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation côté client
      const validatedData = checkoutSchema.parse(formData);

      // Créer la commande
      const result = await createOrder({
        formData: validatedData,
        items,
        sousTotal: sousTotalValue,
        reduction: 0, // À implémenter avec le code promo
        fraisLivraison: FRAIS_LIVRAISON,
        total: sousTotalValue + FRAIS_LIVRAISON,
      });

      if (result.success) {
        // Vider le panier
        clearCart();
        
        // Rediriger vers la page de confirmation
        toast.success('Commande créée avec succès !');
        router.push(`/confirmation/${result.orderNumber}`);
      } else {
        toast.error(result.error || 'Erreur lors de la création de la commande');
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof ZodError) {
        const formErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const fieldKey = issue.path[0];
          if (typeof fieldKey === 'string') {
            formErrors[fieldKey] = issue.message;
          }
        });
        setErrors(formErrors);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
        return;
      }

      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 animate-spin" />
        <p className="text-gray-600">Chargement du checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 text-center px-4">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-600">Ajoutez des articles avant de passer au checkout.</p>
        </div>
        <Button asChild>
          <Link href="/boutique">Retourner à la boutique</Link>
        </Button>
      </div>
    );
  }

  const total = sousTotalValue + FRAIS_LIVRAISON;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
              <p className="text-gray-600 mt-1">
                Vérifiez vos informations et validez votre commande
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/panier">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au panier
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Votre prénom"
                      className={errors.prenom ? 'border-red-500' : ''}
                    />
                    {errors.prenom && (
                      <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nom">
                      Nom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className={errors.nom ? 'border-red-500' : ''}
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="exemple@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telephone">
                      Téléphone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="06 00 00 00 00"
                      className={errors.telephone ? 'border-red-500' : ''}
                    />
                    {errors.telephone && (
                      <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Adresse de livraison */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Adresse de livraison
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="adresse">
                      Adresse <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="adresse"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      placeholder="Numéro et nom de rue"
                      className={errors.adresse ? 'border-red-500' : ''}
                    />
                    {errors.adresse && (
                      <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="adresse2">
                      Complément d&apos;adresse <span className="text-gray-400">(optionnel)</span>
                    </Label>
                    <Input
                      id="adresse2"
                      name="adresse2"
                      value={formData.adresse2}
                      onChange={handleInputChange}
                      placeholder="Appartement, étage, bâtiment..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ville">
                        Ville <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="ville"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.ville ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Sélectionnez une ville</option>
                        {VILLES_MAROC.map((ville) => (
                          <option key={ville} value={ville}>
                            {ville}
                          </option>
                        ))}
                      </select>
                      {errors.ville && (
                        <p className="text-red-500 text-sm mt-1">{errors.ville}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="codePostal">
                        Code postal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="codePostal"
                        name="codePostal"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        placeholder="10000"
                        className={errors.codePostal ? 'border-red-500' : ''}
                      />
                      {errors.codePostal && (
                        <p className="text-red-500 text-sm mt-1">{errors.codePostal}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Notes de commande <span className="text-gray-400">(optionnel)</span>
                </h2>
                <div>
                  <Label htmlFor="notes">
                    Informations complémentaires
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Instructions de livraison, préférences, etc."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </Card>
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Articles */}
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Votre commande ({totalItemsCount} articles)
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.variant_id} className="flex gap-3 pb-3 border-b last:border-0">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.nom_produit}
                            fill
                            className="object-cover"
                          />
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {item.quantite}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.nom_produit}</p>
                          <p className="text-xs text-gray-600">
                            {item.taille} • {item.couleur}
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            {formatPrix(item.prix_unitaire * item.quantite)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Totaux */}
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-medium">{formatPrix(sousTotalValue)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span className="font-medium">{formatPrix(FRAIS_LIVRAISON)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrix(total)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Confirmer la commande
                      </>
                    )}
                  </Button>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      💰 Paiement à la livraison
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Vous paierez en espèces lors de la réception de votre colis
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span>Livraison sous 2-3 jours</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
