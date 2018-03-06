import React from 'react'
import PropTypes from 'prop-types'
import Flags from 'components/Flags/Flags'

const GermanLevel = ({ level }) => {
  switch (level) {
    case 'MotherTongue': return <Flags code='DE' />

    case 'Beginner': return <i className='fa fa-star-o' />
    case 'Intermediate': return <i className='fa fa-star-half-o' />
    case 'Expert': return <i className='fa fa-star' />

    case 'A1':
    case 'A2':
    case 'B1':
    case 'B2':
    case 'C1':
    case 'C2':
      return <span>{level}</span>

    default: return <i className='fa fa-question' />
  }
}

GermanLevel.propTypes = {
  level: PropTypes.string
}

export default GermanLevel
