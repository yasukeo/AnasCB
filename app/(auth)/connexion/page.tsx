'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Lock, Mail } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from '@/lib/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use browser client for login
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      console.log('Attempting login with:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data, error })

      if (error) {
        console.error('Login error from Supabase:', error)
        toast.error('Email ou mot de passe incorrect')
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log('User logged in:', data.user.id)
        toast.success('Connexion réussie!')
        
        // Get user role
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        console.log('User role data:', userData, 'Error:', roleError)

        // Redirect based on role
        const redirectPath = userData?.role === 'ADMIN' ? '/admin' : '/compte'
        console.log('Redirecting to:', redirectPath)
        
        // Force a full page navigation
        window.location.replace(redirectPath)
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <Link href="/">
            <Image
              src="/images/logo-anascb.png"
              alt="anasCB"
              width={120}
              height={45}
              className="h-12 w-auto"
            />
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte anasCB
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/mot-de-passe-oublie"
              className="text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="text-primary font-medium hover:underline">
              S&apos;inscrire
            </Link>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
