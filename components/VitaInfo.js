import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { srv2mom } from 'services/dateconversion'
import { getAsylumStatusMap, maybeLabel } from 'redux/selectors/masterData'
import FieldMissing from 'components/FieldMissing/FieldMissing'
import Message from 'components/Message/Message'

const Vita = ({ vita, asylumStatusMap }) =>
  <div className='vita-info'>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.lastname.label' />: </strong>
      {vita.lastName || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.firstname.label' />: </strong>
      {vita.firstName || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.birthday.label' />: </strong>
      {(vita.birthday && srv2mom(vita.birthday).format('L')) || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.asylumStatus.label' />: </strong>
      {maybeLabel(asylumStatusMap, vita.asylumStatus) || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.street.label' />: </strong>
      {vita.street || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.streetNumber.label' />: </strong>
      {vita.houseNumber || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.zip.label' />: </strong>
      {vita.zip || <FieldMissing />}
    </div>
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.town.label' />: </strong>
      {vita.city || <FieldMissing />}
    </div>
    {vita.email && <div>
      <strong className='text-muted'><Message id='integrator.details.info.email.label' />: </strong>
      {vita.email}
    </div>}
    <div>
      <strong className='text-muted'><Message id='integrator.details.info.phoneNumber.label' />: </strong>
      {vita.phoneNumber || vita.cellPhone || <FieldMissing />}
    </div>
  </div>

Vita.propTypes = {
  vita: PropTypes.object.isRequired,
  asylumStatusMap: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  asylumStatusMap: getAsylumStatusMap(state) || {}
})

export default connect(mapStateToProps)(Vita)
