/**
 * Cliente HTTP do app, feito só com a Fetch API (sem Axios).
 * A URL base vem de VITE_API_URL, definida no arquivo .env (veja .env.example).
 */
import { getSession } from './session'

const BASE_URL =(import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export class ApiError extends Error {
  /** Status HTTP da resposta; 0 quando a API nem respondeu (fora do ar, sem rede, CORS) */
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  body?: unknown
  /** Permite cancelar a requisição quando a tela é fechada */
  signal?: AbortSignal
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Usa o campo "message" do corpo de erro da API, se existir */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string' &&
      data.message.length > 0
    ) {
      return data.message
    }
  } catch {
    // corpo vazio ou que não é JSON: cai na mensagem padrão
  }
  return `A API respondeu com erro ${response.status}.`
}

async function request<TResponse>(
  method: HttpMethod,
  path: string,
  { body, signal }: RequestOptions = {},
): Promise<TResponse> {
  let response: Response
  // Depois do login, o token vai em todas as requisições
  const token = getSession()?.token

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique se ela está no ar.')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  // 204 No Content: não há corpo para ler
  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

export const api = {
  get: <TResponse>(path: string, signal?: AbortSignal) =>
    request<TResponse>('GET', path, { signal }),
  post: <TResponse>(path: string, body?: unknown) => request<TResponse>('POST', path, { body }),
  put: <TResponse>(path: string, body: unknown) => request<TResponse>('PUT', path, { body }),
  patch: <TResponse>(path: string, body: unknown) => request<TResponse>('PATCH', path, { body }),
  delete: <TResponse = void>(path: string) => request<TResponse>('DELETE', path),
}

/** Texto de erro pronto para mostrar na tela */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) return error.message
  return 'Algo deu errado. Tente de novo.'
}
