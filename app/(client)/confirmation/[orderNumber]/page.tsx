import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminClient } from '@/lib/supabase/admin';
import { formatPrix, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';
import type { OrderItem } from '@/types/order';

interface ConfirmationPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const supabase = getAdminClient();

  // Récupérer la commande avec ses items
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        nom_produit,
        taille,
        couleur,
        prix_unitaire,
        quantite,
        sous_total
      )
    `)
    .eq('numero_commande', params.orderNumber)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* En-tête de confirmation */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h1>
            <p className="text-gray-600 text-lg">
              Merci pour votre commande. Un email de confirmation a été envoyé à{' '}
              <strong>{order.client_email}</strong>
            </p>
          </div>

          {/* Numéro de commande */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
              <p className="text-2xl font-bold text-gray-900">{order.numero_commande}</p>
              <p className="text-sm text-gray-500 mt-2">
                Commandé le {formatDate(order.created_at)}
              </p>
            </div>
          </Card>

          {/* Étapes suivantes */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Que va-t-il se passer maintenant ?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">1. Email de confirmation</h3>
                  <p className="text-sm text-gray-600">
                    Vous avez reçu un email avec tous les détails de votre commande
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2. Préparation</h3>
                  <p className="text-sm text-gray-600">
                    Nous préparons votre commande avec soin (1-2 jours ouvrables)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">3. Livraison</h3>
                  <p className="text-sm text-gray-600">
                    Votre colis sera livré sous 2-3 jours ouvrables
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Détails de la commande */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de la commande</h2>
            
            {/* Articles */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              {order.order_items.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.nom_produit}</p>
                    <p className="text-sm text-gray-600">
                      Taille: {item.taille} • Couleur: {item.couleur}
                    </p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantite}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrix(item.sous_total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrix(item.prix_unitaire)} / unité
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrix(order.sous_total)}</span>
              </div>
              {order.reduction_promo > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span>
                  <span>-{formatPrix(order.reduction_promo)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>{formatPrix(order.frais_livraison)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatPrix(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Informations de livraison */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Adresse de livraison</h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.client_nom}</p>
              <p>{order.client_adresse}</p>
              <p>
                {order.client_code_postal && `${order.client_code_postal} `}
                {order.client_ville}
              </p>
              <p className="mt-2">Tél: {order.client_telephone}</p>
              {order.client_notes && (
                <p className="mt-2 text-sm text-gray-500">Notes: {order.client_notes}</p>
              )}
            </div>
          </Card>

          {/* Paiement */}
          <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Paiement à la livraison</h3>
                <p className="text-sm text-gray-700">
                  Vous paierez <strong>{formatPrix(order.total)}</strong> en espèces lors de la
                  réception de votre colis. Pensez à préparer le montant exact.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="flex-1">
              <Link href="/boutique">Continuer mes achats</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>

          {/* Aide */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Besoin d&apos;aide ?{' '}
              <a href="mailto:contact@anascb.ma" className="text-blue-600 hover:underline">
                Contactez-nous
              </a>{' '}
              ou appelez le{' '}
              <a href="tel:+212600000000" className="text-blue-600 hover:underline">
                +212 6 00 00 00 00
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
