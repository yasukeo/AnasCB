import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrix } from '@/lib/utils/format'
import { ProductWithDetails } from '@/types/product'

interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  // Vérifier si le produit est en stock
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
  const enStock = totalStock > 0

  // Image principale (première image ou placeholder)
  const imageUrl = product.images[0] || '/images/placeholder.png'

  return (
    <Link href={`/boutique/${product.slug}`} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={product.nom}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            
            {/* Badge stock */}
            {!enStock && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2"
              >
                Rupture de stock
              </Badge>
            )}
          </div>

          {/* Informations */}
          <div className="p-4 space-y-2">
            {/* Catégorie */}
            {product.category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.category.nom}
              </p>
            )}

            {/* Nom du produit */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.nom}
            </h3>

            {/* Prix */}
            <p className="text-lg font-bold">
              {formatPrix(product.prix)}
            </p>

            {/* Nombre de couleurs/tailles disponibles */}
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{product.variants.length} variante(s)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
