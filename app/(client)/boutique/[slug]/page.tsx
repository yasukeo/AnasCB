import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getSimilarProducts } from '@/lib/actions/products';
import { formatPrix } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/client/product-card';
import { AddToCartForm } from '@/components/client/add-to-cart-form';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.category) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.id, product.category.id, 4);

  // Récupérer toutes les couleurs et tailles uniques
  const availableColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ nom: v.couleur, hex: v.couleur_hex })))
  ).map((str) => JSON.parse(str));

  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.taille))
  ).sort((a, b) => {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/boutique" className="hover:text-gray-900">
              Boutique
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/boutique?categorie=${product.category.slug}`}
              className="hover:text-gray-900"
            >
              {product.category.nom}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{product.nom}</span>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galerie d'Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
              <Image
                src={product.images[0] || '/images/placeholder.svg'}
                alt={product.nom}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-white rounded-lg overflow-hidden border cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Image
                      src={image}
                      alt={`${product.nom} - ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations Produit */}
          <div className="space-y-6">
            {/* En-tête */}
            <div className="space-y-2">
              <Badge variant="secondary">{product.category.nom}</Badge>
              <h1 className="text-3xl font-bold text-gray-900">{product.nom}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrix(product.prix)}
                </span>
                <span className="text-sm text-gray-500">TVA incluse</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Formulaire d'Ajout au Panier */}
            <AddToCartForm
              product={product}
              availableColors={availableColors}
              availableSizes={availableSizes}
            />

            {/* Informations de Livraison */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Livraison</h4>
                  <p className="text-sm text-gray-600">
                    35 DHS - Livraison dans toute la région de Rabat
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Paiement à la livraison</h4>
                  <p className="text-sm text-gray-600">
                    Payez en espèces lors de la réception
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Retour sous 7 jours</h4>
                  <p className="text-sm text-gray-600">
                    Échange ou remboursement possible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits Similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Produits Similaires</h2>
              <Link
                href={`/boutique?categorie=${product.category.slug}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
