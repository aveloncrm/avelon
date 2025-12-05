import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account settings and set e-mail preferences.",
}

const sidebarNavItems = [
    {
        title: "General",
        href: "/settings/general",
    },
    {
        title: "Integrations",
        href: "/settings/integrations",
    },
    {
        title: "Team",
        href: "/settings/team",
    },
    {
        title: "Billing",
        href: "/settings/billing",
    },
    {
        title: "Notifications",
        href: "/settings/notifications",
    },
    {
        title: "Limits",
        href: "/settings/limits",
    },
    {
        title: "Ad Tracking",
        href: "/settings/ad-tracking",
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <div className="space-y-6 p-10 pb-16 block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your store settings and preferences.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex-1">{children}</div>
        </div>
    )
}
