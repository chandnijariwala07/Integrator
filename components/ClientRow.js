import React from 'react'
import PropTypes from 'prop-types'
// import classnames from 'classnames'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { promote } from '../store/actionCreators'
import url from 'routes/tokens'
import DateSign from './DateSign'
import GermanLevel from './GermanLevel'
import FieldMissing from 'components/FieldMissing/FieldMissing'
import ProfilePhoto from '../components/ProfilePhoto'

import '../assets/ClientRow.scss'

const ClientRow = ({ data, dispatch, colleagues }) => {
  const { vita, client, stats } = data
  const handleSelectPlan = e => {
    e.stopPropagation()
    dispatch(push(`${url.integrator.clientview}/${vita.userId}/plan`))
  }
  const handleSelectAppointment = e => {
    e.stopPropagation()
    const link = stats.appointment
      ? `${url.integrator.clientview}/${vita.userId}/calendar/appointment/${stats.appointment.id}`
      : `${url.integrator.clientview}/${vita.userId}/calendar/appointment`
    dispatch(push(link))
  }
  const handlePromote = e => {
    e.stopPropagation()
    dispatch(promote(data))
  }
  const g1 = client ? client.targets.filter(t => t.state === 'Proposed').length : 0
  const g2 = client ? client.targets.filter(t => ['Agreed', 'InProgress'].includes(t.state)).length : 0
  const g3 = client ? client.targets.filter(t => t.state === 'Fulfilled').length : 0
  const g4 = client ? client.targets.filter(t => t.state === 'Missed').length : 0
  const max = client ? client.targets.length : 0 // Math.max(g1, g2, g3, g4)
  const invitee = colleagues.find(c => c.id === vita.invitedBy)
  const lastName = (client && client.lastName) || vita.lastName
  const firstName = (client && client.firstName) || vita.firstName
  const zip = (client && client.zip) || vita.zip
  const city = (client && client.city) || vita.city
  return <div className='client-row'>
    <div className='cell-photo'>
      <ProfilePhoto src={vita.photo} />
    </div>
    <div className='cell-personal'>
      <div className='name'>
        {lastName || <FieldMissing field='lastName' />}, {firstName || <FieldMissing field='firstName' />}
        {data.isManaged && <span className='label label-success pull-right'>Verwaltet</span>}
      </div>
      <div className='address'>
        {zip || <FieldMissing field='zip' />} {city || <FieldMissing field='city' />}
      </div>
    </div>
    {client ? (
      <div className='cell-completeness'>
        <a className='btn' onClick={handleSelectPlan}>
          {!max ||
            <div className='graph'>
              <div className='meter proposed'>
                <div style={{ height: `${100 * g1 / max}%` }} />
              </div>
              <div className='meter working'>
                <div style={{ height: `${100 * g2 / max}%` }} />
              </div>
              <div className='meter success'>
                <div style={{ height: `${100 * g3 / max}%` }} />
              </div>
              <div className='meter failed'>
                <div style={{ height: `${100 * g4 / max}%` }} />
              </div>
            </div>
          }
          <div className='caption'>
            {max
              ? `${max} Ziel${max === 1 ? '' : 'e'} ingesamt`
              : 'Bislang wurden keine Ziele angelegt.'}
          </div>
        </a>
      </div>
    ) : (
      <div className='cell-invite'>
        {vita.invitedBy ? (
          <span className='invited'>
            <small>Eingeladen von</small>
            {invitee.lastName}, {invitee.firstName}
          </span>
        ) : (
          <a className='btn btn-primary' onClick={handlePromote}>
            Als Klient einladen
          </a>
        )}
      </div>
    )}
    <div className='cell-language'>
      <GermanLevel level={stats.german} />
    </div>
    <div className='cell-appointment'>
      <a className='btn' onClick={handleSelectAppointment}>
        {stats.appointment
          ? <DateSign date={stats.appointment.date} />
          : <i className='fa fa-calendar-plus-o fa-2x' />}
      </a>
    </div>
    <div className='cell-traffic-light'>
      {!!client &&
      <div className='meter'>
        <div className={['low', 'mid', 'high'][client.prio || 0]} />
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 48'>
          <g fillRule='evenodd'>
            <path d='M0 0h16v48h-16v-48M8 2A6 6 0 1 0 8.01 2ZM8 18A6 6 0 1 0 8.01 18ZM8 34A6 6 0 1 0 8.001 34Z' />
          </g>
        </svg>
      </div>
      }
    </div>
    {/*
    <div className='cell-alert'>
      !(client.alerts && client.alerts.length) || <Button><i className='fa fa-2x fa-warning' /></Button>
    </div>
    */}
  </div>
}

ClientRow.propTypes = {
  dispatch: PropTypes.func.isRequired,
  colleagues: PropTypes.array.isRequired,
  data: PropTypes.shape({
    vita: PropTypes.object.isRequired,
    client: PropTypes.any,
    tasks: PropTypes.array,
    appointments: PropTypes.array,
    messages: PropTypes.array,
    stats: PropTypes.object.isRequired
  }).isRequired
}

const mapStateToProps = state => ({
  colleagues: state.integrator.clients.colleagues
})

export default connect(mapStateToProps)(ClientRow)
