import React, { useContext, useRef, useCallback } from 'react'
import { ThemeContext } from '../theme'
import styles from '../../assets/style.module.css'
import { BarProps } from '../typings'
import cx from 'classnames'

const Bar = ({ onDoubleClick, children, bottomBar, className }: BarProps) => {
  const {
    platform,
    bar: { height, borderBottom, background, fontFamily, color },
    menu: { style },
  } = useContext(ThemeContext)
  const ref = useRef(null)
  const dblClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target == ref.current) {
        onDoubleClick && onDoubleClick(e)
      }
    },
    [ref.current, onDoubleClick],
  )
  const isDarwin = platform === 'darwin'
  return (
    <div
      className={cx(styles.Bar, className)}
      ref={ref}
      style={{
        borderBottom: style === 'stacked' && !bottomBar ? '' : borderBottom,
        background,
        color,
        height,
        fontFamily,
        ...(isDarwin
          ? {
              paddingLeft: '70px',
              paddingRight: '70px',
            }
          : {}),
      }}
      onDoubleClick={dblClick}
    >
      {children}
    </div>
  )
}

export default Bar
