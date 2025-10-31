'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {

  CreditCard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Tag,
  Gift,
  Settings,
  Home,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from './logout-button'

export function MobileNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: `/`,
      label: 'Dashboard',
      icon: Home,
      active: pathname === `/`,
    },
    {
      href: `/banners`,
      label: 'Banners',
      icon: Image,
      active: pathname.includes(`/banners`),
    },
    {
      href: `/categories`,
      label: 'Categories',
      icon: Tag,
      active: pathname.includes(`/categories`),
    },
    {
      href: `/products`,
      label: 'Products',
      icon: Package,
      active: pathname.includes(`/products`),
    },
    {
      href: `/orders`,
      label: 'Orders',
      icon: ShoppingCart,
      active: pathname.includes(`/orders`),
    },
    {
      href: `/payments`,
      label: 'Payments',
      icon: CreditCard,
      active: pathname.includes(`/payments`),
    },
    {
      href: `/users`,
      label: 'Users',
      icon: Users,
      active: pathname.includes(`/users`),
    },
    {
      href: `/brands`,
      label: 'Brands',
      icon: Gift,
      active: pathname.includes(`/brands`),
    },
    {
      href: `/codes`,
      label: 'Codes',
      icon: Settings,
      active: pathname.includes(`/codes`),
    },
  ]

  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            A
          </div>
          <span className="font-bold tracking-wider">ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutButton />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-background border-b shadow-lg">
          <nav className="flex flex-col space-y-1 p-2">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    route.active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{route.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}
