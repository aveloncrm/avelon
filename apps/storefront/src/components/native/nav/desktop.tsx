'use client'

import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import config from '@/config/site'
import { useCategories } from '@/hooks/useCategories'
import { useBrands } from '@/hooks/useBrands'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { forwardRef } from 'react'

export function MainNav() {
   return (
      <div className="hidden md:flex gap-4">
         <Link href="/" className="flex items-center">
            <span className="hidden font-medium sm:inline-block">
               {config.name}
            </span>
         </Link>
         <NavMenu />
      </div>
   )
}

export function NavMenu() {
   const { categories, loading: categoriesLoading } = useCategories()
   const { brands, loading: brandsLoading } = useBrands()

   return (
      <NavigationMenu>
         <NavigationMenuList>
            <NavigationMenuItem>
               <NavigationMenuLink asChild>
                  <Link href="/products" className={navigationMenuTriggerStyle()}>
                     <div className="font-normal text-foreground/70">
                        Products
                     </div>
                  </Link>
               </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">
                     Categories
                  </div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                     <li className="row-span-3">
                        <NavigationMenuLink asChild>
                           <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/products"
                           >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                 All Products
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                 Browse our complete collection of products
                                 across all categories.
                              </p>
                           </Link>
                        </NavigationMenuLink>
                     </li>
                     {categoriesLoading ? (
                        <li className="p-3">
                           <div className="text-sm text-muted-foreground">
                              Loading categories...
                           </div>
                        </li>
                     ) : (
                        categories.map((category) => (
                           <ListItem
                              key={category.id}
                              href={`/products?category=${encodeURIComponent(category.title)}`}
                              title={category.title}
                           >
                              {category.description || 'Explore this category'}
                           </ListItem>
                        ))
                     )}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">Brands</div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                     {brandsLoading ? (
                        <li className="col-span-2 p-3">
                           <div className="text-sm text-muted-foreground">
                              Loading brands...
                           </div>
                        </li>
                     ) : (
                        brands.map((brand) => (
                           <ListItem
                              key={brand.id}
                              href={`/products?brand=${encodeURIComponent(brand.title)}`}
                              title={brand.title}
                           >
                              {brand.description || 'Explore this brand'}
                           </ListItem>
                        ))
                     )}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
         </NavigationMenuList>
      </NavigationMenu>
   )
}

const ListItem = forwardRef<
   React.ElementRef<'a'>,
   React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <Link
               href={href}
               ref={ref}
               className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  className
               )}
               {...props}
            >
               <div className="text-sm font-medium leading-none">{title}</div>
               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
})

ListItem.displayName = 'ListItem'
