/**
 * Cliente HTTP do app, feito com fetch nativo (sem Axios).
 * A URL da API vem de VITE_API_URL (veja .env.example).
 */
const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function request<TResponse>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Erro ${response.status} ao acessar ${path}`)
  }

  // 204 No Content: não há corpo para ler
  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

export const api = {
  get: <TResponse>(path: string) => request<TResponse>('GET', path),
  post: <TResponse>(path: string, body: unknown) => request<TResponse>('POST', path, body),
  put: <TResponse>(path: string, body: unknown) => request<TResponse>('PUT', path, body),
  patch: <TResponse>(path: string, body: unknown) => request<TResponse>('PATCH', path, body),
  delete: <TResponse = void>(path: string) => request<TResponse>('DELETE', path),
}
