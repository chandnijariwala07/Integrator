import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { createValidator, required } from 'forms/validation'
import AddressSelect from './AddressSelect'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import Message from 'components/Message/Message'
import { upsertMinute, removeMinute } from '../store/actionCreators'

class MeetingsRegulatory extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    model: PropTypes.object,
    show: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  }
  render () {
    const {
      show,
      data,
      dispatch,
      handleSubmit,
      model,
      onClose,
      fields: { date, text, person, confirm }
    } = this.props

    const save = handleSubmit(values => { dispatch(upsertMinute(data, values)) })
    const del = e => { dispatch(removeMinute(data, model.id)) }

    return (
      <Modal show={show} onHide={onClose}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Notiz für Weiterleitung an Regeldienste</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <Col md={6}>
                <DatePicker field={date} label='Datum' placeholder='Bitte wählen' max={new Date()} server />
              </Col>
              <Col md={6}>
                <AddressSelect field={person} label='Person' />
              </Col>
            </Row>
            <TextInput field={text} rows={10} label='Notiz' placeholder='Bitte schreiben Sie eine Notiz hier' />
            {model && model.id && <div>
              <hr />
              <Button bsStyle='danger' disabled={!confirm.value} onClick={del}>
                <i className='fa fa-trash' /> Löschen
              </Button>
              <CheckboxInput field={confirm} label='Sicher?' />
            </div>}
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={onClose}><Message id='general.cancel' /></Button>
            <Button bsStyle='primary' onclick={save}><Message id='general.save' /></Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

const config = {
  form: 'MeetingsRegulatory',
  fields: [ 'id', 'date', 'text', 'person', 'personRole', 'confirm', 'meetingType' ],
  validate: createValidator({
    date: required(),
    person: required(),
    personRole: required(),
    text: required()
  })
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    meetingType: 'Referral',
    id: ownProps.model && ownProps.model.id,
    date: (ownProps.model && ownProps.model.date) || null,
    person: (ownProps.model && ownProps.model.person) || null,
    text: (ownProps.model && ownProps.model.text) || '',
    confirm: false
  }
})

export default reduxForm(config, mapStateToProps)(MeetingsRegulatory)
