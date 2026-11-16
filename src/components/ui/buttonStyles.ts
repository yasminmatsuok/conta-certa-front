import { classNames } from './classNames'

/** primary = verde, white = branco, outline = contorno verde, neutral = contorno branco */
export type ButtonVariant = 'primary' | 'white' | 'outline' | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow hover:brightness-110',
  white: 'bg-linear-to-b from-white to-neutral-200 text-background hover:brightness-90',
  outline: 'border border-brand bg-transparent text-brand hover:bg-brand-muted',
  neutral: 'border border-foreground bg-transparent text-foreground hover:bg-surface-raised',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-base',
}

/** Classes de botão, para usar também em <Link> com cara de botão */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return classNames(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-bold transition',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )
}
