import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get product
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        nom
      )
    `)
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('nom')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/produits">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">
              Modifier les informations du produit
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune image</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p className="text-lg font-semibold">{product.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{product.description || 'Aucune description'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prix</p>
                <p className="text-lg font-semibold">{product.price} DHS</p>
              </div>

              {product.compare_at_price && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prix barré</p>
                  <p className="text-lg font-semibold line-through text-muted-foreground">
                    {product.compare_at_price} DHS
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
              <p className="text-sm">{product.categories?.nom || 'Sans catégorie'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="text-sm">
                {product.is_active ? (
                  <span className="text-green-600">✓ Actif</span>
                ) : (
                  <span className="text-muted-foreground">✗ Inactif</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <p className="text-sm font-mono text-xs">{product.slug}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href={`/produit/${product.slug}`} target="_blank">
              Voir sur la boutique
            </Link>
          </Button>
          <Button variant="default">
            Modifier (à venir)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
