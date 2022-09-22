import React, { useContext, useEffect, useRef, useReducer, useState, Fragment } from 'react'

import MenuButton from './menu-button'
import { useChildRefs, useWidth, usePrevious, useOverflow, useAccessibility } from '../effects'
import { immutableSplice } from '../utils'
import reducer, { initialState } from './reducer'
import { ThemeContext } from '../theme'
import { HorizontalMenuProps, MenuItem } from '../typings'

const overflowItem = (menu?: MenuItem[]): MenuItem => {
  return {
    label: '...',
    submenu: menu,
  }
}

const depth = 0
const HorizontalMenu = ({ menu, focused, currentWindow, menuBar, onOpen, onButtonHover }: HorizontalMenuProps) => {
  const theme = useContext(ThemeContext)
  const overflowRef = useRef<HTMLButtonElement>(null)
  const childRefs = useChildRefs<HTMLButtonElement>(menu)
  const overflow = useOverflow(menu, menuBar, childRefs, overflowRef, theme.enableOverflow)
  const [fixedMenu, updateFixedMenu] = useState(immutableSplice(menu, overflow.index, 0, overflowItem(overflow.menu)))
  const width = useWidth()
  const prevWidth = usePrevious(width)
  const [{ selectedPath, altKey, hovering }, dispatch] = useReducer(reducer, initialState)
  const isOpen = selectedPath[depth] >= 0

  useEffect(() => {
    updateFixedMenu(immutableSplice(menu, overflow.index, 0, overflowItem(overflow.menu)))
  }, [overflow])

  useEffect(() => {
    // close menu when focused away from window
    // close menu when resizing the window
    if ((!focused && selectedPath[depth] >= 0) || prevWidth !== width) {
      dispatch({ type: 'reset' })
    }
  }, [focused, width])

  useEffect(() => {
    onOpen?.(isOpen)
  }, [isOpen, onOpen])

  useEffect(() => {
    onButtonHover?.(hovering || altKey)
  }, [hovering, altKey, onButtonHover])

  // Pressing "Alt" should focus the first button
  useEffect(() => {
    let isSingleKeyPressed = true
    let keysPressed = 0
    let lastActive: HTMLElement | null = null

    const restoreFocus = (): boolean => {
      if (document.activeElement !== childRefs[0]?.current) {
        return false
      }

      childRefs[0]?.current?.blur()
      lastActive?.focus()
      lastActive = null
      return true
    }

    const onKeyDown = (): void => {
      keysPressed += 1

      isSingleKeyPressed = isSingleKeyPressed && keysPressed === 1
    }
    const onKeyUp = (e: KeyboardEvent): void => {
      const isLastKeyReleased = keysPressed === 1
      keysPressed = Math.max(0, keysPressed - 1)

      if (!isLastKeyReleased) {
        return
      }

      // More than one key was pressed, reset.
      if (!isSingleKeyPressed) {
        isSingleKeyPressed = true
        return
      }

      if (e.key === 'Escape') {
        restoreFocus()
        return
      }

      if (e.key === 'Alt') {
        if (restoreFocus()) {
          return
        }

        // Focus the first button
        lastActive = document.activeElement as HTMLElement | null
        childRefs[0]?.current?.focus()
        return
      }
    }

    const useCapture = true
    window.addEventListener('keydown', onKeyDown, useCapture)
    window.addEventListener('keyup', onKeyUp, useCapture)
    return () => {
      window.removeEventListener('keydown', onKeyDown, useCapture)
      window.removeEventListener('keyup', onKeyUp, useCapture)
    }
  }, [childRefs[0]?.current, dispatch])

  useAccessibility(fixedMenu, childRefs, selectedPath, dispatch, overflowRef, overflow, currentWindow)

  return (
    <Fragment>
      {fixedMenu.map((menuItem, i) => {
        const overflowButton = overflow.index === i
        const overflowedItem = i > overflow.index
        const currRef = overflowButton ? overflowRef : childRefs[overflowedItem ? i - 1 : i]
        const style = overflowButton
          ? {
              visibility: overflow.hide ? 'hidden' : 'visible',
            }
          : {}
        return (
          <MenuButton
            // eslint-disable-next-line react/no-array-index-key
            key={`${menuItem.label}-${depth}-${i}`}
            ref={currRef}
            focused={focused}
            idx={i}
            item={menuItem}
            currentWindow={currentWindow}
            style={style}
            depth={depth}
            selectedPath={selectedPath}
            dispatch={dispatch}
            altKey={altKey}
          />
        )
      })}
    </Fragment>
  )
}

export default HorizontalMenu
