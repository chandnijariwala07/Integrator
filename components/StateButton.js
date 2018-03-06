import React from 'react'
import PropTypes from 'prop-types'
import { promote, transfer } from '../store/actionCreators'
import { Button } from 'react-bootstrap'

const StateButton = ({ data, integrator, userInfo, dispatch }) => {
  const handlePromote = e => { dispatch(promote(data)) }
  const handleTransfer = e => { dispatch(transfer(data)) }
  if (data.client) {
    return data.client.own ? (
      <Button disabled block>
        Eigener Klient
      </Button>
    ) : (
      <Button bsStyle='danger' block onClick={handleTransfer}>
        Klient von <em>{integrator.lastName}, {integrator.firstName}</em> übernehmen
      </Button>
    )
  }
  if (data.vita.invitedBy) {
    return data.vita.invitedBy === userInfo.id ? (
      <Button block onClick={handlePromote}>
        Erneute Einladung versenden
      </Button>
    ) : (
      <Button bsStyle='danger' block onClick={handlePromote}>
        Eigene Einladung versenden
        <br />
        <small>
          (Zuvor eingeladen von
          <br />
          {integrator.lastName}, {integrator.firstName})
        </small>
      </Button>
    )
  }
  return (
    <Button bsStyle='primary' block onClick={handlePromote}>
      Als Klienten hinzufügen (Anfrage)
    </Button>
  )
}

StateButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  integrator: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default StateButton
