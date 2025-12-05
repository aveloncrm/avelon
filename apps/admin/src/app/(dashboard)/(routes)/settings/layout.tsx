import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account settings and set e-mail preferences.",
}

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
