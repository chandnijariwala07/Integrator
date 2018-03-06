import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'react-bootstrap/lib/Grid'

import './assets/style.scss'

const Layout = ({ children }) =>
  <Grid className='padd-t-20 padd-b-40 integrator'>{children}</Grid>

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
