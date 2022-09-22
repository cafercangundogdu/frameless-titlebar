import { useEffect, useCallback } from 'react'
import {
  isItemSubMenu,
  getSelectedItem,
  getValidItem,
  validNext,
  getCurrentRef,
  menuItemClick,
  validPrevious,
  splitLabel,
} from '../utils'
import { MenuItem, OverflowState } from '../typings'

const altKeyCodeMatch = (e: any, str?: string) => {
  const { letter } = splitLabel(str)
  return !!e.altKey && e.key === letter?.toLowerCase()
}

const depth = 0
const useAccessibility = (
  menu: MenuItem[],
  childRefs: React.RefObject<HTMLElement>[],
  selectedPath: number[],
  dispatch: any,
  overflowRef?: React.RefObject<HTMLElement>,
  overflow?: OverflowState,
  currentWindow?: object,
) => {
  const resetKeys = useCallback(() => {
    dispatch({
      type: 'alt',
      altKey: false,
    })
  }, [dispatch])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey) {
        dispatch({
          type: 'alt',
          altKey: true,
        })

        // if the keycode is not alt
        if (e.key !== 'Alt') {
          const firstIndex = menu!.findIndex((x) => !x.disabled && altKeyCodeMatch(e, x.label))
          if (firstIndex >= 0) {
            // only prevent default when alt key code match is found
            e.preventDefault()
            const maxIndex = Math.min(firstIndex, overflow && overflow.hide ? menu.length - 1 : menu.length)
            dispatch({
              type: 'button-set',
              depth,
              selected: maxIndex,
            })
          }
        }
        return
      }

      const current = selectedPath[depth]
      if (current < 0) return
      switch (e.key) {
        case 'Enter': {
          e.preventDefault()
          e.stopImmediatePropagation()
          const [selectedItem, selectedIndex, selectedMenu] = getSelectedItem(menu, selectedPath)
          if (isItemSubMenu(selectedItem)) {
            dispatch({
              type: 'set',
              depth: selectedPath.length + 1,
              selected: validNext(selectedItem.submenu!, -1),
            })
            break
          }
          menuItemClick(e, selectedIndex, selectedItem, selectedMenu, dispatch, currentWindow)
          break
        }
        case 'Escape': {
          e.preventDefault()
          const currRef = getCurrentRef(childRefs, current, overflow, overflowRef)
          currRef?.current?.blur()
          dispatch({ type: 'reset' })
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          const [next, selectedDepth] = getValidItem(menu, selectedPath)
          dispatch({
            type: 'set',
            depth: selectedDepth,
            selected: next,
          })
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          const [selectedItem] = getSelectedItem(menu, selectedPath)
          if (isItemSubMenu(selectedItem)) {
            dispatch({
              type: 'set',
              depth: selectedPath.length + 1,
              selected: validNext(selectedItem.submenu!, -1),
            })
            break
          }
          const next = validNext(menu, current, overflow && overflow.hide ? menu.length - 1 : overflow!.index + 1)
          dispatch({ type: 'button-set', depth, selected: next })
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const [prev, selectedDepth] = getValidItem(menu, selectedPath, true)
          dispatch({
            type: 'set',
            depth: selectedDepth,
            selected: prev,
          })
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          if (selectedPath.length <= 2) {
            const prev = validPrevious(menu, current, overflow && overflow.hide ? menu.length - 1 : overflow!.index + 1)
            dispatch({ type: 'button-set', depth, selected: prev })
            break
          }
          dispatch({ type: 'del', depth: selectedPath.length - 1 })
          break
        }
        default:
          /* do nothing */ break
      }
    },
    [menu, overflow, childRefs, overflowRef, selectedPath, currentWindow, dispatch],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', resetKeys)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', resetKeys)
    }
  }, [onKeyDown, resetKeys])
}

export default useAccessibility
