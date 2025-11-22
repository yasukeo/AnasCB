-- Schéma initial de la base de données anasCB
-- À exécuter dans l'éditeur SQL de Supabase

-- ============================================
-- TABLES PRINCIPALES
-- ============================================

-- Table: users (étend auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nom_complet TEXT,
  telephone TEXT,
  role TEXT NOT NULL DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  est_actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  taille TEXT NOT NULL,
  couleur TEXT NOT NULL,
  couleur_hex TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, taille, couleur)
);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_commande TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Informations client
  client_nom TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_telephone TEXT NOT NULL,
  client_adresse TEXT NOT NULL,
  client_ville TEXT NOT NULL,
  client_code_postal TEXT,
  client_notes TEXT,
  
  -- Montants
  sous_total DECIMAL(10,2) NOT NULL,
  frais_livraison DECIMAL(10,2) DEFAULT 35.00,
  reduction_promo DECIMAL(10,2) DEFAULT 0.00,
  code_promo_utilise TEXT,
  total DECIMAL(10,2) NOT NULL,
  
  -- Statut
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (
    statut IN ('en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree', 'annulee')
  ),
  raison_annulation TEXT,
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmee_at TIMESTAMPTZ,
  livree_at TIMESTAMPTZ
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  
  -- Snapshot des infos produit
  nom_produit TEXT NOT NULL,
  taille TEXT NOT NULL,
  couleur TEXT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  sous_total DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: order_status_history
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ancien_statut TEXT,
  nouveau_statut TEXT NOT NULL,
  changed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: promo_codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  pourcentage INTEGER NOT NULL CHECK (pourcentage > 0 AND pourcentage <= 100),
  date_debut TIMESTAMPTZ NOT NULL,
  date_fin TIMESTAMPTZ NOT NULL,
  est_actif BOOLEAN DEFAULT true,
  utilisation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (date_fin > date_debut)
);

-- Table: saved_addresses
CREATE TABLE IF NOT EXISTS public.saved_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nom_adresse TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  code_postal TEXT,
  telephone TEXT,
  est_principale BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_actif ON products(est_actif);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_numero ON orders(numero_commande);
CREATE INDEX IF NOT EXISTS idx_orders_statut ON orders(statut);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id);

-- ============================================
-- FONCTIONS & TRIGGERS
-- ============================================

-- Fonction: Générer numéro de commande unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  count_part TEXT;
  order_count INTEGER;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  SELECT COUNT(*) INTO order_count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  count_part := LPAD((order_count + 1)::TEXT, 4, '0');
  
  RETURN 'CMD-' || date_part || '-' || count_part;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-générer numéro de commande
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_commande IS NULL OR NEW.numero_commande = '' THEN
    NEW.numero_commande := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Fonction: Mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON promo_codes;
CREATE TRIGGER update_promo_codes_updated_at 
BEFORE UPDATE ON promo_codes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_variants_updated_at ON product_variants;
CREATE TRIGGER update_variants_updated_at 
BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: PUBLIC READ (Produits & Catégories)
-- ============================================

DROP POLICY IF EXISTS "Public peut voir produits actifs" ON products;
CREATE POLICY "Public peut voir produits actifs"
  ON products FOR SELECT
  USING (est_actif = true);

DROP POLICY IF EXISTS "Public peut voir variantes" ON product_variants;
CREATE POLICY "Public peut voir variantes"
  ON product_variants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public peut voir catégories" ON categories;
CREATE POLICY "Public peut voir catégories"
  ON categories FOR SELECT
  USING (true);

-- ============================================
-- POLICIES: ADMIN FULL ACCESS
-- ============================================

DROP POLICY IF EXISTS "Admins gestion complète products" ON products;
CREATE POLICY "Admins gestion complète products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins gestion complète variants" ON product_variants;
CREATE POLICY "Admins gestion complète variants"
  ON product_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins gestion complète categories" ON categories;
CREATE POLICY "Admins gestion complète categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins gestion complète orders" ON orders;
CREATE POLICY "Admins gestion complète orders"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins peuvent voir order_items" ON order_items;
CREATE POLICY "Admins peuvent voir order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins peuvent voir historique" ON order_status_history;
CREATE POLICY "Admins peuvent voir historique"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins gestion promo_codes" ON promo_codes;
CREATE POLICY "Admins gestion promo_codes"
  ON promo_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

-- ============================================
-- POLICIES: CLIENT ACCESS
-- ============================================

DROP POLICY IF EXISTS "Clients voient leurs commandes" ON orders;
CREATE POLICY "Clients voient leurs commandes"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Clients voient leurs order_items" ON order_items;
CREATE POLICY "Clients voient leurs order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users gestion adresses" ON saved_addresses;
CREATE POLICY "Users gestion adresses"
  ON saved_addresses FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: GUEST CHECKOUT
-- ============================================

DROP POLICY IF EXISTS "Tout le monde peut créer commandes" ON orders;
CREATE POLICY "Tout le monde peut créer commandes"
  ON orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Tout le monde peut créer order_items" ON order_items;
CREATE POLICY "Tout le monde peut créer order_items"
  ON order_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Tout le monde peut créer historique" ON order_status_history;
CREATE POLICY "Tout le monde peut créer historique"
  ON order_status_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POLICIES: PROMO CODES PUBLIC READ
-- ============================================

DROP POLICY IF EXISTS "Public peut lire codes promo actifs" ON promo_codes;
CREATE POLICY "Public peut lire codes promo actifs"
  ON promo_codes FOR SELECT
  USING (est_actif = true AND NOW() BETWEEN date_debut AND date_fin);

-- ============================================
-- DONNÉES INITIALES (Catégories)
-- ============================================

INSERT INTO categories (nom, slug, description, ordre) VALUES
('T-shirts', 't-shirts', 'Collection de t-shirts tendance', 1),
('Pantalons', 'pantalons', 'Pantalons élégants et confortables', 2),
('Robes', 'robes', 'Robes pour toutes les occasions', 3),
('Vestes', 'vestes', 'Vestes stylées', 4),
('Manteaux', 'manteaux', 'Manteaux chauds et élégants', 5),
('Capuchons', 'capuchons', 'Hoodies et sweat à capuche', 6),
('Body', 'body', 'Body confortables', 7),
('Shorts', 'shorts', 'Shorts pour l''été', 8),
('Jupes', 'jupes', 'Jupes modernes', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
