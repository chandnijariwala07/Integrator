import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { selectCalendar } from '../store/selectors'
import { upsertAppointment, removeAppointment, upsertTask, removeTask } from '../store/actionCreators'
import AppointmentModal from '../components/AppointmentModal'
import TaskModal from '../components/TaskModal'
import DateSign from '../components/DateSign'

import '../assets/style.scss'

const upsert = {
  appointment: upsertAppointment,
  task: upsertTask
}

const remove = {
  appointment: removeAppointment,
  task: removeTask
}

class CockpitCalendar extends React.Component {
  static propTypes = {
    calendar: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      modal: null,
      id: null
    }
  }

  render () {
    const { modal, id } = this.state
    const { calendar, dispatch } = this.props
    const select = (m, id) => this.setState({ modal: m || null, id: id || null })
    const evalValue = m => { if (modal === m) return id ? calendar.find(o => o.id === id) : {} }
    const createShow = (m, id) => () => { select(m, id) }
    const handleHide = () => { select() }
    const createSave = m => o => { dispatch(upsert[m]({}, o)) }
    const createDrop = m => o => { dispatch(remove[m]({}, o)) }
    return (
      <div className='cockpit-calendar'>
        <h4>Termine und Aufgaben</h4>
        {!calendar.length ||
          <ListGroup className='list'>
            {calendar.slice(0, 5).map((entry, i) =>
              <ListGroupItem key={i} onClick={createShow(entry.type, entry.id)}>
                <DateSign date={entry.date || entry.dueDate} />
                <div className='details'>
                  <h5>{entry.subject}</h5>
                </div>
              </ListGroupItem>
            )}
          </ListGroup>
        }

        <div className='buttons'>
          <AppointmentModal
            appointment={evalValue('appointment')}
            onShow={createShow('appointment')}
            onHide={handleHide}
            onSave={createSave('appointment')}
            onDrop={createDrop('appointment')} />
          <TaskModal
            task={evalValue('task')}
            onShow={createShow('task')}
            onHide={handleHide}
            onSave={createSave('task')}
            onDrop={createDrop('task')} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  calendar: selectCalendar(state)
})
export default connect(mapStateToProps)(CockpitCalendar)
