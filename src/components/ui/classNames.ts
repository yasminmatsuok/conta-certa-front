type ClassValue = string | false | null | undefined

/** Junta classes ignorando valores vazios: classNames('a', cond && 'b') */
export function classNames(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
