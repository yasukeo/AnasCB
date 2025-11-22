-- Policies to allow anonymous checkout operations explicitly

-- Orders
DROP POLICY IF EXISTS "Tout le monde peut créer commandes" ON orders;
CREATE POLICY "Public peut créer commandes"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Order items
DROP POLICY IF EXISTS "Tout le monde peut créer order_items" ON order_items;
CREATE POLICY "Public peut créer order_items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Order status history
DROP POLICY IF EXISTS "Tout le monde peut créer historique" ON order_status_history;
CREATE POLICY "Public peut créer historique"
  ON order_status_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
