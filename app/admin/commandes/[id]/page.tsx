import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, MapPin, User, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { UpdateOrderStatus } from '@/components/admin/update-order-status'
import Image from 'next/image'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get order with user and items
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        email,
        nom_complet,
        telephone
      )
    `)
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  // Get order items
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      *,
      product_variants (
        *,
        products (
          name,
          images
        )
      )
    `)
    .eq('order_id', id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/commandes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Commande #{order.order_number}</h1>
            <p className="text-muted-foreground mt-1">
              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{order.users?.nom_complet || order.users?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{order.users?.email || order.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.users?.telephone || order.phone || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse de Livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{order.shipping_full_name}</p>
            <p>{order.shipping_address_line1}</p>
            {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
            <p>{order.shipping_city}, {order.shipping_postal_code}</p>
            <p className="text-muted-foreground">Téléphone: {order.shipping_phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Articles Commandés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {item.product_variants?.products?.images?.[0] && (
                  <div className="relative h-16 w-16 rounded border overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product_variants.products.images[0]}
                      alt={item.product_variants.products.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{item.product_variants?.products?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Taille: {item.product_variants?.size} • Couleur: {item.product_variants?.color}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantité: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.price_at_time} DHS</p>
                  <p className="text-sm text-muted-foreground">
                    Total: {(item.price_at_time * item.quantity).toFixed(2)} DHS
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{order.subtotal_amount.toFixed(2)} DHS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>{order.shipping_amount.toFixed(2)} DHS</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Réduction</span>
                <span>-{order.discount_amount.toFixed(2)} DHS</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>{order.total_amount.toFixed(2)} DHS</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Statut Actuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-sm text-muted-foreground">
              Mis à jour le {new Date(order.updated_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusLabels = {
    pending: 'En attente',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }

  return (
    <Badge variant={status === 'cancelled' ? 'destructive' : 'default'}>
      {statusLabels[status as keyof typeof statusLabels] || status}
    </Badge>
  )
}
