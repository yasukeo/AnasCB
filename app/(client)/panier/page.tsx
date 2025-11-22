'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/hooks/use-cart';
import { formatPrix } from '@/lib/utils/format';
import { FRAIS_LIVRAISON } from '@/lib/utils/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';
import { useHasHydrated } from '@/lib/hooks/use-hydrated';

export default function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, sousTotal } = useCart();
  const hasHydrated = useHasHydrated();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [reduction, setReduction] = useState(0);

  const totalItemsCount = hasHydrated ? totalItems() : 0;
  const sousTotalValue = hasHydrated ? sousTotal() : 0;

  const handleQuantityChange = (variantId: string, newQuantity: number, stock: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      toast.error(`Stock maximum disponible : ${stock}`);
      return;
    }
    updateQuantity(variantId, newQuantity);
  };

  const handleRemoveItem = (variantId: string, nomProduit: string) => {
    removeItem(variantId);
    toast.success(`${nomProduit} supprimé du panier`);
  };

  const handleApplyPromo = () => {
    // Logique simple de code promo (à améliorer avec Supabase plus tard)
    const code = promoCode.toUpperCase().trim();
    
    if (code === 'WELCOME10') {
      setReduction(sousTotalValue * 0.1); // 10% de réduction
      setPromoApplied(true);
      toast.success('Code promo appliqué : -10%');
    } else if (code === 'FIRST20') {
      setReduction(sousTotalValue * 0.2); // 20% de réduction
      setPromoApplied(true);
      toast.success('Code promo appliqué : -20%');
    } else {
      toast.error('Code promo invalide');
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setReduction(0);
    toast.success('Code promo retiré');
  };

  const total = sousTotalValue - reduction + FRAIS_LIVRAISON;

  if (!hasHydrated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 animate-spin mx-auto" />
          <p className="text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Votre panier est vide</h1>
            <p className="text-gray-600">
              Découvrez notre collection et ajoutez des articles à votre panier
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/boutique">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continuer mes achats
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
              <p className="text-gray-600 mt-1">
                {totalItemsCount} article{totalItemsCount > 1 ? 's' : ''} dans votre panier
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/boutique">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuer mes achats
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.variant_id} className="p-4 sm:p-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/boutique/${item.slug}`}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.nom_produit}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Détails */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <Link
                          href={`/boutique/${item.slug}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {item.nom_produit}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span>Taille: {item.taille}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.couleur_hex }}
                            />
                            <span>{item.couleur}</span>
                          </div>
                        </div>
                        {item.stock_disponible <= 5 && (
                          <Badge variant="secondary" className="text-orange-600 text-xs">
                            Plus que {item.stock_disponible} en stock
                          </Badge>
                        )}
                      </div>

                      {/* Prix (desktop) */}
                      <div className="hidden sm:block text-right">
                        <div className="font-bold text-lg text-gray-900">
                          {formatPrix(item.prix_unitaire * item.quantite)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrix(item.prix_unitaire)} / unité
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Sélecteur de quantité */}
                      <div className="flex items-center border-2 border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.variant_id,
                              item.quantite - 1,
                              item.stock_disponible
                            )
                          }
                          disabled={item.quantite <= 1}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-[50px] text-center">
                          {item.quantite}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.variant_id,
                              item.quantite + 1,
                              item.stock_disponible
                            )
                          }
                          disabled={item.quantite >= item.stock_disponible}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Bouton Supprimer */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.variant_id, item.nom_produit)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>

                    {/* Prix (mobile) */}
                    <div className="sm:hidden mt-3 text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {formatPrix(item.prix_unitaire * item.quantite)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrix(item.prix_unitaire)} / unité
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Bouton Vider le panier */}
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                  clearCart();
                  toast.success('Panier vidé');
                }
              }}
              className="w-full sm:w-auto text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Code Promo */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Code Promo
                </h3>
                {!promoApplied ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Entrez votre code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                    <Button onClick={handleApplyPromo} className="w-full" variant="outline">
                      Appliquer
                    </Button>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Codes disponibles pour test :</p>
                      <p className="font-mono">WELCOME10 (-10%)</p>
                      <p className="font-mono">FIRST20 (-20%)</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">
                          {promoCode}
                        </Badge>
                        <span className="text-sm text-green-800 font-medium">
                          -{formatPrix(reduction)}
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Résumé */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Résumé de la commande</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total ({totalItemsCount} articles)</span>
                    <span className="font-medium">{formatPrix(sousTotalValue)}</span>
                  </div>
                  {reduction > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <span className="font-medium">-{formatPrix(reduction)}</span>
                    </div>
                  )}
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

                <Button asChild size="lg" className="w-full mt-6">
                  <Link href="/checkout">
                    Passer la commande
                  </Link>
                </Button>

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
    </div>
  );
}
