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
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={hasNotifications ? 'Notificações (há novas)' : 'Notificações'}
            className="relative grid size-10 cursor-pointer place-items-center rounded-pill border border-border bg-surface text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <Bell size={18} aria-hidden="true" />
            {hasNotifications && (
              <span className="absolute right-2 top-2 size-2 rounded-pill bg-brand ring-2 ring-surface" />
            )}
          </button>

          <button
            type="button"
            aria-label={`Perfil de ${userName}`}
            className="grid size-10 cursor-pointer place-items-center rounded-pill bg-brand text-sm font-bold text-on-brand transition-colors hover:bg-brand-hover"
          >
            {getInitials(userName)}
          </button>
        </div>
      </div>
    </header>
  )
}
