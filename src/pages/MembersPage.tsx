import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MemberAvatar } from '../components/site/MemberAvatar'
import { MemberLinks } from '../components/site/MemberLinks'
import { SitePage } from '../components/site/SitePage'
import { Card, EmptyState } from '../components/ui'
import { MEMBERS } from '../data/members'
import { PATHS } from '../routes/paths'

export function MembersPage() {
  return (
    <SitePage title="Integrantes" description="Quem desenvolveu o Conta Certa.">
      {MEMBERS.length === 0 ? (
        <EmptyState title="Nenhum integrante cadastrado" description="Preencha src/data/members.ts." />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((member) => (
            <li key={member.rm}>
              <Card className="flex h-full flex-col items-center text-center">
                <MemberAvatar member={member} />
                <h2 className="mt-4 text-xl font-bold">{member.name}</h2>
                <p className="mt-1 text-muted">
                  RM {member.rm} · {member.className}
                </p>

                <div className="mt-4">
                  <MemberLinks member={member} />
                </div>

                <Link
                  to={PATHS.memberDetail(member.rm)}
                  aria-label={`Ver perfil de ${member.name}`}
                  className="mt-auto inline-flex items-center gap-2 pt-5 font-bold hover:text-brand"
                >
                  Ver perfil
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </SitePage>
  )
}
