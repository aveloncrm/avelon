"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons"
import { Store } from "lucide-react"
import api from "@/lib/api"

interface StoreData {
    id: string
    name: string
    subdomain: string
    customDomain?: string | null
}

export function StoreSwitcher() {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const [stores, setStores] = React.useState<StoreData[]>([])
    const [activeStore, setActiveStore] = React.useState<StoreData | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        loadStores()
    }, [])

    async function loadStores() {
        try {
            // The api.get returns the data directly, not wrapped in a .data property
            const storesData = await api.get('/api/merchants/stores') as StoreData[]
            setStores(storesData)

            // Get current store from cookie or use first store
            const currentStoreId = document.cookie
                .split('; ')
                .find(row => row.startsWith('currentStoreId='))
                ?.split('=')[1]

            const current = storesData.find(s => s.id === currentStoreId) || storesData[0]
            if (current) {
                setActiveStore(current)
                // Set cookie if not set
                if (!currentStoreId) {
                    document.cookie = `currentStoreId=${current.id}; path=/; max-age=31536000`
                }
            }
        } catch (error) {
            console.error('Failed to load stores:', error)
        } finally {
            setLoading(false)
        }
    }

    function switchStore(store: StoreData) {
        setActiveStore(store)
        // Update cookie
        document.cookie = `currentStoreId=${store.id}; path=/; max-age=31536000`
        // Reload page to apply new store context
        window.location.reload()
    }

    function createNewStore() {
        router.push('/stores/new')
    }

    if (loading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Store className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Loading...</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    if (!activeStore) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" onClick={createNewStore}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <PlusIcon className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Create Store</span>
                            <span className="truncate text-xs">Get started</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Store className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeStore.name}
                                </span>
                                <span className="truncate text-xs">{activeStore.subdomain}.galamine.com</span>
                            </div>
                            <CaretSortIcon className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Your Stores
                        </DropdownMenuLabel>
                        {stores.map((store) => (
                            <DropdownMenuItem
                                key={store.id}
                                onClick={() => switchStore(store)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <Store className="size-4 shrink-0" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{store.name}</span>
                                    <span className="text-xs text-muted-foreground">{store.subdomain}</span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onClick={createNewStore}>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <PlusIcon className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Create Store</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
