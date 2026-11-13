import * as React from 'react'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 4000

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners = []
let memoryState = { toasts: [] }

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }
    case 'DISMISS_TOAST': {
      const { toastId } = action
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
    default:
      return state
  }
}

export function toast({ title, description, variant = 'default', duration = 3500 }) {
  const id = genId()

  const update = (props) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      id,
      title,
      description,
      variant,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  if (duration > 0) {
    setTimeout(() => {
      dismiss()
    }, duration)
  }

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}
