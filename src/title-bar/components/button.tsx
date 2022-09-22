import React, { useRef, useEffect } from 'react'
import { useRect, useHoverWithRef, useClickAway } from '../effects'
import Overlay from './overlay'
import { MenuButtonTheme } from '../typings'
import styles from '../../assets/style.module.css'

const getBackgroundColor = (
  disabled: boolean,
  selected: boolean,
  hovering: boolean,
  theme: Required<MenuButtonTheme>,
): string => {
  if (!disabled) {
    if (selected) {
      return theme.active!.background!
    }

    if (hovering) {
      return theme.hover!.background!
    }
  }

  return theme.default!.background!
}

const getColor = (disabled: boolean, open: boolean, theme: Required<MenuButtonTheme>): string => {
  if (open && !disabled) {
    return theme.active!.color!
  }
  return theme.default!.color!
}

const getOpacity = (
  disabled: boolean,
  focused: boolean,
  inActiveOpacity: number,
  theme: Required<MenuButtonTheme>,
): number => {
  if (!focused) {
    return inActiveOpacity!
  }

  if (disabled) {
    return theme.disabledOpacity!
  }

  return 1
}

interface ButtonProps {
  label: React.ReactNode
  ariaLabel?: string
  children: React.ReactNode
  open: boolean
  focused: boolean
  myRef?: React.RefObject<HTMLButtonElement>
  onOverlayClick: () => void
  onClick: (e: React.MouseEvent) => void
  onHover?: (hovering: boolean) => void
  theme: Required<MenuButtonTheme>
  inactiveOpacity: number
  style?: React.CSSProperties
  disabled: boolean
  hideOverlay?: boolean
}

const Button = ({
  myRef,
  onOverlayClick,
  theme,
  label,
  ariaLabel,
  children,
  open,
  inactiveOpacity,
  focused,
  onClick,
  style,
  disabled,
  hideOverlay,
  onHover,
}: ButtonProps) => {
  myRef = myRef ?? useRef(null)
  const bounds = useRect(myRef)
  const hovering = useHoverWithRef(myRef)

  useClickAway(myRef, () => {
    if (open) {
      onOverlayClick()
    }
  })

  useEffect(() => {
    onHover && onHover(hovering)
  }, [hovering])

  const backgroundColor = getBackgroundColor(disabled, open, hovering, theme)
  const color = getColor(disabled, open, theme)
  const opacity = getOpacity(disabled, focused, inactiveOpacity, theme)

  return (
    <div
      className={styles.MenuButtonContainer}
      style={{
        ...(style ?? {}),
        backgroundColor,
      }}
    >
      <div className={styles.MenuButtonWrapper}>
        <button
          className={styles.MenuButton}
          ref={myRef}
          style={{
            color,
            maxWidth: theme.maxWidth,
          }}
          onClick={onClick}
          tabIndex={0}
          aria-haspopup
          aria-label={ariaLabel}
        >
          <div className={styles.MenuButtonLabelWrapper} style={{ opacity, maxWidth: theme.maxWidth }}>
            {label}
          </div>
        </button>
      </div>
      {open && !hideOverlay && <Overlay top={bounds.bottom} />}
      {open && children}
    </div>
  )
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <Button {...props} myRef={ref as React.RefObject<HTMLButtonElement>} />
})
