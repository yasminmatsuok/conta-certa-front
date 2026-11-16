import { Bell, BellOff, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'

interface HeaderProps {
  userName: string
  /** Chamado ao escolher "Sair" no menu do avatar */
  onLogout: () => void
}

/** Só um painel fica aberto por vez */
type OpenPanel = 'notifications' | 'profile' | null

const panelClasses =
  'absolute right-0 top-full mt-2 rounded-control border border-border-strong bg-surface-raised shadow-xl'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function Header({ userName, onLogout }: HeaderProps) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  const toggle = (panel: Exclude<OpenPanel, null>) =>
    setOpenPanel((current) => (current === panel ? null : panel))

  // Fecha o painel aberto ao clicar fora ou apertar Esc
  useEffect(() => {
    if (openPanel === null) return

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !actionsRef.current?.contains(event.target)) {
        setOpenPanel(null)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenPanel(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openPanel])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-background px-4 md:h-28 md:px-8">
      <Logo />

      {/* Os dois painéis abrem a partir deste bloco, alinhados à direita */}
      <div ref={actionsRef} className="relative flex items-center gap-3 md:gap-5">
        <button
          type="button"
          aria-label="Notificações"
          aria-haspopup="dialog"
          aria-expanded={openPanel === 'notifications'}
          onClick={() => toggle('notifications')}
          className="grid size-10 cursor-pointer place-items-center rounded-pill text-foreground transition-colors hover:text-brand"
        >
          <Bell className="size-6 md:size-7" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label={`Perfil de ${userName}`}
          aria-haspopup="menu"
          aria-expanded={openPanel === 'profile'}
          onClick={() => toggle('profile')}
          className="grid size-10 cursor-pointer place-items-center rounded-pill border-2 border-brand text-sm font-bold text-brand transition-colors hover:bg-brand-muted md:size-13 md:text-base"
        >
          {getInitials(userName)}
        </button>

        {openPanel === 'notifications' && (
          // A API ainda não tem notificações: o painel mostra só o estado vazio
          <div role="dialog" aria-label="Notificações" className={`${panelClasses} w-72 p-4`}>
            <p className="font-bold">Notificações</p>
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <BellOff size={28} className="text-subtle" aria-hidden="true" />
              <p className="text-sm text-muted">Nenhuma notificação</p>
            </div>
          </div>
        )}

        {openPanel === 'profile' && (
          <div role="menu" aria-label="Perfil" className={`${panelClasses} w-56 p-2`}>
            <p className="truncate px-3 py-2 text-sm text-muted">{userName}</p>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenPanel(null)
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
    </header>
  )
}
