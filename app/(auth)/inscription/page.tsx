'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Lock, Mail, User } from 'lucide-react'
import { signup } from '@/lib/actions/auth'
import { toast } from '@/lib/hooks/use-toast'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
      })

      if (result.success) {
        toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
        router.push('/connexion')
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte')
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
        <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
        <CardDescription>
          Rejoignez anasCB pour suivre vos commandes
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

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
                minLength={6}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Au moins 6 caractères
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
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
                Création du compte...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{' '}
            <Link href="/connexion" className="text-primary font-medium hover:underline">
              Se connecter
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
