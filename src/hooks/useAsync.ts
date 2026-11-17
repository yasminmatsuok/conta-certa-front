import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api'

export type AsyncState<TData> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: TData }

type SettledState<TData> = Exclude<AsyncState<TData>, { status: 'loading' }>

/** Resultado guardado junto com a busca que o gerou, para saber se ainda vale */
interface StoredResult<TData> {
  load: (signal: AbortSignal) => Promise<TData>
  attempt: number
  state: SettledState<TData>
}

interface UseAsyncResult<TData> {
  state: AsyncState<TData>
  /** Busca de novo (botão "Tentar de novo", ou depois de salvar algo) */
  reload: () => void
  /** Troca os dados na tela sem buscar de novo (depois de salvar algo) */
  setData: (data: TData) => void
}

/**
 * Busca dados de um service e controla os estados de carregando, erro e sucesso.
 * `load` precisa ser estável (useCallback): a busca roda de novo sempre que ele muda.
 */
export function useAsync<TData>(
  load: (signal: AbortSignal) => Promise<TData>,
): UseAsyncResult<TData> {
  const [result, setResult] = useState<StoredResult<TData> | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    // Promise.resolve().then(...) faz um erro lançado logo no começo do load (ex.: sessão
    // que sumiu) virar estado de erro na tela, em vez de derrubar a página inteira.
    Promise.resolve()
      .then(() => load(controller.signal))
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ load, attempt, state: { status: 'success', data } })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ load, attempt, state: { status: 'error', message: getErrorMessage(error) } })
        }
      })

    // Cancela a requisição se a tela fechar ou os parâmetros mudarem
    return () => controller.abort()
  }, [load, attempt])

  // Enquanto o resultado guardado não for da busca atual, a tela está carregando.
  // Exceção: num reload (mesma busca, nova tentativa) os dados antigos continuam na tela
  // até os novos chegarem, para a lista não piscar nem perder mensagens já mostradas.
  const isCurrent = result !== null && result.load === load && result.attempt === attempt
  const isRefreshing = result !== null && result.load === load && result.state.status === 'success'
  const state: AsyncState<TData> = isCurrent || isRefreshing ? result.state : { status: 'loading' }

  const reload = useCallback(() => setAttempt((current) => current + 1), [])
  const setData = useCallback(
    (data: TData) => setResult({ load, attempt, state: { status: 'success', data } }),
    [load, attempt],
  )

  return { state, reload, setData }
}
