import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { createValidator, required } from 'forms/validation'
import DatePicker from 'components/DatePicker/DatePicker'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import TextInput from 'components/TextInput/TextInput'
import Select from 'components/Select/Select'
import Message from 'components/Message/Message'
import { upsertMinute, removeMinute } from '../store/actionCreators'

class MeetingsConsulatation extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    model: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    counsellingGroup: PropTypes.array.isRequired,
    counsellingPlace: PropTypes.array.isRequired,
    targetCategories: PropTypes.array.isRequired
  }

  render () {
    const {
      data,
      show,
      model,
      dispatch,
      handleSubmit,
      onClose,
      fields: { date, type, location, category, text, confirm, attendeeCount }, 
      counsellingGroup,
      counsellingPlace,
      targetCategories
    } = this.props

    const save = handleSubmit(values => { dispatch(upsertMinute(data, values)) })
    const del = e => { dispatch(removeMinute(data, model.id)) }

    // console.log(this.props.model, date)
    return (
      <Modal show={show} onHide={onClose}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Notiz für Beratungsgespräch</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <Col md={6}>
                <DatePicker field={date} label='Datum' placeholder='Bitte wählen' max={new Date()} server />
              </Col>
              <Col md={6}>
                <Select field={location} label='Form'
                  entries={counsellingPlace} placeholder='Bitte wählen' />
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Select field={type} label='Art'
                  entries={counsellingGroup} placeholder='Bitte wählen' />
              </Col>
              <Col md={4}>
                <TextInput field={attendeeCount} label='Anzahl attendeeCounten' type='number'
                  disabled={type.value === 1} min={2} />
              </Col>
            </Row>
            <Select field={category} label='Thema' entries={targetCategories} placeholder='Bitte wählen' />
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
  form: 'MeetingsConsultation',
  fields: [ 'id', 'date', 'type', 'location', 'category', 'text', 'confirm', 'attendeeCount', 'meetingType' ],
  validate: createValidator({
    date: required(),
    type: required(),
    attendeeCount: required(),
    location: required(),
    category: required(),
    text: required()
  })
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    meetingType: 'Consultation',
    id: ownProps.model && ownProps.model.id,
    date: (ownProps.model && ownProps.model.date) || null,
    type: (ownProps.model && ownProps.model.type) || null,
    location: (ownProps.model && ownProps.model.location) || null,
    attendeeCount: (ownProps.model && ownProps.model.attendeeCount) || 0,
    category: (ownProps.model && ownProps.model.category) || null,
    text: (ownProps.model && ownProps.model.text) || '',
    confirm: false
  },
  counsellingGroup: state.masterData.counsellingGroup,
  counsellingPlace: state.masterData.counsellingPlace,
  targetCategories: state.masterData.targetCategories
})

export default reduxForm(config, mapStateToProps)(MeetingsConsulatation)
