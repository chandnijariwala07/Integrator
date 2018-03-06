import React from 'react'
import PropTypes from 'prop-types'
import url from 'routes/tokens'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import { push } from 'react-router-redux'
import { translate } from 'services/locale'
import {
  getOccupationsMap,
  getOccupationSegments,
  getEducationsMap,
  getEducationSegments
} from 'redux/selectors/masterData'
import { Row, Col, Panel, ListGroup, ListGroupItem, OverlayTrigger, Tooltip, Button } from 'react-bootstrap'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import TextInput from 'components/TextInput/TextInput'
import FormField from 'components/FormField/FormField'
import Message from 'components/Message/Message'
import Select from 'components/Select/Select'
import Flags from 'components/Flags/Flags'

import { selectClientsData } from '../store/selectors'
import CreateClient from '../components/CreateClient'
import ClientRow from '../components/ClientRow'
import VitaInfo from '../components/VitaInfo'

const LanguageLevels = 'A1,A2,B1,B2,C1,C2,MS'.split(',')

class List extends React.Component {
  static propTypes = {
    hobbiesTree: PropTypes.array.isRequired,
    sectorsTree: PropTypes.array.isRequired,
    studiesTree: PropTypes.array.isRequired,
    asylumStatusList: PropTypes.array.isRequired,
    occupationsMap: PropTypes.object.isRequired,
    educationsMap: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    clients: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      sortBy: null,
      isDesc: false,
      list: [],
      showCreateClient: false
    }
  }

  _handleShowCreateClient = () => {
    this.setState({ showCreateClient: true })
  }

  _handleHideCreateClient = () => {
    this.setState({ showCreateClient: false })
  }

  _select = id => {
    this.props.dispatch(push(`${url.integrator.clientview}/${id}`))
  }

  _renderSort = field => {
    const { sortBy, isDesc } = this.state
    const asc = sortBy === field && !isDesc
    const desc = sortBy === field && isDesc
    const handle = e => {
      e.preventDefault()
      if (desc) {
        this.setState({ sortBy: null, isDesc: false })
      } else {
        this.setState({ sortBy: field, isDesc: sortBy === field })
      }
    }
    return <button className='sort' onClick={handle}>
      <div className={classnames('indicator', { asc, desc })}>
        <div className='asc' />
        <div className='desc' />
      </div>
      <div className='caption'><Message id={`integrator.clients.details.${field}.heading`} /></div>
    </button>
  }

  _getLanguageLevelHandler = l => e => {
    e.preventDefault()
    const { german } = this.props.fields
    const value = !german.value.length
      ? LanguageLevels.slice(LanguageLevels.indexOf(l))
      : german.value.includes(l)
        ? german.value.filter(i => i !== l)
        : [...german.value, l].sort()
    german.onChange(value)
  }

  _strcmp = (a, b) => {
    // const ia = a.indexOf('⚠')
    // const ib = b.indexOf('⚠')
    return a.localeCompare(b)
  }

  _sort = (a, b) => {
    const { sortBy, isDesc } = this.state
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

  _find = (tree, id) => tree.reduce((p, c) => {
    if (p) return p
    if (c.id === id) return c
    if (c.entries && c.entries.length) return this._find(c.entries, id)
  })

  _leafs = node => node.entries && node.entries.length
    ? node.entries
      .reduce((a, n) => {
        a.push(...this._leafs(n))
        return a
      }, [])
    : [node.id]

  render () {
    const {
      fields: {
        zip,
        isClient,
        german,
        hobbies,
        hobbiesSearch,
        sectors,
        sectorsSearch,
        studies,
        studiesSearch,
        asylum
      },
      clients,
      hobbiesTree,
      sectorsTree,
      studiesTree,
      asylumStatusList,
      occupationsMap,
      educationsMap
    } = this.props

    let list = clients.map(x => ({
      ...x,
      name: `${(x.vita.lastName || '⚠').trim()}, ${(x.vita.firstName || '⚠').trim()}`,
      zip: x.vita.zip || '⚠',
      appointment: x.stats.appointment ? x.stats.appointment.date : '⚠'
    }))
    if (zip.value) {
      list = list.filter(x => x.vita.zip && x.vita.zip.indexOf(zip.value) === 0)
    }
    if (isClient.value) {
      list = list.filter(x => x.client && x.client.own)
    }
    if (german.value.length) {
      list = list.filter(x => german.value.reduce((p, c) => p || c === x.stats.german, false))
    }
    if (hobbies.length) {
      list = list.filter(x => hobbies.reduce((p, c) => p || (x.vita.hobbies || []).includes(c.id.value), false))
    }
    if (sectors.length) {
      const occupations = sectors.reduce((a, i) => {
        a.push(...this._leafs(occupationsMap[i.id.value]))
        return a
      }, [])
      list = list.filter(x =>
        x.vita.workExperience && x.vita.workExperience.length &&
        x.vita.workExperience.reduce((p, c) => p || occupations.includes(c.occupation), false))
    }
    if (studies.length) {
      const educations = studies.reduce((a, i) => {
        a.push(...this._leafs(educationsMap[i.id.value]))
        return a
      }, [])
      list = list.filter(x =>
        x.vita.education && x.vita.education.length &&
        x.vita.education.reduce((p, c) => p || educations.includes(c.education), false))
    }
    if (asylum.length) {
      list = list.filter(x => asylum.reduce((p, c) => p || c.id.value === x.vita.asylumStatus, false))
    }
    if (this.state.sortBy) {
      list = list.sort(this._sort)
    }
    return <div className='integrator-clients'>
      <h1><Message id='integrator.clients.title' /></h1>
      <Row>
        <Col md={3}>
          <Panel className='filter-options'>
            <Panel.Heading>
              <Panel.Title componentClass='h3'>
                <Message id='integrator.clients.select.heading' />
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <TextInput field={zip} autocomplete='postal-code'
                label={<Message id='integrator.clients.select.zip.label' />}
                placeholder={translate('integrator.clients.select.zip.placeholder')} />
              <CheckboxInput field={isClient}
                label={<Message id='integrator.clients.select.intManagement.label' />} />
              <FormField className='language-levels' field={german}
                label={<Message id='integrator.clients.select.germanLevel.label' />}>
                {LanguageLevels.map(l =>
                  <button key={l}
                    className={classnames('btn-option', { active: german.value.includes(l) })}
                    onClick={this._getLanguageLevelHandler(l)}>{l}</button>
                )}
              </FormField>
              <Select max={-1} fields={hobbies} entries={hobbiesTree} search={hobbiesSearch}
                label={<Message id='integrator.clients.select.hobbies.label' />} />
              <Select max={-1} fields={sectors} entries={sectorsTree} search={sectorsSearch}
                label={<Message id='integrator.clients.select.jobSector.label' />} />
              <Select max={-1} fields={studies} entries={studiesTree} search={studiesSearch}
                label={<Message id='integrator.clients.select.study.label' />} />
              <Select max={-1} fields={asylum} entries={asylumStatusList}
                label={<Message id='integrator.clients.select.asylum.label' />} />
            </Panel.Body>
          </Panel>
        </Col>
        <Col md={9}>
          <Panel className='client-row-header'>
            <Panel.Body>
              <div className='client-row'>
                <div className='cell-photo' />
                <div className='cell-personal'>
                  {this._renderSort('name')}
                  {this._renderSort('zip')}
                </div>
                <div className='cell-language'>
                  <Flags code='DE' />
                </div>
                <div className='cell-appointment'>
                  {this._renderSort('appointment')}
                </div>
                <div className='cell-traffic-light' />
              </div>
            </Panel.Body>
          </Panel>
          <div className='create-button'>
            <CreateClient show={this.state.showCreateClient} onHide={this._handleHideCreateClient} />
            <Button bsStyle='success' onClick={this._handleShowCreateClient}>
              <i className='fa fa-user-plus' /> Verwalteten Klienten erstellen
            </Button>
          </div>
          <ListGroup>
            {list.map(d => // data object: { vita, client, tasks, appointments, messages, stats }
              <OverlayTrigger key={d.vita.userId} placement='left'
                overlay={<Tooltip id='overlay'><VitaInfo vita={d.client || d.vita} /></Tooltip>}>
                <ListGroupItem onClick={e => this._select(d.vita.userId)}
                  className={classnames('profile', { 'active': d.client, 'own-client': d.client && d.client.own })}>
                  <ClientRow data={d} />
                </ListGroupItem>
              </OverlayTrigger>
            )}
          </ListGroup>
        </Col>
      </Row>
    </div>
  }
}

const config = {
  form: 'ClientFilterForm',
  fields: [
    'zip',
    'isClient',
    'housing',
    'german',
    'hobbies[].id',
    'hobbiesSearch',
    'sectors[].id',
    'sectorsSearch',
    'studies[].id',
    'studiesSearch',
    'asylum[].id'
  ]
}

const mapStateToProps = state => ({
  hobbiesTree: state.masterData.hobbies,
  occupationsMap: getOccupationsMap(state),
  educationsMap: getEducationsMap(state),
  sectorsTree: getOccupationSegments(state),
  studiesTree: getEducationSegments(state),
  asylumStatusList: state.masterData.enumAsylumStatus.filter(i => i.value),
  clients: selectClientsData(state),
  initialValues: {
    zip: '',
    isClient: false,
    housing: 0,
    german: [],
    hobbies: [],
    hobbiesSearch: '',
    sectors: [],
    sectorsSearch: '',
    studies: [],
    studiesSearch: '',
    asylum: []
  }
})

export default reduxForm(config, mapStateToProps)(List)
