export type IconName =
  | 'pin'
  | 'crosshair'
  | 'pencil'
  | 'close'
  | 'menu'
  | 'share'
  | 'check'
  | 'arrow-left'
  | 'external'
  | 'sun'
  | 'moon'
  | 'eclipse'

export interface NavItem {
  label: string
  to?: string
  action?: 'about'
}
