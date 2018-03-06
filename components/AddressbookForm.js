import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { createValidator, required } from 'forms/validation'
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import ButtonOptions from 'components/ButtonOptions/ButtonOptions'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import Message from 'components/Message/Message'
import Select from 'components/Select/Select'
import Flags from 'components/Flags/Flags'

const PersonType = PropTypes.shape({
  firstName: PropTypes.string,
  lastName: PropTypes.string
})

const SharingType = [
  { id: 'shared', label: 'Geteiltes Addressbuch (alle IM)', icon: 'users' },
  { id: 'private', label: 'Eigenes Adressbuch', icon: 'user' },
  { id: 'client', label: 'Klientenspezifische Kontakte', icon: 'user-o' }
]

class AddressbookForm extends React.Component {
  static propTypes = {
    enumPersonRole: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    onStateChange: PropTypes.func,
    person: PersonType
  }

  static SharingType = SharingType
  static PersonType = PersonType

  componentWillReceiveProps (nextProps) {
    nextProps.dirty !== this.props.dirty && nextProps.onStateChange && nextProps.onStateChange(nextProps.dirty)
  }

  render () {
    const {
      fields: {
        sharing,
        lastName,
        firstName,
        role,
        birthday,
        email,
        phoneNumber,
        street,
        houseNumber,
        zip,
        city,
        country,
        confirm
      },
      person,
      invalid,
      pristine,
      countries,
      enumPersonRole,
      resetForm,
      handleSubmit
    } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <ButtonOptions field={sharing} label='Adressbuch' entries={SharingType} className='sharing'
              disabled={!!person.id}
              format={item =>
                <OverlayTrigger placement='bottom' overlay={<Tooltip id='overlay'>{item.label}</Tooltip>}>
                  <i className={`fa fa-${item.icon}`} />
                </OverlayTrigger>
              } />
            <Select field={role} entries={enumPersonRole} label='Rolle' />
            <TextInput field={lastName} label='Nachname' />
            <TextInput field={firstName} label='Vorname' />
            <TextInput field={email} label='E-Mail-Adresse' />
            <TextInput field={phoneNumber} label='Telefonnummer' />
          </Col>
          <Col md={6}>
            <DatePicker field={birthday} label='Geburtstag' server />
            <TextInput field={street} label='Strasse' />
            <TextInput field={houseNumber} label='Hausnr.' />
            <TextInput field={zip} label='PLZ' />
            <TextInput field={city} label='Wohnort' />
            <Select field={country} entries={countries} label='Land'
              format={item => <span><Flags code={item.id} /> {item.label}</span>} />
          </Col>
        </Row>
        <hr />
        {person.id ? (
          <Row>
            <Col md={4}>
              <Button bsStyle='danger' disabled={!confirm.value}>
                <i className='fa fa-trash' /> Löschen
              </Button>
              <CheckboxInput inline field={confirm} label='Sicher?' />
            </Col>
            <Col md={4}>
              <Button block bsStyle='default' disabled={pristine} onClick={resetForm}>
                <i className='fa fa-history' /> Zurücksetzen
              </Button>
            </Col>
            <Col md={4}>
              <Button block bsStyle='primary' type='submit' disabled={pristine}>
                <i className='fa fa-upload' /> <Message id='general.save' />
              </Button>
            </Col>
          </Row>
        ) : (
          <Row className='buttons'>
            <Col md={8} className='text-right'>
              {invalid &&
                <span className='label label-danger'>
                  <i className='fa fa-warning' /> Bitte mindestens Vor- und Nachnamen angeben!
                </span>
              }
            </Col>
            <Col md={4}>
              <Button block bsStyle='success' type='submit' disabled={pristine}>
                <i className='fa fa-user-plus' /> Person hinzufügen
              </Button>
            </Col>
          </Row>
        )}
      </form>
    )
  }
}

const config = {
  form: 'AddressbookForm',
  fields: [
    'sharing',
    'lastName',
    'firstName',
    'role',
    'birthday',
    'email',
    'phoneNumber',
    'street',
    'houseNumber',
    'zip',
    'city',
    'country',
    'confirm'
  ],
  validate: createValidator({
    lastName: required(),
    firstName: required()
  })
}

const mapStateToProps = (state, ownProps) => {
  const person = ownProps.person || {}
  return {
    countries: state.masterData.countries || [],
    enumPersonRole: state.masterData.enumPersonRole || [],
    initialValues: {
      sharing: person.sharing || 'client',
      firstName: person.firstName || '',
      lastName: person.lastName || '',
      role: person.role || null,
      birthday: person.birthday || null,
      email: person.email || '',
      phoneNumber: person.phoneNumber || '',
      street: person.street || '',
      houseNumber: person.houseNumber || '',
      zip: person.zip || '',
      city: person.city || '',
      country: person.country || null
    }
  }
}

export default reduxForm(config, mapStateToProps)(AddressbookForm)
