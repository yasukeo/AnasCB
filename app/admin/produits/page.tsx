import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProduitsPage() {
  const supabase = await createClient()

  // Get all products with categories
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        nom
      )
    `)
    .order('created_at', { ascending: false })

  // Calculate stats
  const activeProducts = products?.filter(p => p.is_active).length || 0
  const inactiveProducts = products?.filter(p => !p.is_active).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/produits/nouveau">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              Visibles en boutique
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveProducts}</div>
            <p className="text-xs text-muted-foreground">
              Masqués
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
          <CardDescription>
            Tous vos produits triés par date d&apos;ajout
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucun produit pour le moment</p>
              <Button asChild>
                <Link href="/admin/produits/nouveau">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name || 'Image du produit'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {!product.is_active && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2"
                      >
                        Inactif
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.categories?.nom || 'Sans catégorie'}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">{product.price} DHS</span>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.compare_at_price} DHS
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/produit/${product.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Link>
                      </Button>
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/produits/${product.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
