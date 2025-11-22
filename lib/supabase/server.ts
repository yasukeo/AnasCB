import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions = {}) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // La méthode `set` a été appelée depuis un Server Component sans accès en écriture.
          }
        },
        remove(name: string, options: CookieOptions = {}) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
          } catch {
            // Même remarque que ci-dessus : ignoré si appelé sans accès en écriture.
          }
        },
      },
    }
  )
}
