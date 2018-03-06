import React from 'react'
import PropTypes from 'prop-types'
import GenericPreview from 'modules/CurriculumVitae/Chapters/GenericPreview'

const Vita = ({ data: { vita } }) =>
  <div className='padd-t-20'><GenericPreview cv={vita} /></div>

Vita.propTypes = {
  data: PropTypes.shape({
    vita: PropTypes.object.isRequired
  }).isRequired
}
export default Vita
