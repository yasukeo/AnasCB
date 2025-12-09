import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Eye, CheckCircle, XCircle, Clock, Truck } from 'lucide-react'
import Link from 'next/link'

export default async function CommandesPage() {
  const supabase = await createClient()

  // Get all orders with user information
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        email
      )
    `)
    .order('created_at', { ascending: false })

  // Calculate stats
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    processing: orders?.filter(o => o.status === 'processing').length || 0,
    shipped: orders?.filter(o => o.status === 'shipped').length || 0,
    delivered: orders?.filter(o => o.status === 'delivered').length || 0,
    cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
  }

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
        <p className="text-muted-foreground mt-1">
          Gérez et suivez toutes les commandes de votre boutique
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {totalRevenue.toFixed(2)} DHS de revenus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing + stats.shipped}</div>
            <p className="text-xs text-muted-foreground">En traitement/livraison</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">{stats.cancelled} annulées</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Commandes</CardTitle>
          <CardDescription>
            Toutes les commandes triées par date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">#{order.order_number}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{order.users?.email || 'Client inconnu'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{order.total_amount} DHS</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {order.shipping_address_line1}, {order.shipping_city}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/commandes/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
    processing: { label: 'En traitement', variant: 'default' as const, icon: Package },
    shipped: { label: 'Expédiée', variant: 'default' as const, icon: Truck },
    delivered: { label: 'Livrée', variant: 'default' as const, icon: CheckCircle },
    cancelled: { label: 'Annulée', variant: 'destructive' as const, icon: XCircle },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
