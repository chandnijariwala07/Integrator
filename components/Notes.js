import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { comment } from '../store/actionCreators'
import { Panel, PanelGroup, Button, Table } from 'react-bootstrap'
import { now, srv2mom } from 'services/dateconversion'
import TextInput from 'components/TextInput/TextInput'
import Message from 'components/Message/Message'
import Select from 'components/Select/Select'

const Sharing = {
  private: 'None',
  shared: 'Supporters',
  client: 'Client'
}

class Notes extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  _handleSubmit = values => {
    const { dispatch, resetForm, data } = this.props
    const level = (values.private.message && 'private') ||
      (values.shared.message && 'shared') ||
      (values.client.message && 'client')
    if (!level) return
    dispatch(comment(data, {
      category: values[level].category,
      message: values[level].message,
      sharing: Sharing[level]
    })).then(resetForm)
  }

  render () {
    const { targetCategories, fields, data, handleSubmit } = this.props
    const label = cat => {
      const category = targetCategories.filter(c => c.id).find(c => c.id === cat)
      return category ? category.label : ''
    }
    const disabled = !data.client.own
    return (
      <form onSubmit={handleSubmit(this._handleSubmit)} className='integrator-notes'>
        <PanelGroup id='integrator-notes-panels'>

          {!disabled &&
            <Panel eventKey='private'>
              <Panel.Heading>
                <Panel.Toggle>
                  <Panel.Title componentClass='h4'>
                    <Message id='integrator.details.notes.privateNotes.heading' />
                  </Panel.Title>
                Diese Notizen sind nur für Sie selbst einsehbar und werden nicht geteilt.
                </Panel.Toggle>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Table hover>
                  <thead>
                    <tr>
                      <th width={120}>Datum</th>
                      <th width={160}>Cluster</th>
                      <th>Notiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.client.notes.private.map((n, i) => <tr key={i}>
                      <td>{srv2mom(n.timestamp).format('L')}</td>
                      <td>{label(n.category)}</td>
                      <td>{n.message}</td>
                    </tr>)}
                    <tr className='create-note'>
                      <td>{now().format('L')}</td>
                      <td><Select field={fields.private.category} entries={targetCategories} /></td>
                      <td><TextInput field={fields.private.message} placeholder='Bitte Notiz eingeben' /></td>
                    </tr>
                  </tbody>
                </Table>
                <Button bsStyle='success' className='pull-right' type='submit'>
                  <i className='fa fa-plus' /> Notiz hinzufügen
                </Button>
              </Panel.Body>
            </Panel>
          }

          <Panel eventKey='shared'>
            <Panel.Heading>
              <Panel.Toggle>
                <Panel.Title componentClass='h4'>
                  <Message id='integrator.details.notes.sharedWithSupportersNotes.heading' />
                </Panel.Title>
                Diese Notizen sind von allen Integrationsmanagern einsehbar.
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Body collapsible>
              <Table hover>
                <thead>
                  <tr>
                    <th width={120}>Datum</th>
                    <th width={160}>Cluster</th>
                    <th>Notiz</th>
                  </tr>
                </thead>
                <tbody>
                  {data.client.notes.shared.map((n, i) => <tr key={i}>
                    <td>{srv2mom(n.timestamp).format('L')}</td>
                    <td>{label(n.category)}</td>
                    <td>{n.message}</td>
                  </tr>)}
                  <tr className='create-note'>
                    <td>{now().format('L')}</td>
                    <td><Select field={fields.shared.category} entries={targetCategories} /></td>
                    <td><TextInput field={fields.shared.message} placeholder='Bitte Notiz eingeben' /></td>
                  </tr>
                </tbody>
              </Table>
              <Button bsStyle='success' className='pull-right' type='submit'>
                <i className='fa fa-plus' /> Notiz hinzufügen
              </Button>
            </Panel.Body>
          </Panel>

          {!disabled && !data.isManaged &&
            <Panel eventKey='client'>
              <Panel.Heading>
                <Panel.Toggle>
                  <Panel.Title componentClass='h4'>
                    <Message id='integrator.details.notes.sharedWithClientNotes.heading' />
                  </Panel.Title>
                  Diese Notizen sind auch für <b>{data.vita.lastName}, {data.vita.firstName}</b> einsehbar.
                </Panel.Toggle>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Table hover>
                  <thead>
                    <tr>
                      <th width={120}>Datum</th>
                      <th width={160}>Cluster</th>
                      <th>Notiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.client.notes.client.map((n, i) => <tr key={i}>
                      <td>{srv2mom(n.timestamp).format('L')}</td>
                      <td>{label(n.category)}</td>
                      <td>{n.message}</td>
                    </tr>)}
                    <tr className='create-note'>
                      <td>{now().format('L')}</td>
                      <td><Select field={fields.client.category} entries={targetCategories} /></td>
                      <td><TextInput field={fields.client.message} placeholder='Bitte Notiz eingeben' /></td>
                    </tr>
                  </tbody>
                </Table>
                <Button bsStyle='success' className='pull-right' type='submit'>
                  <i className='fa fa-plus' /> Notiz hinzufügen
                </Button>
              </Panel.Body>
            </Panel>
          }

        </PanelGroup>
      </form>
    )
  }
}

Notes.propTypes = {
  targetCategories: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  target: PropTypes.string,
  select: PropTypes.func.isRequired
}

const config = {
  form: 'IntegratorNotesForm',
  fields: [
    'private.category',
    'private.message',
    'shared.category',
    'shared.message',
    'client.category',
    'client.message'
  ]
}

const mapStateToProps = (state, ownProps) => ({
  targetCategories: state.masterData.targetCategories,
  notes: ownProps.data.client.notes,
  initialValues: {
    private: { category: 0, message: '' },
    shared: { category: 0, message: '' },
    client: { category: 0, message: '' }
  }
})

export default reduxForm(config, mapStateToProps)(Notes)
