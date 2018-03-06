import api from 'api'

export function load () {
  return dispatch => {
    dispatch({ type: 'LOAD_CLIENTS_STARTED' })
    return api.integrator.load()
      .then(payload => dispatch({ type: 'LOAD_CLIENTS_SUCCESS', payload }))
      .catch(payload => {
        return dispatch({ type: 'CLIENTS_FAILURE', payload })
      })
  }
}

function handleComplexChange (data, action) {
  return dispatch => {
    dispatch({ type: 'SAVE_CLIENTS_STARTED' })
    return action()
      .then(response => response.ok ? response.json() : Promise.reject(response.error()))
      .then(payload => {
        dispatch({ type: 'SAVE_CLIENTS_MAP_SUCCESS', payload })
        return Promise.resolve()
      })
      .catch(payload => dispatch({ type: 'CLIENTS_FAILURE', payload }))
  }
}

function handleMapPropertyChange (name, data, action) {
  return dispatch => {
    dispatch({ type: 'SAVE_CLIENTS_STARTED' })
    return action()
      .then(response => response.ok ? response.json() : Promise.reject(response.error()))
      .then(payload => {
        dispatch({ type: 'SAVE_CLIENTS_CLIENT_SUCCESS', name, id: data.vita.userId, payload: payload.data })
        return Promise.resolve(payload.inserted)
      })
      .catch(payload => dispatch({ type: 'CLIENTS_FAILURE', payload }))
  }
}

export function save (data) {
  return handleMapPropertyChange('clients', data, () => api.integrator.save(data))
}

export function promote (data) {
  return handleComplexChange(data, () => api.integrator.promote(data))
}

export function transfer (data) {
  return handleMapPropertyChange('clients', data, () => api.integrator.transfer(data))
}

export function comment (data, comment) {
  return handleMapPropertyChange('clients', data, () => api.integrator.comment(data, comment))
}

export function send (data) {
  return handleMapPropertyChange('clients', data, () => api.integrator.send(data))
}

export function printed (data) {
  return handleMapPropertyChange('clients', data, () => api.integrator.printed(data))
}

export function accept (data) {
  return handleMapPropertyChange('clients', data, () => api.integrator.accept(data))
}

export function reject (data) {
  return handleMapPropertyChange('clients', data, () => api.integrator.reject(data))
}

export function upsertAppointment (data, appointment) {
  return handleMapPropertyChange('appointments', data, () => api.integrator.upsertAppointment(data, appointment))
}

export function removeAppointment (data, appointment) {
  return handleMapPropertyChange('appointments', data, () => api.integrator.removeAppointment(data, appointment.id))
}

export function upsertTask (data, task) {
  return handleMapPropertyChange('tasks', data, () => api.integrator.upsertTask(data, task))
}

export function removeTask (data, task) {
  return handleMapPropertyChange('tasks', data, () => api.integrator.removeTask(data, task.id))
}

export function upsertMinute (data, minute) {
  return handleMapPropertyChange('minutes', data, () => api.integrator.upsertMinute(data, minute))
}

export function removeMinute (data, minute) {
  return handleMapPropertyChange('minutes', data, () => api.integrator.removeMinute(data, minute.id))
}

function handlePeopleChange (data, action) {
  return dispatch => {
    dispatch({ type: 'SAVE_CLIENTS_STARTED' })
    return action()
      .then(response => response.ok ? response.json() : Promise.reject(response.error()))
      .then(payload => {
        dispatch({ type: 'SAVE_CLIENTS_SUCCESS', payload: { people: payload.people } })
        return Promise.resolve(payload.inserted)
      })
      .catch(payload => dispatch({ type: 'CLIENTS_FAILURE', payload }))
  }
}

export function upsertPerson (data, person) {
  return handlePeopleChange(data, () => api.integrator.upsertPerson(data, person))
}

export function removePerson (data, person) {
  return handlePeopleChange(data, () => api.integrator.removePerson(data, person.id))
}

export function createClient (person) {
  return dispatch => {
    dispatch({ type: 'SAVE_CLIENTS_STARTED' })
    return api.integrator.create(person)
      .then(response => response.ok ? response.json() : Promise.reject(response.error()))
      .then(payload => {
        dispatch({
          type: 'SAVE_CLIENTS_CLIENT_SUCCESS',
          id: payload.inserted[0],
          name: 'clients',
          payload: payload.data
        })
        return Promise.resolve(payload.inserted)
      })
      .catch(payload => dispatch({ type: 'CLIENTS_FAILURE', payload }))
  }
}

// ---------------------------------------------------------------------------------------------------------------------

export function updateUserInfo (info) {
  return dispatch => {
    dispatch({ type: 'SAVE_USER_INFO_STARTED' })
    return api.integrator.updateUserInfo(info)
      .then(response => response.ok ? response.json() : Promise.reject(response.error()))
      .then(payload => {
        dispatch({ type: 'SAVE_USER_INFO_SUCCESS', payload })
      })
      .catch(e => {
        dispatch({ type: 'SAVE_USER_INFO_FAILURE', payload: e._error })
        return Promise.reject(e)
      })
  }
}
