# 🛍️ anasCB - Boutique E-commerce

Boutique en ligne de vêtements féminins à Rabat, Maroc.

## 🚀 Stack Technique

- **Frontend**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Emails**: Resend
- **Déploiement**: Vercel

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Resend (pour les emails)

## ⚙️ Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **Settings** > **API**
4. Copiez votre `Project URL` et `anon public key`

### 3. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Créez une nouvelle query
3. Copiez le contenu de `supabase/migrations/001_initial_schema.sql`
4. Exécutez la requête

### 4. Configuration Resend

1. Créez un compte sur [Resend](https://resend.com)
2. Générez une clé API
3. Vérifiez votre domaine d'envoi

### 5. Variables d'environnement

Créez un fichier `.env.local` à la racine :

```bash
cp .env.example .env.local
```

Remplissez les variables :

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_your_api_key
ADMIN_EMAIL=votre-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Créer le premier admin

Dans Supabase SQL Editor :

```sql
-- Remplacez 'votre-email@example.com' et 'votre-mot-de-passe'
-- 1. Créez d'abord l'utilisateur dans Auth
-- Allez dans Authentication > Users > Invite User
-- Ou utilisez la console pour créer manuellement

-- 2. Ensuite, exécutez cette requête (remplacez l'email)
INSERT INTO public.users (id, email, role)
SELECT id, email, 'ADMIN'
FROM auth.users
WHERE email = 'votre-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';
```

## 🏃 Lancement

### Mode développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### Build production

```bash
npm run build
npm start
```

## 📁 Structure du projet

```
anascb/
├── app/                    # App Router Next.js
│   ├── (client)/          # Routes publiques
│   ├── (auth)/            # Authentification
│   └── admin/             # Dashboard admin
├── components/            # Composants React
│   ├── ui/               # shadcn/ui
│   ├── client/           # Composants client
│   └── admin/            # Composants admin
├── lib/                   # Utilitaires
│   ├── supabase/         # Config Supabase
│   ├── actions/          # Server Actions
│   ├── hooks/            # Custom Hooks
│   └── utils/            # Helpers
├── types/                 # Types TypeScript
└── supabase/             # Migrations SQL
```

## 🔐 Sécurité

- ✅ Row Level Security (RLS) activé
- ✅ Validation avec Zod
- ✅ Protection des routes admin
- ✅ CSRF protection (Next.js)

## 📧 Emails automatiques

Les emails sont envoyés automatiquement via Resend :

- ✅ Confirmation de commande (client)
- ✅ Notification nouvelle commande (admin)
- ✅ Changement de statut (client)

## 🎯 Fonctionnalités

### Client
- ✅ Catalogue produits avec filtres
- ✅ Panier d'achat
- ✅ Checkout sans compte (guest)
- ✅ Compte client optionnel
- ✅ Codes promo
- ✅ Suivi de commande

### Admin
- ✅ Gestion des commandes
- ✅ Gestion des produits
- ✅ Gestion des codes promo
- ✅ Dashboard & statistiques

## 🚢 Déploiement Vercel

1. Push votre code sur GitHub
2. Connectez-vous à [Vercel](https://vercel.com)
3. Importez votre repository
4. Ajoutez les variables d'environnement
5. Déployez !

## 📝 Notes

- Paiement à la livraison (COD) uniquement
- Frais de livraison : 35 DHS
- Interface en français
- Max 3 admins

## 🆘 Support

Pour toute question, contactez l'équipe de développement.

---

Made with ❤️ in Rabat, Morocco
