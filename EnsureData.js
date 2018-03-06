import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { load } from './store/actionCreators'
import TransmissionState from 'redux/state'

class EnsureData extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    transmissionState: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired
  }

  componentWillMount () {
    this._checkState(this.props)
  }

  componentWillUpdate (nextProps) {
    this._checkState(nextProps)
  }

  _checkState (props) {
    const { dispatch, transmissionState, isAuthorized, role } = props
    if (isAuthorized && transmissionState === TransmissionState.initial && ~role.search(/(integrator|admin)/)) {
      dispatch(load())
    }
  }

  render () {
    const { children, isAuthorized, transmissionState } = this.props
    return isAuthorized && transmissionState > TransmissionState.loading
      ? children
      : <div className='loading-spinner' />
  }
}

const mapStateToProps = state => ({
  role: state.account.info.role || '',
  isAuthorized: state.account.isAuthorized,
  transmissionState: state.integrator.clients.state
})

export default connect(mapStateToProps)(EnsureData)
