-- Script pour ajouter des produits de test
-- À exécuter dans l'éditeur SQL de Supabase

-- Produit 1: T-shirt Basique
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('T-shirt Basique Blanc', 't-shirt-basique-blanc', 'T-shirt en coton doux et confortable, parfait pour le quotidien. Coupe moderne et élégante.', 129.00, 
  (SELECT id FROM categories WHERE slug = 't-shirts'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour T-shirt Basique
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 't-shirt-basique-blanc'), 'S', 'Blanc', '#FFFFFF', 10, 'TSH-WHT-S'),
  ((SELECT id FROM products WHERE slug = 't-shirt-basique-blanc'), 'M', 'Blanc', '#FFFFFF', 15, 'TSH-WHT-M'),
  ((SELECT id FROM products WHERE slug = 't-shirt-basique-blanc'), 'L', 'Blanc', '#FFFFFF', 12, 'TSH-WHT-L'),
  ((SELECT id FROM products WHERE slug = 't-shirt-basique-blanc'), 'XL', 'Blanc', '#FFFFFF', 8, 'TSH-WHT-XL');

-- Produit 2: Robe Élégante
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Robe Élégante Florale', 'robe-elegante-florale', 'Magnifique robe à motifs floraux, idéale pour les occasions spéciales. Tissu fluide et léger.', 349.00, 
  (SELECT id FROM categories WHERE slug = 'robes'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Robe
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'robe-elegante-florale'), 'S', 'Bleu', '#4A90E2', 5, 'ROB-BLU-S'),
  ((SELECT id FROM products WHERE slug = 'robe-elegante-florale'), 'M', 'Bleu', '#4A90E2', 8, 'ROB-BLU-M'),
  ((SELECT id FROM products WHERE slug = 'robe-elegante-florale'), 'L', 'Bleu', '#4A90E2', 6, 'ROB-BLU-L'),
  ((SELECT id FROM products WHERE slug = 'robe-elegante-florale'), 'S', 'Rose', '#FF69B4', 7, 'ROB-ROSE-S'),
  ((SELECT id FROM products WHERE slug = 'robe-elegante-florale'), 'M', 'Rose', '#FF69B4', 10, 'ROB-ROSE-M');

-- Produit 3: Pantalon Slim
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Pantalon Slim Noir', 'pantalon-slim-noir', 'Pantalon slim fit élégant, parfait pour un look professionnel. Tissu stretch confortable.', 279.00, 
  (SELECT id FROM categories WHERE slug = 'pantalons'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Pantalon
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'pantalon-slim-noir'), 'S', 'Noir', '#000000', 12, 'PAN-BLK-S'),
  ((SELECT id FROM products WHERE slug = 'pantalon-slim-noir'), 'M', 'Noir', '#000000', 15, 'PAN-BLK-M'),
  ((SELECT id FROM products WHERE slug = 'pantalon-slim-noir'), 'L', 'Noir', '#000000', 10, 'PAN-BLK-L'),
  ((SELECT id FROM products WHERE slug = 'pantalon-slim-noir'), 'XL', 'Noir', '#000000', 8, 'PAN-BLK-XL');

-- Produit 4: Veste en Jean
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Veste en Jean Classique', 'veste-jean-classique', 'Veste en denim intemporelle, parfaite pour toutes les saisons. Style décontracté et moderne.', 449.00, 
  (SELECT id FROM categories WHERE slug = 'vestes'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Veste
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'veste-jean-classique'), 'S', 'Bleu Denim', '#1E3A5F', 6, 'VST-DEN-S'),
  ((SELECT id FROM products WHERE slug = 'veste-jean-classique'), 'M', 'Bleu Denim', '#1E3A5F', 9, 'VST-DEN-M'),
  ((SELECT id FROM products WHERE slug = 'veste-jean-classique'), 'L', 'Bleu Denim', '#1E3A5F', 7, 'VST-DEN-L');

-- Produit 5: Body Élégant
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Body Élégant Noir', 'body-elegant-noir', 'Body ajusté et élégant, parfait pour un look sophistiqué. Matière stretch confortable.', 179.00, 
  (SELECT id FROM categories WHERE slug = 'body'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Body
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'body-elegant-noir'), 'XS', 'Noir', '#000000', 8, 'BOD-BLK-XS'),
  ((SELECT id FROM products WHERE slug = 'body-elegant-noir'), 'S', 'Noir', '#000000', 12, 'BOD-BLK-S'),
  ((SELECT id FROM products WHERE slug = 'body-elegant-noir'), 'M', 'Noir', '#000000', 14, 'BOD-BLK-M'),
  ((SELECT id FROM products WHERE slug = 'body-elegant-noir'), 'L', 'Noir', '#000000', 10, 'BOD-BLK-L');

-- Produit 6: Short d'été
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Short d''Été en Lin', 'short-ete-lin', 'Short léger en lin, idéal pour les journées chaudes. Coupe confortable et style décontracté.', 199.00, 
  (SELECT id FROM categories WHERE slug = 'shorts'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Short
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'short-ete-lin'), 'S', 'Beige', '#F5F5DC', 10, 'SHT-BEI-S'),
  ((SELECT id FROM products WHERE slug = 'short-ete-lin'), 'M', 'Beige', '#F5F5DC', 13, 'SHT-BEI-M'),
  ((SELECT id FROM products WHERE slug = 'short-ete-lin'), 'L', 'Beige', '#F5F5DC', 11, 'SHT-BEI-L'),
  ((SELECT id FROM products WHERE slug = 'short-ete-lin'), 'S', 'Blanc', '#FFFFFF', 9, 'SHT-WHT-S'),
  ((SELECT id FROM products WHERE slug = 'short-ete-lin'), 'M', 'Blanc', '#FFFFFF', 12, 'SHT-WHT-M');

-- Produit 7: Jupe Plissée
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Jupe Plissée Midi', 'jupe-plissee-midi', 'Jupe plissée longueur midi, élégante et intemporelle. Parfaite pour le bureau ou les sorties.', 259.00, 
  (SELECT id FROM categories WHERE slug = 'jupes'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Jupe
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'jupe-plissee-midi'), 'S', 'Noir', '#000000', 8, 'JUP-BLK-S'),
  ((SELECT id FROM products WHERE slug = 'jupe-plissee-midi'), 'M', 'Noir', '#000000', 11, 'JUP-BLK-M'),
  ((SELECT id FROM products WHERE slug = 'jupe-plissee-midi'), 'L', 'Noir', '#000000', 9, 'JUP-BLK-L'),
  ((SELECT id FROM products WHERE slug = 'jupe-plissee-midi'), 'S', 'Bordeaux', '#800020', 7, 'JUP-BOR-S'),
  ((SELECT id FROM products WHERE slug = 'jupe-plissee-midi'), 'M', 'Bordeaux', '#800020', 10, 'JUP-BOR-M');

-- Produit 8: Manteau d'Hiver
INSERT INTO products (nom, slug, description, prix, category_id, images, est_actif) VALUES
('Manteau d''Hiver Long', 'manteau-hiver-long', 'Manteau long et chaud pour l''hiver. Élégant et pratique, avec doublure isolante.', 899.00, 
  (SELECT id FROM categories WHERE slug = 'manteaux'), 
  ARRAY['/images/placeholder.svg'], 
  true);

-- Variantes pour Manteau
INSERT INTO product_variants (product_id, taille, couleur, couleur_hex, stock, sku) VALUES
  ((SELECT id FROM products WHERE slug = 'manteau-hiver-long'), 'S', 'Camel', '#C19A6B', 5, 'MAN-CAM-S'),
  ((SELECT id FROM products WHERE slug = 'manteau-hiver-long'), 'M', 'Camel', '#C19A6B', 7, 'MAN-CAM-M'),
  ((SELECT id FROM products WHERE slug = 'manteau-hiver-long'), 'L', 'Camel', '#C19A6B', 6, 'MAN-CAM-L'),
  ((SELECT id FROM products WHERE slug = 'manteau-hiver-long'), 'S', 'Noir', '#000000', 6, 'MAN-BLK-S'),
  ((SELECT id FROM products WHERE slug = 'manteau-hiver-long'), 'M', 'Noir', '#000000', 8, 'MAN-BLK-M');

-- Vérifier les produits créés
SELECT 
  p.nom, 
  p.prix, 
  c.nom as categorie,
  COUNT(v.id) as nb_variantes,
  SUM(v.stock) as stock_total
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants v ON p.id = v.product_id
GROUP BY p.id, p.nom, p.prix, c.nom
ORDER BY p.created_at DESC;
