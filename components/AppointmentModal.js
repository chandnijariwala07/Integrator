import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { translate } from 'services/locale'
import { Modal, Button } from 'react-bootstrap'
import { srv2mom, mom2srv } from 'services/dateconversion'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import Message from 'components/Message/Message'
import Select from 'components/Select/Select'

export const formatReminders = tspan => {
  if (tspan === 0) return 'Zum Ereigniszeitpunkt'
  if (tspan < 60) return `${tspan} Minuten vorher`
  if (tspan === 60) return '1 Stunde vorher'
  if (tspan < 1440) return `${tspan / 60} Stunden vorher`
  if (tspan === 1440) return `am Vortag`
  return 'Keine Erinnerung'
}

const Reminders = [0, 5, 10, 15, 20, 30, 45, 60, 120, 240, 1440]
  .map(id => ({ id, label: formatReminders(id) }))

class AppointmentModal extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    appointment: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    id: PropTypes.string
  }

  _handleSubmit = values => {
    const { dispatch, resetForm, onSave, id, onHide } = this.props
    const [hour, minute] = values.time.split(':').map(n => parseInt(n))
    values.date.set({ hour, minute })
    onSave({
      id,
      subject: values.subject,
      date: mom2srv(values.date),
      location: values.location,
      reminder: values.reminder
    })
    onHide()
    dispatch(resetForm)
  }

  render () {
    const {
      appointment,
      onShow,
      onHide,
      fields: { subject, date, time, location, reminder, confirm },
      handleSubmit,
      handleRemove
    } = this.props
    return (
      <div className='appointment-modal-container'>
        <Button bsStyle='success' onClick={onShow}>
          <i className='fa fa-calendar-plus-o' />{' '}
          <Message id='integrator.details.tasks.appointments.button' />
        </Button>

        <Modal show={!!appointment} onHide={onHide} container={this} aria-labelledby='appointments' bsStyle='sm'
          className='appointment-modal'>
          <form onSubmit={handleSubmit(this._handleSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title id='appointments-title'>
                {appointment && appointment.id
                  ? <Message id='integrator.details.tasks.appointments.update' />
                  : <Message id='integrator.details.tasks.appointments.insert' />}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <TextInput field={subject} label={'Betreff'} placeholder={'Bitte Betreff eingeben'} />
              <div className='datetime-picker'>
                <DatePicker field={date} label={'Zeitpunkt'} placeholder={'Bitte wählen'} className='date' />
                <TextInput field={time} label={'\u00a0'} placeholder='00:00' className='time' />
              </div>
              <TextInput field={location} label={'Ort'} placeholder={'Bitte Ort eingeben'} />
              <Select field={reminder} label={'Erinnerung'} entries={Reminders} placeholder='Keine Erinnerung' />

              {appointment && appointment.id && <div>
                <hr />
                <Button bsStyle='danger' onClick={handleRemove} disabled={!confirm.value}>
                  <i className='fa fa-trash' />{' '}
                  <Message id='integrator.details.tasks.appointments.remove' />
                </Button>
                <CheckboxInput field={confirm} label={<Message id='integrator.details.tasks.appointments.confirm' />} />
              </div>}
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={onHide}><Message id='general.cancel' /></Button>
              <Button active className='btn-theme' type='submit'><Message id='general.save' /></Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    )
  }
}

const config = {
  form: 'IntegratorAppointmentForm',
  fields: ['subject', 'date', 'time', 'location', 'reminder', 'confirm'],
  validate: values => {
    const errors = {}
    if (!values.subject) errors.subject = translate('field.error.required')
    if (!values.date) errors.date = translate('field.error.required')
    if (values.time) {
      if (!values.time.match(/\d?\d:\d\d/)) {
        errors.time = translate('field.error.format', { mask: '13:37' })
      } else {
        const [h, m] = values.time.split(':').map(n => parseInt(n))
        if (!(h < 24 && m < 60)) errors.time = translate('field.error.invalid')
      }
    } else {
      errors.time = translate('field.error.required')
    }
    if (!values.location) errors.location = translate('field.error.required')
    return errors
  }
}

const mapStateToProps = (state, ownProps) => {
  const appointment = ownProps.appointment || {}
  const id = appointment.id
  const handleRemove = e => {
    ownProps.onDrop({ id })
    ownProps.onHide()
  }
  const subject = appointment.subject || ''
  const date = appointment.date ? srv2mom(appointment.date) : ''
  const time = appointment.date ? date.format('HH:mm') : ''
  const location = appointment.location || ''
  const reminder = appointment.reminder || undefined
  const confirm = false
  return { id, initialValues: { subject, date, time, location, reminder, confirm }, handleRemove }
}

export default reduxForm(config, mapStateToProps)(AppointmentModal)
