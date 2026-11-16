import type { Member } from '../../types/member'
import { classNames } from '../ui/classNames'

interface MemberAvatarProps {
  member: Member
  size?: 'md' | 'lg'
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Foto do integrante; sem foto, um círculo com as iniciais */
export function MemberAvatar({ member, size = 'md' }: MemberAvatarProps) {
  const sizeClasses = size === 'lg' ? 'size-40 text-5xl' : 'size-24 text-3xl'

  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={`Foto de ${member.name}`}
        className={classNames('shrink-0 rounded-pill border-2 border-brand object-cover', sizeClasses)}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={classNames(
        'grid shrink-0 place-items-center rounded-pill border-2 border-brand bg-brand-muted font-bold text-brand',
        sizeClasses,
      )}
    >
      {getInitials(member.name)}
    </span>
  )
}
