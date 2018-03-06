import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import { selectAddressbook } from '../store/selectors'
import { save, upsertPerson, removePerson } from '../store/actionCreators'
import { Modal, Row, Col, Button, OverlayTrigger, Tooltip, ListGroup, ListGroupItem } from 'react-bootstrap'
import ButtonCheckboxes from 'components/ButtonCheckboxes/ButtonCheckboxes'
import Message from 'components/Message/Message'

import Form from './AddressbookForm'
import '../assets/Addressbook.scss'

class Addressbook extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    addressbook: PropTypes.arrayOf(Form.PersonType).isRequired,
    data: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    state: PropTypes.number.isRequired,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = { person: props.value || null, dirty: false }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ person: nextProps.value || null })
    }
  }

  _handleSave = values => {
    const { data, userId, dispatch, addressbook } = this.props
    const person = { ...(addressbook.find(p => p.id === this.state.person) || {}) }
    person.lastName = values.lastName
    person.firstName = values.firstName
    person.birthday = values.birthday
    person.email = values.email
    person.phoneNumber = values.phoneNumber
    person.street = values.street
    person.houseNumber = values.houseNumber
    person.zip = values.zip
    person.city = values.city
    person.country = values.country
    person.role = values.role
    person.isShared = values.sharing === 'shared'
    person.owner = values.sharing === 'client' ? data.vita.userId : userId
    person.sharing = values.sharing

    var promise = values.sharing === 'client'
      ? dispatch(save({
        ...data,
        client: {
          ...data.client,
          people: person.id
            ? data.client.people.map(p => p.id === person.id ? person : p)
            : [...data.client.people, person]
        }
      }))
      : dispatch(upsertPerson(data, person))
    promise
      .then(inserted => {
        if (inserted.length) {
          this.setState({ person: inserted[inserted.length - 1] })
        }
      })
  }

  _handleDrop = values => {
    const { data, dispatch, addressbook } = this.props
    const person = { ...addressbook.find(p => p.id === this.state.person) }
    if (values.sharing === 'client') {
      dispatch(save({
        ...data,
        client: {
          ...data.client,
          people: data.client.people.filter(p => p.id !== person.id)
        }
      }))
    } else {
      dispatch(removePerson(data, person.id))
    }
  }

  _handleStateChange = dirty => {
    this.setState({ dirty })
  }

  _createHandleSelect = person => e => {
    this.setState({ person })
  }

  render () {
    const { dirty } = this.state
    const { show, fields: { sharing, search }, data, addressbook, onHide, onChange } = this.props
    const person = { ...(addressbook.find(p => p.id === this.state.person) || {}) }
    const addressbooks = data ? Form.SharingType : Form.SharingType.slice(0, 2)
    const icon = p => <i className={`fa fa-${Form.SharingType.find(s => s.id === p.sharing).icon}`} />
    const sort = (a, b) => `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`)
    const find = haystack => search.value.toLowerCase().split(/\s/)
      .reduce((f, c) => f || haystack.toLowerCase().startsWith(c), false)
    const list = addressbook
      .filter(p => sharing.value.includes(p.sharing) && (!search.value || find(p.firstName) || find(p.lastName)))
      .sort(sort)
    return (
      <Modal bsSize='lg' show={show} onHide={onHide} className='addressbook'>
        <Modal.Header closeButton>
          <Modal.Title>Adressbuch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4} className='addressbook-list'>
              <ListGroup>
                <ListGroupItem onClick={this._createHandleSelect()} bsStyle='success'
                  className={!this.state.person && 'active'}>
                  <i className='fa fa-user-plus' /> <b>Neue Person anlegen</b>
                </ListGroupItem>
              </ListGroup>
              <ButtonCheckboxes field={sharing} entries={addressbooks} className='sharing'
                format={item =>
                  <OverlayTrigger placement='bottom' overlay={<Tooltip id='overlay'>{item.label}</Tooltip>}>
                    <i className={`fa fa-${item.icon}`} />
                  </OverlayTrigger>
                } />
              <div className='search-field'>
                <input className={classnames('form-control', { value: search.value })} value={search.value}
                  onChange={search.onChange} placeholder='Suchen...' />
                <i className='fa fa-search form-control-feedback glass' aria-hidden />
                <i className='fa fa-times-circle form-control-feedback clear' aria-hidden
                  onClick={() => search.onChange('')} />
              </div>
              <ListGroup className='existing-users'>
                {list.map((p, i) =>
                  <ListGroupItem key={i}
                    onClick={this._createHandleSelect(p.id)}
                    className={p.id === this.state.person && 'active'}>
                    {icon(p)} {p.lastName}, {p.firstName}
                  </ListGroupItem>
                )}
              </ListGroup>
            </Col>
            <Col md={8} className='addressbook-details'>
              <Form person={person} onStateChange={this._handleStateChange} onSubmit={this._handleSave} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {dirty &&
            <span className='label label-warning'>
              <i className='fa fa-warning' /> Sie haben ungespeicherte Änderungen!
            </span>
          }
          <Button onClick={onHide}>
            <Message id='general.cancel' />
          </Button>
          <Button onClick={() => person && onChange(person)} disabled={!person} bsStyle='primary'>
            <Message id='general.choose' />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const config = {
  form: 'Addressbook',
  fields: ['sharing', 'search']
}

const mapStateToProps = (state, ownProps) => ({
  userId: state.account.info.id,
  state: state.integrator.clients.state,
  addressbook: [
    ...Object.values(selectAddressbook(state)).filter(p => p.sharing !== 'hidden'),
    ...(ownProps.data ? ownProps.data.client.people : [])
      .map(p => {
        p.sharing = 'client'
        return p
      })
  ],
  initialValues: {
    sharing: ['private', 'shared', 'client'],
    search: ''
  }
})

export default reduxForm(config, mapStateToProps)(Addressbook)
