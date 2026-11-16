import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SitePage } from '../components/site/SitePage'
import { Card } from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { ABOUT } from '../data/about'
import { PATHS } from '../routes/paths'

interface TextSectionProps {
  title: string
  paragraphs: string[]
  points: string[]
}

function TextSection({ title, paragraphs, points }: TextSectionProps) {
  return (
    <Card className="h-full">
      <h2 className="text-2xl font-bold">{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-muted">
          {paragraph}
        </p>
      ))}
      {points.length > 0 && (
        <ul className="mt-5 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <Check size={20} strokeWidth={3} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function AboutPage() {
  const { problem, solution, sdg } = ABOUT

  return (
    <SitePage title="Sobre" description="Por que o Conta Certa existe e o que ele se propõe a resolver.">
      <div className="grid gap-5 lg:grid-cols-2">
        <TextSection {...problem} />
        <TextSection {...solution} />
      </div>

      <Card tone="brand" className="mt-5 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="grid size-28 shrink-0 place-items-center rounded-card bg-linear-to-b from-brand-light to-brand-dark text-center text-on-brand shadow-glow">
          <div>
            <p className="text-sm font-bold">ODS</p>
            <p className="text-5xl font-bold leading-none">{sdg.number}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            ODS {sdg.number}: {sdg.name}
          </h2>
          {sdg.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={PATHS.login} className={buttonClasses()}>
          Conhecer o app
        </Link>
        <Link to={PATHS.faq} className={buttonClasses({ variant: 'neutral' })}>
          Perguntas frequentes
        </Link>
      </div>
    </SitePage>
  )
}
