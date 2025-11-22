'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/hooks/use-cart'
import { useHasHydrated } from '@/lib/hooks/use-hydrated'
import { CATEGORIES } from '@/lib/utils/constants'
import { useState } from 'react'

export function Header() {
  const { totalItems } = useCart()
  const hasHydrated = useHasHydrated()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const cartItemsCount = hasHydrated ? totalItems() : 0

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="anasCB - Accueil">
            <Image
              src="/images/logo-anascb.png"
              alt="anasCB"
              width={260}
              height={100}
              priority
              className="h-24 w-auto"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/boutique"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Toutes les collections
            </Link>
            
            {/* Menu Catégories */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Catégories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link
                      href={`/boutique?categorie=${category.slug}`}
                      className="cursor-pointer"
                    >
                      {category.nom}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/a-propos"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              À propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/boutique">
                <Search className="h-5 w-5" />
                <span className="sr-only">Rechercher</span>
              </Link>
            </Button>

            {/* Panier */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/panier">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Panier</span>
              </Link>
            </Button>

            {/* Menu Mobile */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="/boutique"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Toutes les collections
                  </Link>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Catégories</p>
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={`/boutique?categorie=${category.slug}`}
                        className="block pl-4 text-sm transition-colors hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.nom}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/a-propos"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    À propos
                  </Link>

                  <Link
                    href="/contact"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
