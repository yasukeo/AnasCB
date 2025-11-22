'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout';
import { CartItem } from '@/types/cart';
import type { Order } from '@/types/order';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CreateOrderParams {
  formData: CheckoutFormData;
  items: CartItem[];
  sousTotal: number;
  reduction: number;
  fraisLivraison: number;
  total: number;
  codePromo?: string;
}

export async function createOrder(params: CreateOrderParams) {
  try {
    // Validation
    const validatedData = checkoutSchema.parse(params.formData);

    const supabase = getAdminClient();

    // 1. Vérifier le stock de tous les produits
    for (const item of params.items) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('id', item.variant_id)
        .single();

      if (!variant || variant.stock < item.quantite) {
        return {
          success: false,
          error: `Stock insuffisant pour ${item.nom_produit}. Veuillez actualiser votre panier.`,
        };
      }
    }

    // 2. Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        // Informations client
        client_nom: `${validatedData.prenom} ${validatedData.nom}`.trim(),
        client_email: validatedData.email,
        client_telephone: validatedData.telephone,
        
        // Adresse de livraison
        client_adresse: validatedData.adresse2
          ? `${validatedData.adresse}, ${validatedData.adresse2}`
          : validatedData.adresse,
        client_ville: validatedData.ville,
        client_code_postal: validatedData.codePostal,
        
        // Notes
        client_notes: validatedData.notes || null,
        
        // Montants
        sous_total: params.sousTotal,
        frais_livraison: params.fraisLivraison,
        reduction_promo: params.reduction,
        total: params.total,
        
        // Code promo
        code_promo_utilise: params.codePromo || null,
        
        // Statut initial
        statut: 'en_attente',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Erreur création commande:', orderError);
      return {
        success: false,
        error: 'Erreur lors de la création de la commande. Veuillez réessayer.',
      };
    }

    // 3. Créer les items de commande et mettre à jour le stock
    for (const item of params.items) {
      // Créer l'item
      const { error: itemError } = await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        nom_produit: item.nom_produit,
        taille: item.taille,
        couleur: item.couleur,
        prix_unitaire: item.prix_unitaire,
        quantite: item.quantite,
        sous_total: item.prix_unitaire * item.quantite,
      });

      if (itemError) {
        console.error('Erreur création item:', itemError);
        // On continue malgré l'erreur pour ne pas bloquer la commande
      }

      // Décrémenter le stock
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        variant_id: item.variant_id,
        quantity: item.quantite,
      });

      if (stockError) {
        console.error('Erreur décrémentation stock:', stockError);
      }
    }

    // 4. Créer l'entrée dans l'historique des statuts
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      nouveau_statut: 'en_attente',
      notes: 'Commande créée',
    });

    // 5. Envoyer l'email de confirmation
    try {
      const emailHtml = generateOrderConfirmationEmail(order, params.items);
      
      await resend.emails.send({
        from: 'anasCB <onboarding@resend.dev>',
        to: validatedData.email,
        subject: `Confirmation de commande ${order.numero_commande}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On ne fait pas échouer la commande si l'email ne part pas
    }

    revalidatePath('/admin/commandes');

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.numero_commande,
    };
  } catch (error) {
    console.error('Erreur createOrder:', error);
    return {
      success: false,
      error: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    };
  }
}

function generateOrderConfirmationEmail(order: Order, items: CartItem[]): string {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 500;">${item.nom_produit}</div>
        <div style="font-size: 14px; color: #6b7280;">
          Taille: ${item.taille} - Couleur: ${item.couleur}
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantite}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${(item.prix_unitaire * item.quantite).toFixed(2)} DHS
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">anasCB</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Merci pour votre commande !
            </p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-top: 0;">
              Bonjour <strong>${order.client_nom}</strong>,
            </p>
            
            <p>
              Nous avons bien reçu votre commande <strong>${order.numero_commande}</strong>. 
              Elle sera traitée dans les plus brefs délais.
            </p>

            <!-- Order Details -->
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">
                Détails de la commande
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #e5e7eb;">
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Produit</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600;">Qté</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>Sous-total:</span>
                  <span><strong>${order.sous_total.toFixed(2)} DHS</strong></span>
                </div>
                ${
                  order.reduction_promo > 0
                    ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
                  <span>Réduction:</span>
                  <span><strong>-${order.reduction_promo.toFixed(2)} DHS</strong></span>
                </div>
                `
                    : ''
                }
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>Frais de livraison:</span>
                  <span><strong>${order.frais_livraison.toFixed(2)} DHS</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 2px solid #374151; font-size: 18px;">
                  <span><strong>Total:</strong></span>
                  <span><strong>${order.total.toFixed(2)} DHS</strong></span>
                </div>
              </div>
            </div>

            <!-- Delivery Address -->
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">
                Adresse de livraison
              </h2>
              <p style="margin: 0; line-height: 1.8;">
                ${order.client_nom}<br>
                ${order.client_adresse}<br>
                ${order.client_code_postal || ''} ${order.client_ville}<br>
                Tél: ${order.client_telephone}
              </p>
            </div>

            <!-- Payment Info -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>💰 Paiement à la livraison</strong><br>
                Vous réglerez le montant de <strong>${order.total.toFixed(2)} DHS</strong> 
                en espèces lors de la réception de votre colis.
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
              Vous recevrez un autre email dès que votre commande sera expédiée.
            </p>

            <p style="margin-bottom: 0;">
              Cordialement,<br>
              <strong>L'équipe anasCB</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p style="margin: 5px 0;">anasCB - Mode Féminine à Rabat</p>
            <p style="margin: 5px 0;">Rabat, Maroc</p>
            <p style="margin: 5px 0;">
              Email: contact@anascb.ma | Tél: +212 6 00 00 00 00
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
