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
import { login } from '@/lib/actions/auth'
import { toast } from '@/lib/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success('Connexion réussie !')
        
        // Redirect based on user role
        if (result.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/compte')
        }
      } else {
        toast.error(result.error || 'Erreur de connexion')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
