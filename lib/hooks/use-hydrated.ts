'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true once the component has mounted on the client.
 * Useful to avoid hydration mismatches with persisted stores.
 */
export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}
