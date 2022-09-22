export type MenuState = {
  selectedPath: number[]
  altKey: boolean
  hovering: boolean
}

export type MenuAction =
  | { type: 'alt'; altKey: boolean }
  | { type: 'reset' }
  | { type: 'del'; depth: number }
  | {
      type: 'set' | 'hover-sub' | 'button-set'
      depth: number
      selected: number
    }
  | { type: 'hovering'; hovering: boolean }

export const initialState: MenuState = {
  selectedPath: [-1],
  altKey: false,
  hovering: false,
}

const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'alt': {
      return {
        ...state,
        altKey: action.altKey,
      }
    }
    case 'reset': {
      return {
        ...state,
        selectedPath: [-1],
      }
    }
    case 'set': {
      return {
        ...state,
        selectedPath: [...state.selectedPath.slice(0, action.depth), action.selected],
      }
    }
    case 'del': {
      return {
        ...state,
        selectedPath: state.selectedPath.slice(0, action.depth),
      }
    }
    case 'hovering': {
      return {
        ...state,
        hovering: action.hovering,
      }
    }
    case 'button-set':
    case 'hover-sub': {
      // when clicking already opened menu - close it
      if (state.selectedPath[action.depth] === action.selected) {
        return {
          ...state,
          selectedPath: [...state.selectedPath.slice(0, action.depth), -1],
        }
      }

      // when hovering over a sub menu add -1 for the sub menu
      return {
        ...state,
        selectedPath: [...state.selectedPath.slice(0, action.depth), action.selected, -1],
      }
    }
    default:
      return state
  }
}

export default menuReducer
