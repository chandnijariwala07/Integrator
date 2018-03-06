import React from 'react'
import PropTypes from 'prop-types'
import url from 'routes/tokens'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import { push } from 'react-router-redux'
import { createValidator, required, emailAddress } from 'forms/validation'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import Message from 'components/Message/Message'
import Select from 'components/Select/Select'
import Flags from 'components/Flags/Flags'

import { createClient } from '../store/actionCreators'

class CreateClient extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    countries: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  _handleHide = () => {
    const { resetForm, onHide } = this.props
    onHide()
    resetForm()
  }

  _handleSave = client => {
    const { dispatch } = this.props
    dispatch(createClient(client))
      .then(inserted => {
        const id = inserted[0]
        dispatch(push(`${url.integrator.clientview}/${id}`))
      })
  }

  render () {
    const {
      show,
      countries,
      submitting,
      handleSubmit,
      fields: {
        lastName,
        firstName,
        birthday,
        street,
        houseNumber,
        zip,
        city,
        phoneNumber,
        email,
        citizenship,
        searchCountry
      }
    } = this.props
    const disabled = submitting
    return (
      <Modal bsSize='lg' show={show} onHide={this._handleHide}>
        <Form onSubmit={handleSubmit(this._handleSave)} className={classnames('create-client-form', { disabled })}>
          <Modal.Header closeButton>
            <Modal.Title>Verwalteten Klienten hinzufügen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={6}>
                <TextInput field={lastName} disabled={disabled} label='Nachname' />
                <TextInput field={firstName} disabled={disabled} label='Vorname' />
                <DatePicker field={birthday} disabled={disabled} label='Geburtstag' server />
                <Select field={citizenship} disabled={disabled} label='Staatsangehörigkeit' entries={countries}
                  format={item => <span><Flags code={item.id} /> {item.label}</span>} search={searchCountry} />
                <TextInput field={email} disabled={disabled} label='E-Mail-Adresse' />
              </Col>
              <Col sm={6}>
                <TextInput field={street} disabled={disabled} label='Strasse' className='street' />
                <TextInput field={houseNumber} disabled={disabled} label='Hausnr.' className='house-number' />
                <TextInput field={zip} disabled={disabled} label='PLZ' />
                <TextInput field={city} disabled={disabled} label='Wohnort' />
                <TextInput field={phoneNumber} disabled={disabled} label='Mobilnummer' />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._handleHide} disabled={disabled}>
              <Message id='general.cancel' />
            </Button>
            <Button bsStyle='success' type='submit' disabled={disabled} className={classnames({ loading: submitting })}>
              <div className={classnames('state-icon', { 'loading-spinner-inline': submitting })}>
                <i className='fa fa-plus' />
              </div> <Message id='general.add' />
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

const config = {
  form: 'CreateClientForm',
  fields: [
    'lastName',
    'firstName',
    'birthday',
    'street',
    'houseNumber',
    'zip',
    'city',
    'phoneNumber',
    'email',
    'citizenship',
    'searchCountry'
  ],
  validate: createValidator({
    lastName: required(),
    firstName: required(),
    email: emailAddress()
  })
}

const mapStateToProps = state => ({
  countries: state.masterData.countries,
  initialValues: {
    lastName: '',
    firstName: '',
    birthday: null,
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    phoneNumber: '',
    email: '',
    citizenship: false,
    searchCountry: ''
  }
})

export default reduxForm(config, mapStateToProps)(CreateClient)
