import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ShoppingBag, Truck, RefreshCw, Shield } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils/constants'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Découvrez la mode qui vous{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ressemble
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Collection exclusive de vêtements féminins tendance. Qualité, élégance et style pour toutes les occasions.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/boutique">
                  Découvrir la collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Livraison rapide</h3>
                <p className="text-sm text-muted-foreground">
                  Livraison dans toutes les villes du Maroc
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Paiement sécurisé</h3>
                <p className="text-sm text-muted-foreground">
                  Paiement à la livraison (COD)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Échange facile</h3>
                <p className="text-sm text-muted-foreground">
                  Politique de retour sous 7 jours
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Qualité garantie</h3>
                <p className="text-sm text-muted-foreground">
                  Produits de haute qualité
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Parcourir par catégorie
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/boutique?categorie=${category.slug}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mb-4">
                      <ShoppingBag className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                      {category.nom}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/boutique">
                Voir toute la collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Prête à renouveler votre garde-robe ?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Découvrez nos dernières collections et trouvez votre style unique
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/boutique">
                Commencer vos achats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bannière Nouveautés */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold">
                    Nouveautés de la saison
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Ne manquez pas nos dernières arrivées. Des pièces uniques qui feront sensation.
                  </p>
                  <Button className="mt-6" asChild>
                    <Link href="/boutique?tri=recent">
                      Voir les nouveautés
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative aspect-square rounded-lg bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800/30 dark:to-pink-800/30">
                  {/* Placeholder pour image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-24 w-24 text-purple-600 dark:text-purple-400 opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
