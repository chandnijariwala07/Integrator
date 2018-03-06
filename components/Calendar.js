import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { upsertAppointment, removeAppointment, upsertTask, removeTask } from '../store/actionCreators'
import { srv2mom } from 'services/dateconversion'
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
import Markdown from 'components/Markdown/Markdown'
import Message from 'components/Message/Message'
import AppointmentModal, { formatReminders } from './AppointmentModal'
import TaskModal from './TaskModal'
import DateSign from './DateSign'

import '../assets/Calendar.scss'

const upsert = {
  appointment: upsertAppointment,
  task: upsertTask
}

const remove = {
  appointment: removeAppointment,
  task: removeTask
}

const Calendar = ({ data, modal, id, select, dispatch, userInfo, colleagues }) => {
  const { tasks, appointments } = data
  const evalValue = m => { if (modal === m) return id ? data[`${m}s`].find(o => o.id === id) : {} }
  const formatColleague = c =>
    <span className={classnames('label label-default pull-right')}>
      Von {c.lastName}, {c.firstName}
    </span>
  const colleague = id => id === userInfo.id
    ? <span className={classnames('label label-primary pull-right')}>Von mir</span>
    : formatColleague(colleagues.find(c => c.id === id))
  const createShow = (m, id) => () => { select(m, id) }
  const handleHide = () => { select() }
  const createSave = m => o => { dispatch(upsert[m](data, o)) }
  const createDrop = m => o => { dispatch(remove[m](data, o)) }
  return <Row className='padd-t-20 integrator-calendar'>
    <Col xs={6}>
      <h4><Message id='integrator.details.tasks.appointments.label' /></h4>
      {!appointments.length ||
        <ListGroup className='appointments'>
          {appointments.map((a, i) =>
            <ListGroupItem key={i} onClick={createShow('appointment', a.id)}>
              {colleague(a.owner)}
              <DateSign date={a.date} />
              <div className='details'>
                <h5>{a.subject}</h5>
                <div><i className='fa fa-map-marker' /> {a.location}</div>
                {(a.reminder || a.reminder === 0) &&
                <div><i className='fa fa-clock-o' /> {formatReminders(a.reminder)}</div>}
              </div>
            </ListGroupItem>
          )}
        </ListGroup>
      }
      {!appointments.length &&
        <Markdown id='integrator.details.tasks.appointments.empty' />}
      <AppointmentModal appointment={evalValue('appointment')}
        onShow={createShow('appointment')}
        onHide={handleHide}
        onSave={createSave('appointment')}
        onDrop={createDrop('appointment')}
      />
    </Col>
    <Col xs={6}>
      <h4><Message id='integrator.details.tasks.tasks.label' /></h4>
      {!tasks.length ||
        <ListGroup className='tasks'>
          {tasks.map((t, i) =>
            <ListGroupItem key={i} onClick={createShow('task', t.id)}>
              {colleague(t.owner)}
              {!t.doneDate && t.dueDate && <DateSign date={t.dueDate} />}
              <div className={classnames('details', {done: t.doneDate})}>
                <h5>{t.subject}</h5>
                {t.createdDate && <div className='created'>
                  <i className='fa fa-flag-o' /> {srv2mom(t.createdDate).format('L')}
                </div>}
                {t.doneDate && <div className='done'>
                  <i className='fa fa-flag-checkered' /> {srv2mom(t.doneDate).format('L')}
                </div>}
                {!t.doneDate && t.dueDate && (srv2mom(t.dueDate).isBefore()
                  ? <div className='overdue'>
                    <i className='fa fa-warning' /> {srv2mom(t.dueDate).format('L')}
                  </div>
                  : <div className='due'>
                    <i className='fa fa-flag' /> {srv2mom(t.dueDate).format('L')}
                  </div>
                )}
              </div>
            </ListGroupItem>
          )}
        </ListGroup>
      }
      {!tasks.length &&
        <Markdown id='integrator.details.tasks.tasks.empty' />}
      <TaskModal task={evalValue('task')}
        onShow={createShow('task')}
        onHide={handleHide}
        onSave={createSave('task')}
        onDrop={createDrop('task')}
      />
    </Col>
  </Row>
}

Calendar.propTypes = {
  data: PropTypes.shape({
    tasks: PropTypes.array.isRequired,
    appointments: PropTypes.array.isRequired
  }).isRequired,
  modal: PropTypes.string,
  id: PropTypes.string,
  select: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
  colleagues: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default Calendar
