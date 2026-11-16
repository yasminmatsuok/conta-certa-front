import { ExternalLink } from 'lucide-react'
import type { Member } from '../../types/member'

interface MemberLinksProps {
  member: Member
}

/** Links de GitHub e LinkedIn do integrante (só os que estiverem preenchidos) */
export function MemberLinks({ member }: MemberLinksProps) {
  const links = [
    { label: 'GitHub', url: member.github },
    { label: 'LinkedIn', url: member.linkedin },
  ].filter((link) => link.url !== '')

  if (links.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${link.label} de ${member.name} (abre em nova aba)`}
            className="inline-flex items-center gap-1.5 font-bold text-brand hover:underline"
          >
            {link.label}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
