import { ArrowRight, Check, SlidersHorizontal, Target, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { PATHS } from '../routes/paths'

interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

const BENEFITS: Benefit[] = [
  {
    icon: SlidersHorizontal,
    title: 'Controle de entradas e saídas',
    description: 'Registre o que entrou e o que saiu e veja para onde vai o seu dinheiro no mês.',
  },
  {
    icon: TriangleAlert,
    title: 'Alerta de juros acima da média',
    description: 'O app compara a taxa de cada dívida com a média do mercado e avisa quando está cara.',
  },
  {
    icon: Target,
    title: 'Plano para quitar suas dívidas',
    description: 'Diga quanto pode pagar por mês e receba a ordem de pagamento e a data prevista para ficar livre.',
  },
]

export function SiteHomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-20">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Organize seu dinheiro.
          <span className="block text-brand">Saia das dívidas.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">
          Gratuito, simples e feito para quem quer entender para onde vai o dinheiro e parar de pagar
          juros abusivos.
        </p>

        <ul className="mt-8 space-y-4">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex items-center gap-3">
              <Check size={22} strokeWidth={3} className="shrink-0 text-brand" aria-hidden="true" />
              {benefit.title}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={PATHS.login} className={buttonClasses({ size: 'lg', className: 'min-w-44' })}>
            Entrar
          </Link>
          {/* Ainda não existe tela de cadastro: por enquanto leva à tela de entrar */}
          <Link
            to={PATHS.login}
            className={buttonClasses({ variant: 'outline', size: 'lg', className: 'min-w-44' })}
          >
            Criar conta
          </Link>
        </div>
      </section>

      <section aria-labelledby="benefits-title" className="mt-16 md:mt-24">
        <h2 id="benefits-title" className="text-2xl font-bold md:text-3xl">
          O que o Conta Certa faz por você
        </h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <Card className="h-full">
                <span className="grid size-12 place-items-center rounded-control border border-brand bg-brand-muted text-brand">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <Card tone="brand" className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Quer entender o projeto?</h2>
            <p className="mt-1 text-sm text-muted">
              Veja o problema que queremos resolver e quem está por trás do Conta Certa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={PATHS.about} className={buttonClasses({ variant: 'white', size: 'sm' })}>
              Sobre o projeto
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to={PATHS.members} className={buttonClasses({ variant: 'neutral', size: 'sm' })}>
              Integrantes
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
