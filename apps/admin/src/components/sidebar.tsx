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
  Home
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

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
    <div className="group fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-16 bg-background border-r transition-all duration-300 hover:w-64 hidden md:block">
      {/* Navigation */}
      <nav className="flex flex-col space-y-1 p-2 pt-4">
        {routes.map((route) => {
          const Icon = route.icon
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group/nav',
                route.active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {route.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
