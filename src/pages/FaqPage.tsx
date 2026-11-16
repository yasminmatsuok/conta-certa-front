import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SitePage } from '../components/site/SitePage'
import { classNames } from '../components/ui/classNames'
import { FAQ_ITEMS } from '../data/faq'
import { PATHS } from '../routes/paths'

export function FaqPage() {
  // Acordeão: uma pergunta aberta por vez; null = todas fechadas
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SitePage title="Perguntas frequentes" description="As dúvidas mais comuns sobre o Conta Certa.">
      <div className="max-w-3xl space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const open = openIndex === index
          const buttonId = `faq-button-${index}`
          const panelId = `faq-panel-${index}`

          return (
            <div
              key={item.question}
              className={classNames(
                'rounded-card border bg-linear-to-b from-surface-raised to-surface transition-colors',
                open ? 'border-brand' : 'border-border',
              )}
            >
              <h2>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-card px-5 py-4 text-left text-lg font-bold"
                >
                  {item.question}
                  <ChevronDown
                    size={22}
                    aria-hidden="true"
                    className={classNames('shrink-0 text-brand transition-transform', open && 'rotate-180')}
                  />
                </button>
              </h2>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
                <p className="px-5 pb-5 text-muted">{item.answer}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-muted">
        Não achou sua dúvida?{' '}
        <Link to={PATHS.contact} className="font-bold text-brand hover:underline">
          Fale com a gente
        </Link>
        .
      </p>
    </SitePage>
  )
}
