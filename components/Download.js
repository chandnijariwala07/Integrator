import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import VitaDownload from 'components/VitaDownload/VitaDownload'

class Download extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { show: false }
  }

  _show = e => {
    e.preventDefault()
    this.setState({ show: true })
  }

  _hide = () => {
    this.setState({ show: false })
  }

  render () {
    const { show } = this.state
    const { userId } = this.props
    return (
      <Button onClick={this._show} bsStyle='primary' block>
        <i className='fa fa-download' aria-hidden='true' /> Lebenslauf herunterladen
        {show && <VitaDownload show={show} onHide={this._hide} user={userId} />}
      </Button>
    )
  }
}

export default Download
