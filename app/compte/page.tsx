import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, User, MapPin, LogOut } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'

export default async function ComptePage() {
  const user = await getUser()

  if (!user) {
    redirect('/connexion')
  }

  const supabase = await createClient()

  // Get user's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const orderCount = orders?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon Compte</h1>
            <p className="text-muted-foreground mt-1">Bienvenue, {user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Retour à la boutique</Link>
            </Button>
            <form action={logout}>
              <Button variant="ghost" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Commandes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
              <p className="text-xs text-muted-foreground">
                {orderCount === 0 ? 'Aucune commande' : 'Commande(s) passée(s)'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mon Profil</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{user.email}</div>
              <p className="text-xs text-muted-foreground">
                Rôle: {user.role}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Adresses</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Adresse(s) enregistrée(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mes Commandes</CardTitle>
              <CardDescription>
                Consultez l&apos;historique de vos commandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orderCount === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore passé de commande</p>
                  <Button asChild>
                    <Link href="/boutique">Découvrir nos produits</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Commande #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total_amount} DHS</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Modifier mon profil
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Gérer mes adresses
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Historique des commandes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
