import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from './logout-button'

export function TopHeader() {
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          A
        </div>
        <span className="font-bold tracking-wider">ADMIN</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  )
}
