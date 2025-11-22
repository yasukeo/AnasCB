import { Suspense } from 'react'
import { getProducts, getCategories } from '@/lib/actions/products'
import { ProductCard } from '@/components/client/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { ProductSortBy } from '@/types/product'

interface BoutiquePageProps {
  searchParams: {
    categorie?: string
    tri?: ProductSortBy
    search?: string
  }
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  // Récupérer les paramètres
  const categorySlug = searchParams.categorie
  const sortBy = (searchParams.tri || 'recent') as ProductSortBy
  const search = searchParams.search

  // Récupérer les produits et catégories
  const [products, categories] = await Promise.all([
    getProducts({ category_slug: categorySlug, search }, sortBy),
    getCategories(),
  ])

  // Trouver la catégorie actuelle
  const currentCategory = categories.find(c => c.slug === categorySlug)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {currentCategory ? currentCategory.nom : 'Toutes les collections'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} {products.length > 1 ? 'produits' : 'produit'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtres Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </h3>

                {/* Catégories */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Catégories</p>
                  <div className="space-y-1">
                    <Button
                      variant={!categorySlug ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      size="sm"
                      asChild
                    >
                      <a href="/boutique">Toutes</a>
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={categorySlug === category.slug ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        size="sm"
                        asChild
                      >
                        <a href={`/boutique?categorie=${category.slug}`}>
                          {category.nom}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Contenu principal */}
        <div className="flex-1">
          {/* Barre d'outils (Tri) */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Tri */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Trier par
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={`/boutique${categorySlug ? `?categorie=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                    Plus récent
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/boutique?tri=prix_asc${categorySlug ? `&categorie=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                    Prix croissant
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/boutique?tri=prix_desc${categorySlug ? `&categorie=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                    Prix décroissant
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/boutique?tri=nom_asc${categorySlug ? `&categorie=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                    Nom A-Z
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/boutique?tri=nom_desc${categorySlug ? `&categorie=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}>
                    Nom Z-A
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Grille de produits */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-lg font-medium text-muted-foreground">
                  Aucun produit trouvé
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Essayez de modifier vos filtres
                </p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href="/boutique">Voir tous les produits</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
