import { Check, Info, Star } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FormMessage,
  LoadingState,
  ProgressBar,
  QuickCard,
} from '../components/ui'
import { classNames } from '../components/ui/classNames'
import { useAsync } from '../hooks/useAsync'
import { getErrorMessage } from '../services/api'
import { completeLesson, listTracks } from '../services/learningService'
import type { LearningTrack } from '../types/learning'

function countCompleted(track: LearningTrack): number {
  return track.lessons.filter((lesson) => lesson.completed).length
}

function isFinished(track: LearningTrack): boolean {
  return track.lessons.length > 0 && countCompleted(track) === track.lessons.length
}

/** Trilha em destaque: a escolhida; senão a que está em andamento; senão a primeira não concluída */
function pickCurrentTrack(tracks: LearningTrack[], selectedId: number | null): LearningTrack | undefined {
  return (
    tracks.find((track) => track.id === selectedId) ??
    tracks.find((track) => countCompleted(track) > 0 && !isFinished(track)) ??
    tracks.find((track) => !isFinished(track)) ??
    tracks[0]
  )
}

export function LearnPage() {
  const [searchParams] = useSearchParams()
  // /app/aprender?trilha=3 abre direto na trilha 3
  const trackParam = Number(searchParams.get('trilha'))
  const [selectedId, setSelectedId] = useState<number | null>(trackParam > 0 ? trackParam : null)

  const load = useCallback((signal: AbortSignal) => listTracks(signal), [])
  const { state, reload, setData } = useAsync(load)

  const tracks = state.status === 'success' ? state.data : []
  const current = pickCurrentTrack(tracks, selectedId)

  function handleTrackUpdated(updated: LearningTrack) {
    setData(tracks.map((track) => (track.id === updated.id ? updated : track)))
  }

  return (
    <>
      <PageHeader title="Aprender" description="Lições curtas, em linguagem simples, sobre dinheiro." />

      {state.status === 'loading' && <LoadingState label="Carregando trilhas..." />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' && !current && (
        <EmptyState
          title="Nenhuma trilha disponível"
          description="As trilhas de aprendizado aparecem aqui assim que forem publicadas."
        />
      )}
      {state.status === 'success' && current && (
        <div className="grid items-start gap-5 xl:grid-cols-3">
          <TrackDetail key={current.id} track={current} onUpdated={handleTrackUpdated} />

          <section aria-labelledby="other-tracks" className="space-y-4">
            <h2 id="other-tracks" className="font-bold">
              Outras trilhas
            </h2>
            {tracks.length === 1 && <p className="text-sm text-muted">Ainda não há outras trilhas.</p>}
            {tracks
              .filter((track) => track.id !== current.id)
              .map((track) => {
                const completed = countCompleted(track)
                const finished = isFinished(track)
                return (
                  <QuickCard
                    key={track.id}
                    onClick={() => setSelectedId(track.id)}
                    icon={
                      finished ? <Check size={22} aria-hidden="true" /> : <Star size={22} aria-hidden="true" />
                    }
                    title={track.title}
                    subtitle={`${completed} de ${track.lessons.length} lições${finished ? ' · concluída' : ''}`}
                  >
                    <ProgressBar
                      size="sm"
                      className="mt-2"
                      label={`Progresso de ${track.title}`}
                      value={completed}
                      max={track.lessons.length}
                    />
                  </QuickCard>
                )
              })}
          </section>
        </div>
      )}
    </>
  )
}

interface TrackDetailProps {
  track: LearningTrack
  /** Recebe a trilha atualizada pela API depois de concluir uma lição */
  onUpdated: (track: LearningTrack) => void
}

function TrackDetail({ track, onUpdated }: TrackDetailProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = track.lessons.length
  const completed = countCompleted(track)
  const nextLesson = track.lessons.find((lesson) => !lesson.completed)
  const statusLabel = completed === 0 ? 'Não iniciada' : completed === total ? 'Concluída' : 'Em andamento'

  async function handleComplete(lessonId: number) {
    setSaving(true)
    setError(null)
    try {
      onUpdated(await completeLesson(track.id, lessonId))
    } catch (caught) {
      setError(`Não foi possível registrar a lição. ${getErrorMessage(caught)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="xl:col-span-2">
      <Badge tone={completed === 0 ? 'outline' : 'brand'}>{statusLabel}</Badge>
      <h2 className="mt-3 text-2xl font-bold md:text-3xl">{track.title}</h2>
      <p className="mt-1 text-muted">
        {total} {total === 1 ? 'lição' : 'lições'} · cerca de {track.minutesPerLesson} minutos cada
      </p>

      <ProgressBar className="mt-5" label={`Progresso de ${track.title}`} value={completed} max={total} />
      <p className="mt-2 text-sm text-muted">
        {completed} de {total} {completed === 1 ? 'concluída' : 'concluídas'}
      </p>

      {total === 0 ? (
        <p className="py-8 text-center text-sm text-muted">Esta trilha ainda não tem lições.</p>
      ) : (
        <ol className="mt-4 divide-y divide-border border-b border-border">
          {track.lessons.map((lesson) => {
            const isNext = lesson.id === nextLesson?.id
            return (
              <li key={lesson.id} className="flex flex-wrap items-center gap-4 py-4">
                <span
                  className={classNames(
                    'grid size-8 shrink-0 place-items-center rounded-pill',
                    lesson.completed && 'bg-brand text-on-brand',
                    !lesson.completed && (isNext ? 'border-2 border-brand' : 'border-2 border-border-strong'),
                  )}
                >
                  {lesson.completed && <Check size={18} strokeWidth={3} aria-label="Concluída" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-lg">{lesson.title}</p>
                  <p className="text-sm text-muted">{lesson.summary}</p>
                </div>
                {isNext && (
                  <Button size="sm" disabled={saving} onClick={() => handleComplete(lesson.id)}>
                    {saving ? 'Salvando...' : 'Continuar'}
                  </Button>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {error && (
        <FormMessage kind="error" className="mt-4">
          {error}
        </FormMessage>
      )}

      {track.tip && (
        <div className="mt-8 flex items-center gap-4 rounded-control border border-brand px-4 py-3">
          <Info size={28} className="shrink-0 text-brand" aria-hidden="true" />
          <div>
            <p className="font-bold">Dica</p>
            <p className="text-sm">{track.tip}</p>
          </div>
        </div>
      )}
    </Card>
  )
}
