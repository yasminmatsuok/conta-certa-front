import { Bell, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'

interface HeaderProps {
  userName: string
  hasNotifications?: boolean
  /** Chamado ao escolher "Sair" no menu do avatar */
  onLogout: () => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function Header({ userName, hasNotifications = false, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fecha o menu do avatar ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!menuOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

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

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label={`Perfil de ${userName}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 cursor-pointer place-items-center rounded-pill border-2 border-brand text-sm font-bold text-brand transition-colors hover:bg-brand-muted md:size-13 md:text-base"
          >
            {getInitials(userName)}
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Perfil"
              className="absolute right-0 top-full mt-2 w-56 rounded-control border border-border-strong bg-surface-raised p-2 shadow-xl"
            >
              <p className="truncate px-3 py-2 text-sm text-muted">{userName}</p>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  onLogout()
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[0.625rem] px-3 py-2.5 text-left font-bold transition-colors hover:bg-border"
              >
                <LogOut size={18} aria-hidden="true" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
