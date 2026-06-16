export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  plain?: boolean
  round?: boolean
  circle?: boolean
  label?: string
}
