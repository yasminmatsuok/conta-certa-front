import { Bell } from 'lucide-react'
import { Logo } from './Logo'

interface HeaderProps {
  userName: string
  hasNotifications?: boolean
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function Header({ userName, hasNotifications = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-background px-4 md:h-28 md:px-8">
      <Logo />

      <div className="flex items-center gap-3 md:gap-5">
        <button
          type="button"
          aria-label={hasNotifications ? 'Notificações (há novas)' : 'Notificações'}
          className="relative grid size-10 cursor-pointer place-items-center rounded-pill text-foreground transition-colors hover:text-brand"
        >
          <Bell className="size-6 md:size-7" aria-hidden="true" />
          {hasNotifications && (
            <span className="absolute right-1.5 top-1 size-2.5 rounded-pill bg-brand shadow-glow" />
          )}
        </button>

        <button
          type="button"
          aria-label={`Perfil de ${userName}`}
          className="grid size-10 cursor-pointer place-items-center rounded-pill border-2 border-brand text-sm font-bold text-brand transition-colors hover:bg-brand-muted md:size-13 md:text-base"
        >
          {getInitials(userName)}
        </button>
      </div>
    </header>
  )
}
