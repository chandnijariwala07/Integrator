import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import Message from 'components/Message/Message'
import { srv2mom } from 'services/dateconversion'
import { getLocale } from 'services/locale'
import '../assets/DateSign.scss'

const DateSign = ({ date }) => {
  const mmnt = srv2mom(date)
  mmnt.locale(getLocale())
  const diff = mmnt.diff(moment.utc(), 'days', true)
  if (diff < 0) return <div className='date-sign overdue' />
  return diff < 1
    ? (
      <div className='date-sign today'>
        <div className='time'>
          <span className='hour'>{mmnt.format('H')}</span>
          <span className='min'>{mmnt.format('mm')}</span>
        </div>
        <div className='caption'><Message id='general.today' /></div>
      </div>
    )
    : (
      <div className='date-sign soon'>
        <div className='day'>{mmnt.format('D')}</div>
        <div className='mon'>{mmnt.format('MMM')}</div>
      </div>
    )
}

DateSign.propTypes = {
  date: PropTypes.string
}

export default DateSign
