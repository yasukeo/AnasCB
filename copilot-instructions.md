# Copilot Instructions - anasCB E-commerce

## Vue d'ensemble du projet
Site e-commerce de vêtements féminins avec dashboard admin pour gestion manuelle des commandes.
- **Propriétaire** : yasukeo
- **Stack** : Next.js 14+ (TypeScript), Supabase, Tailwind CSS, shadcn/ui
- **Déploiement** : Vercel
- **Emails** : Resend
- **Workflow** : Commandes sans compte → Admin appelle client → Confirmation manuelle

## Architecture technique

### Structure du projet
```
anascb/
├── app/
│   ├── (shop)/                    # Routes publiques
│   │   ├── page.tsx               # Accueil
│   │   ├── products/
│   │   │   ├── page.tsx           # Liste produits
│   │   │   └── [id]/page.tsx      # Détail produit
│   │   ├── cart/page.tsx          # Panier
│   │   ├── checkout/page.tsx      # ⭐ Checkout (SANS compte requis)
│   │   └── order-confirmation/[id]/page.tsx
│   ├── (auth)/                    # Optionnel pour clients
│   │   ├── login/
│   │   └── signup/
│   ├── account/                   # Compte client (optionnel)
│   │   └── orders/                # Historique
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── orders/                # ⭐ PRIORITÉ : Gestion commandes
│   │   │   ├── page.tsx           # Liste
│   │   │   └── [id]/page.tsx      # Détail + Actions
│   │   ├── products/
│   │   ├── promos/
│   │   └── settings/
│   ├── api/
│   │   ├── orders/
│   │   │   └── [id]/status/route.ts  # Changer statut
│   │   └── webhooks/
│   └── layout.tsx
├── components/
│   ├── ui/                        # shadcn components
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   └── CheckoutForm.tsx       # ⭐ Formulaire complet
│   └── admin/
│       ├── OrderDetails.tsx       # ⭐ Infos client + actions
│       └── OrderStatusBadge.tsx
├── lib/
│   ├── supabase/
│   ├── validations/
│   │   └── checkout.ts            # Zod schema pour formulaire
│   ├── emails/
│   │   ├── order-received.tsx     # Template client
│   │   ├── order-confirmed.tsx
│   │   └── new-order-admin.tsx    # Template admin
│   └── utils/
├── types/
│   └── index.ts
├── public/
└── .env.local
```

### Base de données (Supabase)

#### Tables principales

```sql
-- Users (optionnel pour clients)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  role TEXT DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  UNIQUE(product_id, size, color)
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);
-- INSERT : T-shirts, Pantalons, Robes, Vestes, Manteaux, Capuchons, Body, Shorts, Jupes

-- ⭐ Orders (user_id nullable pour guest checkout)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Format: MOU-20251031-001
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL si guest
  
  -- Informations client (toujours remplies)
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_address TEXT NOT NULL,
  client_city TEXT NOT NULL,
  client_postal_code TEXT,
  client_notes TEXT,
  
  -- Montants
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  shipping_fee DECIMAL(10,2) DEFAULT 35,
  total DECIMAL(10,2) NOT NULL,
  
  -- Promo
  promo_code TEXT,
  
  -- Statut
  status TEXT DEFAULT 'en_attente' CHECK (status IN (
    'en_attente',
    'confirmee',
    'en_preparation',
    'en_livraison',
    'livree',
    'annulee'
  )),
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL, -- Snapshot
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- ⭐ Order Status History (audit trail)
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id), -- Admin qui a changé
  notes TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo Codes
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL, -- 10, 20, 50...
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Règles de sécurité (RLS)
```sql
-- Orders : admins voient tout, clients authentifiés voient leurs commandes
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Clients can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Guest checkout : INSERT autorisé pour tous
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);
```

## Règles de développement

### Style de code
- **Langue** : commentaires et variables en français
- **TypeScript strict** : tous les types explicites
- **Conventions de nommage** :
  - Components : PascalCase (`OrderDetails.tsx`)
  - Functions : camelCase (`creerCommande()`)
  - Constants : UPPER_SNAKE_CASE (`FRAIS_LIVRAISON = 35`)

### Composants UI
- Utilise **shadcn/ui** pour tous les composants de base
- Crée des composants réutilisables dans `/components`
- Préfère les **Server Components** sauf si interactivité nécessaire

### Formulaire de checkout
**Champs requis** :
- Nom complet (min 3 caractères)
- Email (validation email)
- Téléphone (format : +212 6XX-XXXXXX ou 06XX-XXXXXX)
- Adresse complète (min 10 caractères)
- Ville (dropdown avec villes marocaines principales)
- Code postal (optionnel)
- Notes (optionnel, textarea)

**Validation avec Zod** :
```typescript
const checkoutSchema = z.object({
  nom: z.string().min(3, "Nom trop court"),
  email: z.string().email("Email invalide"),
  telephone: z.string().regex(/^(\+212|0)[5-7]\d{8}$/, "Téléphone invalide"),
  adresse: z.string().min(10, "Adresse trop courte"),
  ville: z.string().min(1, "Sélectionnez une ville"),
  codePostal: z.string().optional(),
  notes: z.string().optional()
});
```

### Workflow de commande détaillé

#### 1. Client passe commande
```typescript
// Actions après validation du formulaire
async function creerCommande(data) {
  // 1. Vérifier stock des produits
  // 2. Calculer total (produits + livraison - promo)
  // 3. Générer numéro de commande : MOU-YYYYMMDD-XXX
  // 4. Créer commande avec statut "en_attente"
  // 5. Créer order_items
  // 6. Décrémenter stock
  // 7. Envoyer email client (Resend)
  // 8. Envoyer email admin (Resend)
  // 9. Vider panier
  // 10. Rediriger vers /order-confirmation/[id]
}
```

#### 2. Page confirmation client
Afficher :
- ✅ "Commande reçue !"
- Numéro de commande : **MOU-20251031-042**
- "Nous vous contacterons au **06XX-XXXXXX** pour confirmer votre commande"
- Récapitulatif complet
- Email de confirmation envoyé à : xxx@email.com

#### 3. Admin reçoit email
```
Objet : 🛍️ Nouvelle commande MOU-20251031-042

Nouvelle commande reçue !
Client : Mohammed Alami
Téléphone : 0612-345678
Ville : Rabat
Total : 485 DHS

👉 Voir la commande : https://anascb.ma/admin/orders/xxx
```

#### 4. Admin appelle client
Dans `/admin/orders/[id]` :
- Afficher toutes les infos client en grand
- Bouton "📞 Appeler 0612-345678" (ouvre tel:+212612345678)
- Bouton "✉️ Envoyer email" (ouvre mailto:)
- Champ notes admin (pour remarques)
- Dropdown pour changer statut

#### 5. Admin confirme commande
- Admin change statut : "En attente" → "Confirmée"
- Enregistrer dans order_status_history
- Email automatique au client :
  ```
  Objet : ✅ Commande MOU-20251031-042 confirmée
  
  Bonjour Mohammed,
  
  Votre commande a été confirmée !
  Elle sera préparée et expédiée sous 24-48h.
  
  Vous pouvez suivre votre commande : https://anascb.ma/order/track/xxx
  ```

#### 6. Suivi des statuts
Chaque changement de statut déclenche :
- Enregistrement dans order_status_history
- Email au client (templates différents par statut)
- Log pour l'admin

### Emails (Resend)
**Templates à créer** :
1. **order-received.tsx** : Client - Commande reçue
2. **order-confirmed.tsx** : Client - Commande confirmée par admin
3. **order-shipped.tsx** : Client - Commande en livraison
4. **order-delivered.tsx** : Client - Commande livrée
5. **order-cancelled.tsx** : Client - Commande annulée
6. **new-order-admin.tsx** : Admin - Nouvelle commande

Tous en français, design moderne avec logo.

### Dashboard Admin : Page Commandes

**Liste des commandes** :
- Table avec colonnes :
  - N° commande (cliquable)
  - Date
  - Client (nom + tel)
  - Ville
  - Total
  - Statut (badge coloré)
  - Actions (voir détails, changer statut rapide)
- Filtres :
  - Par statut (tabs)
  - Par ville (dropdown)
  - Par date (date range picker)
  - Par montant (min-max)
- Recherche : numéro commande, nom, téléphone
- Tri : date (défaut), montant, ville
- Pagination
- Alerte : badge rouge si commandes "en attente" > 10

**Détail commande** (`/admin/orders/[id]`) :
```
┌─────────────────────────────────────────┐
│ Commande MOU-20251031-042               │
│ [Badge Statut]                          │
└─────────────────────────────────────────┘

📋 Informations client
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nom : Mohammed Alami
📧 Email : m.alami@gmail.com
📞 Téléphone : [Bouton Appeler] 0612-345678
📍 Adresse : 123 Rue Hassan II, Appt 5
🏙️ Ville : Rabat
📮 Code postal : 10000
📝 Notes : Livrer après 18h SVP

🛍️ Produits commandés
━━━━━━━━━━━━━━━━━━━━━━━━━━
[Image] Robe d'été fleurie
        Taille : M | Couleur : Bleu
        Quantité : 2 × 220 DHS = 440 DHS

💰 Récapitulatif
━━━━━━━━━━━━━━━━━━━━━━━━━━
Sous-total :     440 DHS
Code promo :     -44 DHS (PROMO10)
Livraison :      +35 DHS
━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL :          431 DHS 💵

📊 Changer le statut
[Dropdown] En attente ▼
[Bouton] Mettre à jour et notifier client

📝 Notes admin (privées)
[Textarea]
[Bouton] Sauvegarder notes

📜 Historique
• 31/10/2025 11:05 - Commande créée
• 31/10/2025 14:30 - Confirmée par yasukeo
  "Client OK, livraison vendredi"
```

## Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
ADMIN_EMAIL=yasukeo@example.com  # Email pour recevoir notifs

# Site
NEXT_PUBLIC_SITE_URL=https://anascb.vercel.app
NEXT_PUBLIC_SITE_NAME="anasCB"
FRAIS_LIVRAISON=35
```

## Fonctionnalités par priorité

### Phase 1 (MVP) ⭐
1. Structure du projet + Supabase setup
2. Authentification ADMIN uniquement
3. Catalogue produits (liste + détails)
4. Panier
5. **Checkout SANS compte (guest)**
6. **Page admin commandes (liste + détails + actions)**
7. **Système d'emails (Resend)**

### Phase 2
1. Authentification CLIENT (optionnelle)
2. Historique commandes pour clients connectés
3. Codes promo
4. Gestion du stock par variante
5. Dashboard analytics
6. Mode sombre

### Phase 3 (futures)
- Page de tracking public (/order/track/[id])
- Avis clients
- Wishlist
- Notifications push
- Export commandes (CSV/Excel)

## Commandes utiles

```bash
# Installation
npx create-next-app@latest anascb --typescript --tailwind --app
cd anascb
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input form table badge
npm install react-hook-form zod @hookform/resolvers
npm install resend react-email
npm install date-fns
npm install recharts  # Pour graphiques admin

# Développement
npm run dev

# Types Supabase
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts

# Déploiement
vercel --prod
```

## Notes importantes
- **Priorité absolue** : système de commandes avec toutes les infos client
- Guest checkout = pas besoin de compte pour commander
- Admin doit pouvoir appeler/contacter facilement le client
- Emails automatiques à chaque étape importante
- Stock décrémenté uniquement quand commande confirmée par admin
- Numéro de commande lisible : MOU-YYYYMMDD-XXX
- Interface admin optimisée pour mobile (gérer commandes en déplacement)

## Ressources
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Resend + React Email](https://resend.com/docs/send-with-nextjs)
- [Tailwind CSS](https://tailwindcss.com)