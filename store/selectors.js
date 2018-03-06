import { createSelector } from 'reselect'

const sort = (a, b) => {
  a = a.date || a.dueDate
  b = b.date || b.dueDate
  return a === b ? 0 : (a < b ? -1 : 1)
}

const germanLevel = vita => {
  if (vita.motherTongues && vita.motherTongues.includes('de')) return 'MotherTongue'
  const order = ['Beginner', 'A1', 'A2', 'Intermediate', 'B1', 'B2', 'Expert', 'C1', 'C2']
  const levels = [
    ...(vita.foreignLanguages || [])
      .filter(l => l.language === 'de')
      .map(l => order.findIndex(level => level === l.understanding)),
    ...(vita.germanLanguageTrainings || [])
      .filter(t => t.graduated)
      .map(t => order.findIndex(level => level === t.level)),
    order.findIndex(level => vita.integrationGraduated && level === vita.integrationLevel)
  ]
  const max = Math.max(...levels)
  return ~max ? order[max] : 'None'
}

const nextAppointment = appointments => {
  if (!appointments || !appointments.length) return
  return appointments.sort((a, b) => a.date < b.date ? -1 : b.date < a.date ? 1 : 0)[0]
}

const calculateStats = obj => {
  obj.stats = {
    german: germanLevel(obj.vita),
    appointment: nextAppointment(obj.appointments)
  }
  // if (obj.client) {
  //   obj.stats = {
  //     ...obj.stats
  //   }
  // } else {
  //   obj.stats = {
  //     ...obj.stats
  //   }
  // }
  return obj
}

export const selectClientsData = createSelector(
  state => state.integrator.clients,
  value => Object.values(value.vitae)
    .map(vita => calculateStats({
      isManaged: false,
      vita,
      client: value.clients[vita.userId] || false
    }))
    .concat(Object.entries(value.clients)
      .filter(([userId]) => value.vitae[userId] === undefined)
      .map(([userId, client]) => calculateStats({
        isManaged: true,
        vita: { userId },
        client
      }))
    )
    .map(data => calculateStats({
      ...data,
      tasks: value.tasks[data.vita.userId] || [],
      appointments: value.appointments[data.vita.userId] || [],
      messages: value.messages[data.vita.userId] || [],
      minutes: value.minutes[data.vita.userId] || {
        consultation: [],
        regulatory: [],
        networking: []
      }
    }))
)

export const selectAddressbook = createSelector(
  state => state.account.info.id,
  state => state.integrator.clients.people,
  (uid, people) => people.reduce((m, p) => {
    if (p.isShared) {
      p.sharing = 'shared'
    } else {
      p.sharing = uid === p.owner ? 'private' : 'hidden'
    }
    m[p.id] = p
    return m
  }, {})
)

export const selectCalendar = createSelector(
  state => state.integrator.clients.appointments,
  state => state.integrator.clients.tasks,
  (appointments, tasks) => {
    const x = Object.keys(appointments).reduce((array, client) =>
      array.concat(appointments[client].map(a => ({ ...a, client, type: 'appointment' }))), [])
    const y = Object.keys(tasks).reduce((array, client) =>
      array.concat(tasks[client].map(t => ({ ...t, client, type: 'task' }))), [])
    return x.concat(y).sort(sort)
  }
)
