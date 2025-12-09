import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch real stats
  const [ordersResult, productsResult, usersResult] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status', { count: 'exact' }),
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }),
  ])

  const orders = ordersResult.data || []
  const totalOrders = ordersResult.count || 0
  const totalProducts = productsResult.count || 0
  const totalClients = usersResult.count || 0

  // Calculate revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d&apos;ensemble de votre boutique
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {orders.filter(o => o.status === 'pending').length} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} DHS</div>
            <p className="text-xs text-muted-foreground">
              Total des ventes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Comptes enregistrés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>
              Les 5 dernières commandes
            </CardDescription>
          </div>
          {recentOrders && recentOrders.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/commandes">Voir tout</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!recentOrders || recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Les commandes apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/commandes/${order.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">#{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.users?.email || 'Client inconnu'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total_amount.toFixed(2)} DHS</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
