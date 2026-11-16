import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { MemberAvatar } from '../components/site/MemberAvatar'
import { MemberLinks } from '../components/site/MemberLinks'
import { Card } from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { MEMBERS } from '../data/members'
import { PATHS } from '../routes/paths'

export function MemberDetailPage() {
  // Rota com parâmetro: /integrantes/:rm
  const { rm = '' } = useParams<{ rm: string }>()
  const member = MEMBERS.find((item) => item.rm === rm)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Link to={PATHS.members} className="inline-flex items-center gap-2 text-muted hover:text-brand">
        <ArrowLeft size={18} aria-hidden="true" />
        Integrantes
      </Link>

      <div className="mt-6">
        {member ? (
          <Card padding="lg" className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <MemberAvatar member={member} size="lg" />
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{member.name}</h1>
              <dl className="mt-4 space-y-1 text-lg">
                <div className="flex justify-center gap-2 md:justify-start">
                  <dt className="text-muted">RM</dt>
                  <dd className="font-bold">{member.rm}</dd>
                </div>
                <div className="flex justify-center gap-2 md:justify-start">
                  <dt className="text-muted">Turma</dt>
                  <dd className="font-bold">{member.className}</dd>
                </div>
              </dl>
              <div className="mt-5 flex justify-center md:justify-start">
                <MemberLinks member={member} />
              </div>
            </div>
          </Card>
        ) : (
          // RM que não existe em src/data/members.ts
          <Card padding="lg" className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Integrante não encontrado</h1>
            <p className="mt-3 text-muted">Não existe integrante com o RM "{rm}".</p>
            <Link to={PATHS.members} className={buttonClasses({ className: 'mt-6' })}>
              Voltar para a lista de integrantes
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
