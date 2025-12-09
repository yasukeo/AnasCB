'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Store } from 'lucide-react'
import { logout } from '@/lib/actions/auth'

interface AdminHeaderProps {
  user: {
    email: string | null | undefined
    role: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/logo-anascb.png"
              alt="anasCB"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-sm font-medium text-muted-foreground">Admin</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Store className="mr-2 h-4 w-4" />
              Voir la boutique
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2" suppressHydrationWarning>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/parametres">
                  <User className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
