-- Fonction pour décrémenter le stock d'une variante de produit
-- Utilisée lors de la création d'une commande

CREATE OR REPLACE FUNCTION decrement_stock(
  variant_id UUID,
  quantity INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mettre à jour le stock en le décrémentant
  UPDATE product_variants
  SET 
    stock = GREATEST(stock - quantity, 0),
    updated_at = NOW()
  WHERE id = variant_id;
  
  -- Si aucune ligne n'a été mise à jour, lever une erreur
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variante non trouvée: %', variant_id;
  END IF;
END;
$$;

-- Permettre l'exécution de cette fonction aux utilisateurs authentifiés
-- (Dans notre cas, elle sera appelée via les Server Actions)
GRANT EXECUTE ON FUNCTION decrement_stock TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_stock TO anon;
