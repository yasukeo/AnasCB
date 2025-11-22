'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/use-cart';
import { toast } from '@/lib/hooks/use-toast';
import { ProductWithDetails } from '@/types/product';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface AddToCartFormProps {
  product: ProductWithDetails;
  availableColors: Array<{ nom: string; hex: string }>;
  availableSizes: string[];
}

export function AddToCartForm({
  product,
  availableColors,
  availableSizes,
}: AddToCartFormProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors[0]?.nom || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  // Trouver la variante sélectionnée
  const selectedVariant = product.variants.find(
    (v) => v.couleur === selectedColor && v.taille === selectedSize
  );

  // Vérifier la disponibilité
  const isAvailable = selectedVariant && selectedVariant.stock > 0;
  const maxQuantity = selectedVariant?.stock || 0;

  // Filtrer les tailles disponibles pour la couleur sélectionnée
  const sizesForColor = selectedColor
    ? Array.from(
        new Set(
          product.variants
            .filter((v) => v.couleur === selectedColor && v.stock > 0)
            .map((v) => v.taille)
        )
      ).sort((a, b) => {
        const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        return order.indexOf(a) - order.indexOf(b);
      })
    : availableSizes;

  // Filtrer les couleurs disponibles pour la taille sélectionnée
  const colorsForSize = selectedSize
    ? Array.from(
        new Set(
          product.variants
            .filter((v) => v.taille === selectedSize && v.stock > 0)
            .map((v) => JSON.stringify({ nom: v.couleur, hex: v.couleur_hex }))
        )
      ).map((str) => JSON.parse(str))
    : availableColors;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Vérifier si la taille actuelle est disponible pour cette couleur
    const variant = product.variants.find(
      (v) => v.couleur === color && v.taille === selectedSize && v.stock > 0
    );
    if (!variant && sizesForColor.length > 0) {
      // Sélectionner la première taille disponible pour cette couleur
      const firstAvailableSize = sizesForColor[0];
      setSelectedSize(firstAvailableSize);
    }
    setQuantity(1);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    // Vérifier si la couleur actuelle est disponible pour cette taille
    const variant = product.variants.find(
      (v) => v.taille === size && v.couleur === selectedColor && v.stock > 0
    );
    if (!variant && colorsForSize.length > 0) {
      // Sélectionner la première couleur disponible pour cette taille
      const firstAvailableColor = colorsForSize[0];
      setSelectedColor(firstAvailableColor.nom);
    }
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) {
      toast.error('Veuillez sélectionner une taille et une couleur disponibles.');
      return;
    }

    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      nom_produit: product.nom,
      slug: product.slug,
      taille: selectedVariant.taille,
      couleur: selectedVariant.couleur,
      couleur_hex: selectedVariant.couleur_hex || undefined,
      prix_unitaire: product.prix,
      quantite: quantity,
      stock_disponible: selectedVariant.stock,
      image: product.images[0] || '/images/placeholder.svg',
    });

    toast.success(
      `${product.nom} (${selectedVariant.taille}, ${selectedVariant.couleur}) x${quantity} ajouté au panier`
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/panier');
  };

  return (
    <div className="space-y-6">
      {/* Sélection de la Couleur */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-900">
            Couleur: <span className="font-normal text-gray-600">{selectedColor}</span>
          </label>
          <span className="text-sm text-gray-500">
            {colorsForSize.length} couleur{colorsForSize.length > 1 ? 's' : ''} disponible
            {colorsForSize.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {colorsForSize.map((color) => {
            const isSelected = selectedColor === color.nom;
            const isAvailableColor = product.variants.some(
              (v) =>
                v.couleur === color.nom &&
                v.taille === selectedSize &&
                v.stock > 0
            );

            return (
              <button
                key={color.nom}
                onClick={() => handleColorChange(color.nom)}
                disabled={!isAvailableColor}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isAvailableColor && 'opacity-50 cursor-not-allowed'}`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium">{color.nom}</span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sélection de la Taille */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-900">
            Taille: <span className="font-normal text-gray-600">{selectedSize}</span>
          </label>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Guide des tailles
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {availableSizes.map((size) => {
            const isSelected = selectedSize === size;
            const variant = product.variants.find(
              (v) => v.taille === size && v.couleur === selectedColor
            );
            const isAvailableSize = variant && variant.stock > 0;

            return (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                disabled={!isAvailableSize}
                className={`relative py-3 text-center font-medium rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isAvailableSize && 'opacity-30 cursor-not-allowed line-through'}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock & Quantité */}
      {isAvailable && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-900">Quantité</label>
            {maxQuantity <= 5 && (
              <Badge variant="secondary" className="text-orange-600">
                Plus que {maxQuantity} en stock
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 py-2 font-semibold min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {maxQuantity > 5 && (
              <span className="text-sm text-green-600 font-medium">En stock</span>
            )}
          </div>
        </div>
      )}

      {/* Message de rupture de stock */}
      {!isAvailable && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            Cette combinaison n'est pas disponible actuellement.
          </p>
        </div>
      )}

      {/* Boutons d'Action */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full h-12 text-base"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Ajouter au panier
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={!isAvailable}
          variant="outline"
          className="w-full h-12 text-base"
          size="lg"
        >
          Acheter maintenant
        </Button>
      </div>
    </div>
  );
}
