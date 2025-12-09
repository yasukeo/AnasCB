import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(id, nom, slug)')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Accueil</Link>
        <span>/</span>
        <Link href="/boutique" className="hover:text-foreground">Boutique</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link href={`/boutique?categorie=${product.categories.slug}`} className="hover:text-foreground">
              {product.categories.nom}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name || 'Image du produit'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Image non disponible</p>
              </div>
            )}
            {discountPercentage && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.categories && (
              <p className="text-sm text-muted-foreground">
                Catégorie: {product.categories.nom}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{product.price} DHS</span>
            {product.compare_at_price && (
              <span className="text-xl text-muted-foreground line-through">
                {product.compare_at_price} DHS
              </span>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Card className="p-6 space-y-4">
            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                En stock
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </div>
          </Card>

          <div className="border-t pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-medium">Gratuite à partir de 500 DHS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Retours</span>
              <span className="font-medium">14 jours pour changer d'avis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paiement</span>
              <span className="font-medium">Sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
