import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { createValidator, required } from 'forms/validation'
import AddressSelect from './AddressSelect'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import Select from 'components/Select/Select'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import Message from 'components/Message/Message'
import { upsertMinute, removeMinute } from '../store/actionCreators'

class MeetingsNetworking extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    model: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    networkingGroup: PropTypes.array.isRequired
  }
  render () {
    const {
      show,
      data,
      dispatch,
      handleSubmit,
      model,
      onClose,
      fields: { date, group, text, person, confirm },
      networkingGroup
    } = this.props

    const save = handleSubmit(values => { dispatch(upsertMinute(data, values)) })
    const del = e => { dispatch(removeMinute(data, model.id)) }

    return (
      <Modal show={show} onHide={onClose}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Notiz für Vernetzungen und Kontakte</Modal.Title>
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
            <Select field={group} label='Group' entries={networkingGroup} placeholder='Bitte wählen' />
            <TextInput field={text} label='Notiz' rows={10} placeholder='Bitte schreiben Sie eine Notiz hier' />
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
            <Button bsStyle='primary' onClick={save}><Message id='general.save' /></Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

const config = {
  form: 'MeetingsNetworking',
  fields: [ 'id', 'date', 'group', 'text', 'person', 'confirm', 'meetingType' ],
  validate: createValidator({
    date: required(),
    group: required(),
    text: required()
  })
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    meetingType: 'Networking',
    id: ownProps.model && ownProps.model.id,
    date: (ownProps.model && ownProps.model.date) || null,
    group: (ownProps.model && ownProps.model.group) || null,
    person: (ownProps.model && ownProps.model.person) || null,
    text: (ownProps.model && ownProps.model.text) || '',
    confirm: false
  },
  networkingGroup: state.masterData.networkingGroup
})

export default reduxForm(config, mapStateToProps)(MeetingsNetworking)
