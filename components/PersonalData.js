import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import { translate } from 'services/locale'
import { save } from '../store/actionCreators'
import { isEuCountry } from 'services/masterData'
import { PanelGroup, Panel, Button, Row, Col } from 'react-bootstrap'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import ButtonOptions from 'components/ButtonOptions/ButtonOptions'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
// import Message from 'components/Message/Message'
import Select from 'components/Select/Select'
import Flags from 'components/Flags/Flags'

import '../assets/PersonalData.scss'

const formatCountry = item =>
  <span><Flags code={item.id} /> {item.label}</span>

class PersonalData extends React.Component {
  static propTypes = {
    accordion: PropTypes.string,
    select: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    enumBenefitPayment: PropTypes.array.isRequired,
    enumPermitLimited: PropTypes.array.isRequired,
    enumHousing: PropTypes.array.isRequired,
    enumPersonalStatus: PropTypes.array.isRequired,
    enumRegistrationStatus: PropTypes.array.isRequired,
    enumRelative: PropTypes.array.isRequired,
    enumRelativeAsylumStatus: PropTypes.array.isRequired,
    enumAsylumStatus: PropTypes.array.isRequired,
    euCountries: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    religions: PropTypes.array.isRequired,
    ethnities: PropTypes.array.isRequired,
    disabiltyStatus: PropTypes.array.isRequired
  }

  render () {
    const {
      accordion,
      select,
      data,
      disabiltyStatus,
      enumBenefitPayment,
      enumHousing,
      enumPermitLimited,
      enumPersonalStatus,
      enumRegistrationStatus,
      enumRelative,
      enumRelativeAsylumStatus,
      enumAsylumStatus,
      countries,
      euCountries,
      fields: {
        lastName,
        firstName,
        street,
        houseNumber,
        zip,
        city,
        gender,
        birthplaceCountry,
        birthplaceCity,
        citizenship,
        arrivalDate,
        asylumStatus,
        applicationDate,
        permitDate,
        permitLimited,
        permitExpiration,
        suspensionExpiration,
        noneExpiration,
        birthday,
        phoneNumber,
        jobCenterId,
        applicationId,
        permitId,
        suspensionId,
        noneId,
        internalId,
        countrySearch,
        ethnicitySearch,
        personalStatus,
        childrenCount,
        benefitPayment,
        housing,
        prio,
        unaccompanied,
        family,
        religion,
        ethnicity,
        disability,
        publicTransportConnection,
        publicTransportTicket,
        alphabetisedGeneral,
        alphabetisedLatin,
        participationRefused,
        singleParent,
        hasHealthLimitations,
        healthLimitation,
        inMedicalTreatment,
        treatingPhysician
      },
      handleSubmit,
      ethnities,
      religions,
      resetForm,
      pristine
    } = this.props
    const disabled = !data.client.own
    const dirtyWarning = <span>Ungespeicherte Änderungen</span>
    return (
      <form className='integrator-personal-data padd-t-20' onSubmit={handleSubmit} disabled={disabled}>
        <Row className={classnames({ disabled })}>
          <Col md={6}>
            <TextInput field={lastName} label='Nachname'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={firstName} label='Vorname'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <ButtonOptions field={gender} label='Anredeform' entries={[
              { id: 'Male', label: <span><i className='fa fa-male' /> männlich</span> },
              { id: 'Female', label: <span><i className='fa fa-female' /> weiblich</span> }
            ]} disabled={disabled} dirtyWarning={dirtyWarning} />
            <DatePicker field={birthday} label='Geburtstag' server
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <Select field={birthplaceCountry} entries={countries} label='Geburtsland' search={countrySearch}
              disabled={disabled} dirtyWarning={dirtyWarning} format={formatCountry} />
            <TextInput field={birthplaceCity} label='Geburtsort'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <Select field={citizenship} entries={countries} label='Staatsbürger von' search={countrySearch}
              disabled={disabled} dirtyWarning={dirtyWarning} format={formatCountry} />
            <DatePicker field={arrivalDate} label='Ankunftsdatum' server
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={internalId} label='BÜMA Nr.'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={jobCenterId} label='Jobcenter Kdnr.'
              disabled={disabled} dirtyWarning={dirtyWarning} />
          </Col>
          <Col md={6}>
            <TextInput field={phoneNumber} label='Mobilnummer'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={street} label='Straße'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={houseNumber} label='Hausnr.'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={zip} label='PLZ'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={city} label='Wohnort'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <Select field={asylumStatus} entries={enumAsylumStatus} label='Asylstatus'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            {asylumStatus.value === 'Permit' && <div>
              <TextInput field={permitId} label='ID Erlaubnis'
                disabled={disabled} dirtyWarning={dirtyWarning} />
              <DatePicker field={permitDate} label='Ausgestellt am' server
                disabled={disabled} dirtyWarning={dirtyWarning} />
              <ButtonOptions field={permitLimited} label='Befristung' entries={enumPermitLimited}
                disabled={disabled} dirtyWarning={dirtyWarning} />
              <DatePicker field={permitExpiration} label='Befristung bis' server
                disabled={disabled || permitLimited.Value !== 'Limited'} dirtyWarning={dirtyWarning} />
            </div>}
            {asylumStatus.value === 'Suspension' && <div>
              <TextInput field={suspensionId} label='ID Duldung'
                disabled={disabled} dirtyWarning={dirtyWarning} />
              <DatePicker field={suspensionExpiration} label='Duldung bis' server
                disabled={disabled} dirtyWarning={dirtyWarning} />
            </div>}
            {asylumStatus.value === 'Application' && <div>
              <TextInput field={applicationId} label='ID Gestattung'
                disabled={disabled} dirtyWarning={dirtyWarning} />
              <DatePicker field={applicationDate} label='Antrag gestellt am' server
                disabled={disabled} dirtyWarning={dirtyWarning} />
            </div>}
            {asylumStatus.value === 'Denial' && <div />}
            {asylumStatus.value === 'None' && <div>
              <TextInput field={noneId} label='ID Ankunftsnachweis'
                disabled={disabled} dirtyWarning={dirtyWarning} />
              <DatePicker field={noneExpiration} label='Gültig bis' server
                disabled={disabled} dirtyWarning={dirtyWarning} />
            </div>}
          </Col>
        </Row>
        <hr />
        <Row className={classnames({ disabled })}>
          <Col md={6}>
            <Select field={personalStatus} entries={enumPersonalStatus} label='Familienstand'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput type='number' field={childrenCount} label='Anzahl Kinder'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <Select field={benefitPayment} entries={enumBenefitPayment} label='Leistungsbezug'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <Select field={housing} entries={enumHousing} label='Unterbringung'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <Select field={ethnicity} entries={ethnities} label='Volkszugehörigkeit'
              disabled={disabled} dirtyWarning={dirtyWarning} search={ethnicitySearch} />
            <Select field={religion} entries={religions} label='Religion'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <ButtonOptions field={prio} label='Status Ampel' className='status-light' entries={[
              { id: 0, label: <span className='circle green' /> },
              { id: 1, label: <span className='circle yellow' /> },
              { id: 2, label: <span className='circle red' /> }
            ]} disabled={disabled} dirtyWarning={dirtyWarning} />
          </Col>
          <Col md={6}>
            <CheckboxInput field={unaccompanied} label='Unbegleitete(r) Minderjährige(r)'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <CheckboxInput field={singleParent} label='Alleinerziehend?'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <CheckboxInput field={publicTransportConnection} label='Anschluss öffentliche Verkehrsmittel vom Wohnort'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <CheckboxInput field={publicTransportTicket} label='Monatsfahrkarte verfügbar'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <CheckboxInput field={alphabetisedGeneral} label='Alphabetisiert'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <CheckboxInput field={alphabetisedLatin} label='Lateinisch alphabetisiert'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <CheckboxInput field={participationRefused} label='Verweigert Teilnahme'
              disabled={disabled} dirtyWarning={dirtyWarning} />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={6}>
            <CheckboxInput field={hasHealthLimitations} label='Gesundheitsbeschränkungen'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={healthLimitation} label='Einschränkungstyp'
              disabled={disabled || !hasHealthLimitations.value} dirtyWarning={dirtyWarning} />
            <Select field={disability} entries={disabiltyStatus} label='Behinderung (Grad)'
              disabled={disabled || !hasHealthLimitations.value} dirtyWarning={dirtyWarning} />
          </Col>
          <Col md={6}>
            <CheckboxInput field={inMedicalTreatment} label='Medizinische Versorgung'
              disabled={disabled} dirtyWarning={dirtyWarning} />
            <TextInput field={treatingPhysician} label='Behandelnder Arzt'
              disabled={disabled || !inMedicalTreatment.value} dirtyWarning={dirtyWarning} />
          </Col>
        </Row>
        {disabled ||
          <Button className='btn-theme pull-right' type='submit'>
            <i className='fa fa-upload' /> Speichern
          </Button>
        }
        <PanelGroup className='margin-t-50' id='integrator-personal-family'>
          <Panel eventKey='family'>
            <Panel.Heading>
              <Panel.Toggle>
                <Panel.Title componentClass='h4'>
                  {`Familie (${family.length})`}
                </Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Body collapsible>
              <PanelGroup accordion activeKey={accordion} id='integrator-personal-family-member'
                onSelect={key => select(key === accordion ? '' : key)}>
                {family.map(({
                  lastName,
                  firstName,
                  relation,
                  birthday,
                  asylumStatus,
                  asylumCountry,
                  plannedReunion,
                  street,
                  houseNumber,
                  zip,
                  city,
                  country,
                  disability,
                  confirm,
                  daycareStatus,
                  daycareInfo,
                  extraCurricularOffers,
                  extraCurricularOfferInfo,
                  hasHealthLimitations,
                  healthLimitation,
                  inMedicalTreatment,
                  treatingPhysician
                }, i) =>
                  <Panel key={i} className={classnames('margin-b-20', { disabled })}>
                    <Panel.Body>
                      <Row>
                        <Col md={6}>
                          <TextInput field={lastName} label='Nachname'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={firstName} label='Vorname'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <DatePicker field={birthday} label='Geburtstag' server
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <Select field={relation} entries={enumRelative} label='Beziehung'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <Select field={asylumStatus} entries={enumRelativeAsylumStatus} label='Asyl-Status'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <Select field={asylumCountry} entries={euCountries} label='Asyl Land (EU)'
                            format={formatCountry} disabled={disabled || asylumStatus.value !== 'OtherEU'}
                            dirtyWarning={dirtyWarning} search={countrySearch} />
                          <Select field={daycareStatus} entries={enumRegistrationStatus}
                            label='Kindergarten/ Schulplatz' disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={daycareInfo} dirtyWarning={dirtyWarning} rows={3}
                            disabled={disabled || !daycareStatus.value || daycareStatus.value === 'No'} />
                        </Col>
                        <Col md={6}>
                          <TextInput field={street} label='Straße'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={houseNumber} label='Hausnr.'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={zip} label='PLZ'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={city} label='Wohnort'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <Select field={country} entries={countries} label='Land' search={countrySearch}
                            disabled={disabled} dirtyWarning={dirtyWarning} format={formatCountry} />
                          <CheckboxInput field={plannedReunion} label='Familiennachzug geplant'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <CheckboxInput field={extraCurricularOffers} label='außerschulische Angebote'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={extraCurricularOfferInfo} dirtyWarning={dirtyWarning} rows={3}
                            disabled={disabled || !extraCurricularOffers.value} />
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <CheckboxInput field={hasHealthLimitations} label='Gesundheitsbeschränkungen'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={healthLimitation} label='Einschränkungstyp'
                            disabled={disabled || !hasHealthLimitations.value} dirtyWarning={dirtyWarning} />
                          <Select field={disability} entries={disabiltyStatus} label='Behinderung (Grad)'
                            disabled={disabled || !hasHealthLimitations.value} dirtyWarning={dirtyWarning} />
                        </Col>
                        <Col md={6}>
                          <CheckboxInput field={inMedicalTreatment} label='Medizinische Versorgung'
                            disabled={disabled} dirtyWarning={dirtyWarning} />
                          <TextInput field={treatingPhysician} label='Behandelnder Arzt'
                            disabled={disabled || !inMedicalTreatment.value} dirtyWarning={dirtyWarning} />
                        </Col>
                      </Row>
                      {disabled ||
                      <Row className='form-footer'>
                        <Col md={2}>
                          <Button bsStyle='danger' disabled={!confirm.value} type='submit'
                            onClick={e => { family.removeField(i) }} block>
                            <i className='fa fa-trash' /> Löschen
                          </Button>
                        </Col>
                        <Col md={2}>
                          <CheckboxInput field={confirm} label='Sicher?' inline />
                        </Col>
                        <Col md={3} mdOffset={2}>
                          <Button onClick={resetForm} block disabled={pristine}>
                            <i className='fa fa-history' /> Zurücksetzen
                          </Button>
                        </Col>
                        <Col md={3}>
                          <Button bsStyle='primary' type='submit' block disabled={pristine}>
                            <i className='fa fa-upload' /> Speichern
                          </Button>
                        </Col>
                      </Row>
                      }
                    </Panel.Body>
                  </Panel>
                )}
              </PanelGroup>
              {disabled ||
                <Button bsStyle='success' onClick={e => {
                  family.addField({
                    firstName: '',
                    lastName: '',
                    relation: null,
                    birthday: null,
                    asylumStatus: null,
                    asylumCountry: null,
                    plannedReunion: false,
                    street: '',
                    houseNumber: '',
                    zip: '',
                    city: '',
                    country: null,
                    confirm: false,
                    disability: null,
                    daycareStatus: null,
                    daycareInfo: '',
                    extraCurricularOffers: false,
                    extraCurricularOfferInfo: '',
                    hasHealthLimitations: false,
                    healthLimitation: '',
                    inMedicalTreatment: false,
                    treatingPhysician: ''
                  })
                }}>
                  <i className='fa fa-user-plus' /> Weitere hinzufügen
                </Button>
              }
            </Panel.Body>
          </Panel>
        </PanelGroup>
      </form>
    )
  }
}

const config = {
  form: 'IntegratorPersonalDataForm',
  fields: [
    'lastName',
    'firstName',
    'street',
    'houseNumber',
    'zip',
    'city',
    'gender',
    'birthplaceCountry',
    'birthplaceCity',
    'citizenship',
    'arrivalDate',
    'asylumStatus',
    'applicationDate',
    'permitDate',
    'permitLimited',
    'permitExpiration',
    'suspensionExpiration',
    'noneExpiration',
    'birthday',
    'phoneNumber',
    'jobCenterId',
    'applicationId',
    'permitId',
    'suspensionId',
    'noneId',
    'internalId',
    'personalStatus',
    'publicTransportConnection',
    'publicTransportTicket',
    'alphabetisedGeneral',
    'alphabetisedLatin',
    'participationRefused',
    'singleParent',
    'religion',
    'ethnicity',
    'childrenCount',
    'benefitPayment',
    'housing',
    'prio',
    'unaccompanied',
    'countrySearch',
    'ethnicitySearch',
    'disability',
    'hasHealthLimitations',
    'healthLimitation',
    'inMedicalTreatment',
    'treatingPhysician',
    'family[].disability',
    'family[].hasHealthLimitations',
    'family[].healthLimitation',
    'family[].inMedicalTreatment',
    'family[].treatingPhysician',
    'family[].firstName',
    'family[].lastName',
    'family[].relation',
    'family[].birthday',
    'family[].asylumStatus',
    'family[].asylumCountry',
    'family[].plannedReunion',
    'family[].street',
    'family[].houseNumber',
    'family[].zip',
    'family[].city',
    'family[].country',
    'family[].confirm',
    'family[].disability',
    'family[].daycareStatus',
    'family[].daycareInfo',
    'family[].extraCurricularOffers',
    'family[].extraCurricularOfferInfo',
    'family[].hasHealthLimitations',
    'family[].healthLimitation',
    'family[].inMedicalTreatment',
    'family[].treatingPhysician'
  ],
  validate: values => ({
    lastName: values.lastName ? undefined : translate('field.error.required'),
    firstName: values.firstName ? undefined : translate('field.error.required'),
    zip: !values.zip || values.zip.length === 5 ? undefined : translate('field.error.length', { length: 5 }),
    family: values.family.map(p => ({
      lastName: p.lastName ? undefined : translate('field.error.required'),
      firstName: p.firstName ? undefined : translate('field.error.required')
    }))
  })
}

const mapStateToProps = (state, ownProps) => ({
  enumBenefitPayment: state.masterData.enumBenefitPayment.filter(i => i.id !== 'Unspecified'),
  enumHousing: state.masterData.enumHousing.filter(i => i.id !== 'Unspecified'),
  enumPersonalStatus: state.masterData.enumPersonalStatus.filter(i => i.id !== 'Unspecified'),
  enumRegistrationStatus: state.masterData.enumRegistrationStatus.filter(i => i.id !== 'Unspecified'),
  enumPermitLimited: state.masterData.enumPermitLimited.filter(i => i.id !== 'Unspecified'),
  countries: state.masterData.countries,
  ethnities: state.masterData.ethnities.filter(i => i.id),
  religions: state.masterData.religions.filter(i => i.id),
  disabiltyStatus: state.masterData.disabiltyStatus.filter(i => i.id),
  enumRelative: state.masterData.enumRelative.filter(i => i.id !== 'Unspecified'),
  enumRelativeAsylumStatus: state.masterData.enumRelativeAsylumStatus.filter(i => i.id !== 'Unspecified'),
  enumAsylumStatus: state.masterData.enumAsylumStatus.filter(i => i.id !== 'Unspecified'),
  euCountries: state.masterData.countries.filter(c => isEuCountry(c.id)),
  initialValues: {
    lastName: ownProps.data.client.lastName || '',
    firstName: ownProps.data.client.firstName || '',
    street: ownProps.data.client.street || '',
    houseNumber: ownProps.data.client.houseNumber || '',
    zip: ownProps.data.client.zip || '',
    city: ownProps.data.client.city || '',
    gender: ownProps.data.client.gender,
    birthplaceCountry: ownProps.data.client.birthplaceCountry,
    birthplaceCity: ownProps.data.client.birthplaceCity || '',
    citizenship: ownProps.data.client.citizenship,
    arrivalDate: ownProps.data.client.arrivalDate,
    asylumStatus: ownProps.data.client.asylumStatus,
    applicationDate: ownProps.data.client.applicationDate,
    permitDate: ownProps.data.client.permitDate,
    permitLimited: ownProps.data.client.permitLimited,
    permitExpiration: ownProps.data.client.permitExpiration,
    suspensionExpiration: ownProps.data.client.suspensionExpiration,
    noneExpiration: ownProps.data.client.noneExpiration,
    birthday: ownProps.data.client.birthday,
    phoneNumber: ownProps.data.client.phoneNumber || '',
    jobCenterId: ownProps.data.client.jobCenterId || '',
    applicationId: ownProps.data.client.applicationId || '',
    permitId: ownProps.data.client.permitId || '',
    suspensionId: ownProps.data.client.suspensionId || '',
    noneId: ownProps.data.client.noneId || '',
    internalId: ownProps.data.client.internalId || '',
    prio: ownProps.data.client.prio || 0,
    housing: ownProps.data.client.housing,
    religion: ownProps.data.client.religion,
    ethnicity: ownProps.data.client.ethnicity,
    countrySearch: '',
    ethnicitySearch: '',
    singleParent: !!ownProps.data.client.singleParent,
    unaccompanied: !!ownProps.data.client.unaccompanied,
    childrenCount: ownProps.data.client.childrenCount || 0,
    benefitPayment: ownProps.data.client.benefitPayment,
    personalStatus: ownProps.data.client.personalStatus,
    alphabetisedLatin: !!ownProps.data.client.alphabetisedLatin,
    alphabetisedGeneral: !!ownProps.data.client.alphabetisedGeneral,
    participationRefused: !!ownProps.data.client.participationRefused,
    publicTransportTicket: !!ownProps.data.client.publicTransportTicket,
    publicTransportConnection: !!ownProps.data.client.publicTransportConnection,
    hasHealthLimitations: ownProps.data.client.health !== null,
    disability: ownProps.data.client.disability || 0,
    healthLimitation: ownProps.data.client.health || '',
    inMedicalTreatment: ownProps.data.client.treatingPhysician !== null,
    treatingPhysician: ownProps.data.client.treatingPhysician || '',
    family: (ownProps.data.client.family || []).map(p => {
      p.firstName = p.firstName || ''
      p.lastName = p.lastName || ''
      p.street = p.street || ''
      p.houseNumber = p.houseNumber || ''
      p.zip = p.zip || ''
      p.city = p.city || ''
      p.plannedReunion = !!p.plannedReunion
      p.disability = p.disability || 0
      p.daycareStatus = p.daycareStatus
      p.daycareInfo = p.daycareInfo || ''
      p.extraCurricularOffers = !!p.extraCurricularOffers
      p.extraCurricularOfferInfo = p.extraCurricularOfferInfo || ''
      p.hasHealthLimitations = p.health !== null
      p.healthLimitation = p.health || ''
      p.inMedicalTreatment = p.treatingPhysician !== null
      p.treatingPhysician = p.treatingPhysician || ''
      p.confirm = false
      return p
    }),
    confirm: false
  }
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: values => dispatch(save({
    ...ownProps.data,
    client: {
      ...ownProps.data.client,
      ...values,
      health: values.hasHealthLimitations ? values.healthLimitation : null,
      treatingPhysician: values.inMedicalTreatment ? values.treatingPhysician : null,
      family: values.family.map(p => {
        p.role = 'Family'
        p.health = p.hasHealthLimitations ? p.healthLimitation : null
        p.treatingPhysician = p.inMedicalTreatment ? p.treatingPhysician : null
        return p
      })
    }
  }))
})

export default reduxForm(config, mapStateToProps, mapDispatchToProps)(PersonalData)
