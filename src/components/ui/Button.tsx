import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from './classNames'

type ButtonVariant = 'primary' | 'white' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = verde, white = branco, outline = contorno verde */
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow hover:brightness-110',
  white: 'bg-linear-to-b from-white to-neutral-200 text-background hover:brightness-90',
  outline: 'border border-brand bg-transparent text-brand hover:bg-brand-muted',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-control font-bold transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
