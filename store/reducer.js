import State from 'redux/state'

const ACTION_HANDLERS = {
  LOGOUT: () => ({ ...initialState }),

  LOAD_CLIENTS_STARTED: (state, action) => ({
    ...state,
    clients: {
      ...initialState.clients,
      state: State.loading,
      error: null
    }
  }),

  LOAD_CLIENTS_SUCCESS: (state, action) => ({
    ...state,
    clients: {
      ...state.clients,
      ...action.payload,
      state: State.present,
      error: null
    }
  }),

  SAVE_CLIENTS_STARTED: (state, action) => ({
    ...state,
    clients: {
      ...state.clients,
      state: State.storing,
      error: null
    }
  }),

  SAVE_CLIENTS_CLIENT_SUCCESS: (state, action) => ({
    ...state,
    clients: {
      ...state.clients,
      [action.name]: {
        ...state.clients[action.name],
        [action.id]: action.payload
      },
      state: State.present,
      error: null
    }
  }),

  SAVE_CLIENTS_MAP_SUCCESS: (state, action) => ({
    ...state,
    clients: {
      ...Object.entries(action.payload)
        .reduce(
          (clients, [key, value]) => ({
            ...clients,
            [key]: {...clients[key], ...value}
          }),
          state.clients
        ),
      state: State.present,
      error: null
    }
  }),

  SAVE_CLIENTS_SUCCESS: (state, action) => ({
    ...state,
    clients: {
      ...state.clients,
      ...action.payload,
      state: State.present,
      error: null
    }
  }),

  CLIENTS_FAILURE: (state, action) => ({
    ...state,
    clients: {
      ...initialState.clients,
      state: State.failure,
      error: action.payload
    }
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  clients: {
    vitae: {},
    clients: {},
    tasks: {},
    appointments: {},
    messages: {},
    people: [],
    colleagues: [],
    minutes: {},
    integrators: [],
    state: State.initial,
    error: null
  }
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
