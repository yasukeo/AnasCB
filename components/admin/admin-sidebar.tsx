'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tag, 
  Settings,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Commandes',
    href: '/admin/commandes',
    icon: ShoppingBag,
  },
  {
    name: 'Produits',
    href: '/admin/produits',
    icon: Package,
  },
  {
    name: 'Codes Promo',
    href: '/admin/codes-promo',
    icon: Tag,
  },
  {
    name: 'Statistiques',
    href: '/admin/statistiques',
    icon: BarChart3,
  },
  {
    name: 'Paramètres',
    href: '/admin/parametres',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
