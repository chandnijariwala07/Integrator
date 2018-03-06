import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import { PanelGroup, Panel, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import TextInput from 'components/TextInput/TextInput'
import '../assets/MeetingsList.scss'
import DateSign from './DateSign'
import MeetingsNetworking from './MeetingsNetworking'
import MeetingsConsultation from './MeetingsConsultation'
import MeetingsRegulatory from './MeetingsRegulatory'

class Meetings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      consultation: {
        selected: null,
        sortBy: null,
        isDesc: false
      },
      regulatory: {
        selected: null,
        sortBy: null,
        isDesc: false
      },
      networking: {
        selected: null,
        sortBy: null,
        isDesc: false
      }
    }
  }

  _handleCreateConsultation = () => {
    this.setState({
      consultation: { ...this.state.consultation, selected: {} }
    })
  }

  _handleCreateRegulatory = () => {
    this.setState({
      regulatory: { ...this.state.regulatory, selected: {} }
    })
  }
  _handleCreateNetworking = () => {
    this.setState({
      networking: { ...this.state.networking, selected: {} }
    })
  }

  _handleCloseConsultation = () => {
    this.setState({
      consultation: { ...this.state.consultation, selected: null }
    })
  }
  _handleCloseRegulatory = () => {
    this.setState({
      regulatory: { ...this.state.regulatory, selected: null }
    })
  }
  _handleCloseNetworking = () => {
    this.setState({
      networking: { ...this.state.networking, selected: null }
    })
  }

  _renderSort = (key, a, label) => {
    const { sortBy, isDesc } = this.state[key]
    const asc = sortBy === a && !isDesc
    const desc = sortBy === a && isDesc
    const handle = e => {
      e.preventDefault()
      if (desc) {
        this.setState({ [key]: { ...this.state[key], sortBy: null, isDesc: false } })
      } else {
        this.setState({ [key]: { ...this.state[key], sortBy: a, isDesc: sortBy === a } })
      }
    }
    return <button className='sort' onClick={handle}>
      <div className={classnames('indicator', { asc, desc })}>
        <div className='asc' />
        <div className='desc' />
      </div>
      <div className='caption'>{label}</div>
    </button>
  }

  static propTypes = {
    data: PropTypes.shape({
      minutes: PropTypes.shape({
        consultation: PropTypes.array.isRequired,
        regulatory: PropTypes.array.isRequired,
        networking: PropTypes.array.isRequired
      }).isRequired
    }).isRequired,
    fields: PropTypes.object.isRequired,
    counsellingGroup: PropTypes.array.isRequired,
    counsellingPlace: PropTypes.array.isRequired,
    targetCategories: PropTypes.array.isRequired,
    enumPersonRole: PropTypes.array.isRequired,
    networkingGroup: PropTypes.array.isRequired
  }

  _strcmp = (a, b) => {
    // const ia = a.indexOf('⚠')
    // const ib = b.indexOf('⚠')
    return a.localeCompare(b)
  }

  _createSort = key => (a, b) => {
    const { sortBy, isDesc } = this.state[key]
    const val = obj => sortBy.split('.').reduce((o, p) => o && o[p], obj) || undefined
    const d = isDesc ? -1 : 1
    a = val(a)
    b = val(b)
    if (!a) {
      if (!b) return 0
      return -d
    }
    if (!b) return d
    return typeof a === 'string'
      ? d * this._strcmp(a, b)
      : d * (a < b ? -1 : 1)
  }

  render () {
    const {
      data,
      fields: {
        searchConsultation,
        searchRegulatory,
        searchNetworking
      },
      counsellingGroup,
      counsellingPlace,
      targetCategories,
      enumPersonRole,
      networkingGroup
    } = this.props
    const minutes = data.minutes
    const displayLabel = (id, list) => (list.find(d => d.id === id) || {}).label
    const lists = {};
    ['consultation', 'regulatory', 'networking']
      .forEach(key => {
        lists[key] = this.state[key].sortBy ? minutes[key].sort(this._createSort(key)) : minutes[key]
      })
    const selectedConsultation = this.state.consultation.selected
    const selectedRegulatory = this.state.regulatory.selected
    const selectedNetworking = this.state.networking.selected

    return (
      <form>
        <PanelGroup accordion id='accordion-controlled-example' className='integrator-minutes'>
          <Panel>
            <Panel.Heading>
              <Panel.Toggle>
                <Panel.Title componentClass='h4'>Beratung</Panel.Title>
                Dokumentieren Sie hier alle Ihre Beratungsgespräche
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Body collapsible>
              <div className='sorting-container'>
                {this._renderSort('consultation', 'date', 'Datum')}
                {this._renderSort('consultation', 'kind', 'Art')}
                {this._renderSort('consultation', 'category', 'Thema')}
              </div>
              <TextInput placeholder='suche...' field={searchConsultation} />
              <Button bsStyle='success' onClick={this._handleCreateConsultation}>
                <i className='fa fa-plus' /> Treffen hinzufügen
              </Button>
              <MeetingsConsultation data={data} show={!!selectedConsultation} model={selectedConsultation}
                onClose={this._handleCloseConsultation} />
              {' '}
              <ListGroup>
                {minutes.consultation.map(m =>
                  <ListGroupItem key={m.id} onClick={() => {
                    this.setState({ consultation: { ...this.state.consultation, selected: m } })
                  }}className={m === selectedConsultation && 'active'}>
                    <div className='flex-container'>
                      <div className='flex-item minutes-text'><DateSign date={m.date} /></div>
                      <div className='flex-item'>
                        <div className='minutes-text-bold'>{displayLabel(m.kind, counsellingGroup)}
                          {' '}{m.attendeeCount}
                        </div>
                        {' '}
                        <div className='minutes-text'><i className='fa fa-map-marker' />{' '}
                          {displayLabel(m.place, counsellingPlace)}
                        </div>
                      </div>
                      <div className='flex-item'>
                        <div className='minutes-text-bold'>
                          {displayLabel(m.category, targetCategories)}</div>
                      </div>
                    </div>
                    <div className='minutes-notes'>{m.text}</div>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Heading>
              <Panel.Toggle>
                <Panel.Title componentClass='h4'>Weiterleitung an Regeldienste</Panel.Title>
                Dokumentieren Sie hier alle alle Weiterleitungen an Regeldienste
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Body collapsible>
              <div className='sorting-container'>
                {this._renderSort('regulatory', 'date', 'Datum')}
                {this._renderSort('regulatory', 'personType', 'Regeldienst')}
              </div>
              <TextInput placeholder='search...' field={searchRegulatory} />
              <Button bsStyle='success' onClick={this._handleCreateRegulatory}>
                <i className='fa fa-plus' /> Treffen hinzufügen
              </Button>
              <MeetingsRegulatory data={data} show={!!selectedRegulatory} model={selectedRegulatory}
                onClose={this._handleCloseRegulatory} />
              <ListGroup>
                {minutes.regulatory.map(m =>
                  <ListGroupItem key={m.id} onClick={() => {
                    this.setState({ regulatory: { ...this.state.regulatory, selected: m } })
                  }}className={m === selectedRegulatory && 'active'}>
                    <div className='flex-container'>
                      <div className='flex-item minutes-text'><DateSign date={m.date} /></div>
                      <div className='flex-item'>
                        <div className='minutes-text-bold'>{displayLabel(m.personType, enumPersonRole)}</div>
                        {' '}
                        <div className='minutes-text'><i className='fa fa-user' />{' '}{m.person}</div>
                      </div>
                    </div>
                    <div className='minutes-notes'>{m.text}</div>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Heading>
              <Panel.Toggle>
                <Panel.Title componentClass='h4'>Vernetzung</Panel.Title>
                Dokumentieren Sie hier alle Ihre Vernetzungen und Kontakte
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Body collapsible>
              <div className='sorting-container'>
                {this._renderSort('networking', 'date', 'Datum')}
                {this._renderSort('networking', 'group', 'Gruppe')}
              </div>
              <TextInput placeholder='search...' field={searchNetworking} />
              <Button bsStyle='success' onClick={this._handleCreateNetworking}>
                <i className='fa fa-plus' /> Treffen hinzufügen
              </Button>
              <MeetingsNetworking data={data} show={!!selectedNetworking} model={selectedNetworking}
                onClose={this._handleCloseNetworking} />
              <ListGroup>
                {minutes.networking.map(m =>
                  <ListGroupItem key={m.id} onClick={() => {
                    this.setState({ networking: { ...this.state.networking, selected: m } })
                  }}className={m === selectedNetworking && 'active'}>
                    <div className='flex-container'>
                      <div className='flex-item minutes-text'><DateSign date={m.date} /></div>
                      <div className='flex-item'>
                        <div className='minutes-text-bold'>{displayLabel(m.group, networkingGroup)}</div>
                        <div className='minutes-text'><i className='fa fa-user' />{' '}{m.person}</div>
                      </div>
                    </div>
                    <div className='minutes-notes'>{m.text}</div>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Panel.Body>
          </Panel>
        </PanelGroup>
      </form>
    )
  }
}

const config = {
  form: 'Meetings',
  fields: ['searchConsultation', 'searchRegulatory', 'searchNetworking']
}

const mapStateToProps = state => ({
  minutes: state.integrator.minutes,
  counsellingGroup: state.masterData.counsellingGroup,
  counsellingPlace: state.masterData.counsellingPlace,
  targetCategories: state.masterData.targetCategories,
  enumPersonRole: state.masterData.enumPersonRole,
  networkingGroup: state.masterData.networkingGroup,
  initialValues: {
    searchConsultation: '',
    searchRegulatory: '',
    searchNetworking: ''
  }
})

export default reduxForm(config, mapStateToProps)(Meetings)
