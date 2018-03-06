import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { translate } from 'services/locale'
import { srv2mom, mom2srv, now } from 'services/dateconversion'
import { Modal, Button } from 'react-bootstrap'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import Message from 'components/Message/Message'

class TaskModal extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    task: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    id: PropTypes.string
  }

  _handleSubmit = values => {
    const { dispatch, resetForm, onSave, id, onHide } = this.props
    onSave({
      id,
      subject: values.subject,
      dueDate: mom2srv(values.dueDate),
      doneDate: mom2srv(values.doneDate)
    })
    onHide()
    dispatch(resetForm)
  }

  render () {
    const {
      task,
      onShow,
      onHide,
      fields: { subject, dueDate, doneDate },
      handleSubmit,
      handleRemove
    } = this.props
    return (
      <div className='task-modal-container'>
        <Button bsStyle='success' onClick={onShow}>
          <i className='fa fa-list' />{' '}
          <Message id='integrator.details.tasks.tasks.button' />
        </Button>

        <Modal show={!!task} onHide={onHide} container={this} aria-labelledby='tasks' bsStyle='sm'
          className='task-modal'>
          <form onSubmit={handleSubmit(this._handleSubmit)}>
            <Modal.Header closeButton>
              <Modal.Title id='tasks-title'>
                {task && task.id
                  ? <Message id='integrator.details.tasks.tasks.update' />
                  : <Message id='integrator.details.tasks.tasks.insert' />
                }
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <TextInput field={subject} label='Betreff' placeholder='Bitte Betreff eingeben' />
              <DatePicker field={dueDate} label='Fällig am' placeholder='Bitte wählen' />

              {task && task.id && <div>
                <hr />
                {doneDate.value ? (
                  <Button onClick={() => doneDate.onChange(null)} bsStyle='default' block>
                    <i className='fa fa-square-o' /> Auf unerledigt setzen
                  </Button>
                ) : (
                  <Button onClick={() => doneDate.onChange(now())} bsStyle='success' block>
                    <i className='fa fa-check-square-o' /> Als erledigt markieren
                  </Button>
                )}
              </div>}

              {task && task.id && <div>
                <hr />
                <Button onClick={handleRemove} bsStyle='danger'>
                  <i className='fa fa-trash' /> Löschen
                </Button>
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
  form: 'IntegratorTaskForm',
  fields: ['subject', 'dueDate', 'doneDate'],
  validate: values => {
    const errors = {}
    if (!values.subject) errors.subject = translate('field.error.required')
    if (!values.dueDate) errors.dueDate = translate('field.error.required')
    return errors
  }
}

const mapStateToProps = (state, ownProps) => {
  const task = ownProps.task || {}
  const id = task.id
  const handleRemove = e => {
    ownProps.onDrop({ id })
    ownProps.onHide()
  }
  const subject = task.subject || ''
  const dueDate = srv2mom(task.dueDate)
  const createdDate = srv2mom(task.createdDate)
  const doneDate = srv2mom(task.doneDate)
  return { id, createdDate, initialValues: { subject, dueDate, doneDate }, handleRemove }
}

export default reduxForm(config, mapStateToProps)(TaskModal)
