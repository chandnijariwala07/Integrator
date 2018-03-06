import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import { translate } from 'services/locale'
import { save, send, printed, accept, reject } from '../store/actionCreators'
import { PanelGroup, Panel, Button, ButtonToolbar, Row, Col, Alert } from 'react-bootstrap'
import CheckboxInput from 'components/CheckboxInput/CheckboxInput'
import DatePicker from 'components/DatePicker/DatePicker'
import TextInput from 'components/TextInput/TextInput'
import Message from 'components/Message/Message'
import Select from 'components/Select/Select'
import AddressSelect from './AddressSelect'
import PrintView from './PrintView'
import ComboBox from 'components/ComboBox/ComboBox'

import '../assets/IntegrationPlan.scss'

const msg = key => <Message id={`integrator.details.integrationPlan.${key}`} />

const sortBy = (prop, isDesc) => (a, b) => {
  const d = isDesc ? -1 : 1
  if (!a[prop]) {
    if (!b[prop]) return 0
    return d
  }
  if (!b[prop]) return -d
  return typeof a[prop] === 'string'
    ? d * a[prop].localeCompare(b[prop])
    : d * (a[prop] - b[prop])
}

class IntegrationPlan extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    targetCategories: PropTypes.array.isRequired,
    targetSuggestions: PropTypes.object.isRequired,
    enumTargetState: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    target: PropTypes.string
  }

  _handleDrop = (i, j) => {
    const { values } = this.props
    this._handleSubmit({
      ...values,
      targets: j !== undefined
        ? values.targets.map((t, x) => i !== x ? t : { ...t, subTargets: t.subTargets.filter((s, y) => j !== y) })
        : values.targets.filter((t, x) => i !== x)
    })
  }

  _handleSubmit = values => {
    const { dispatch, data, resetForm } = this.props
    dispatch(save({
      ...data,
      client: {
        ...data.client,
        targets: values.targets
      }
    })).then(resetForm)
  }

  render () {
    const {
      targetCategories,
      targetSuggestions,
      enumTargetState,
      fields: { targets },
      data,
      handleSubmit,
      resetForm,
      dispatch,
      pristine,
      target,
      select
    } = this.props
    const [tkey, skey] = (target || '').split(',')
    const categories = targetCategories.sort(sortBy('label'))
    const maybeEntries = o => o ? o.entries : []
    const selectTargetSuggestions = id => (id && targetSuggestions[id]) || []
    const selectSubtargetSuggestions = (id, subject) =>
      maybeEntries(selectTargetSuggestions(id).find(s => s.label === subject))
    const anyProposed = data.client.targets.reduce((r, t) => r || t.state === 'Proposed', false)
    const disabled = !data.client.own || anyProposed
    const saved = (i, j) => j !== undefined
      ? (data.client.targets[i] || { subTargets: [] }).subTargets[j] || {}
      : data.client.targets[i] || { subTargets: [] }
    const stateLabel = id => (enumTargetState.find(s => s.id === id) || {}).label
    const stateIcon = id => (enumTargetState.find(s => s.id === id) || {}).icon
    const header = index => index < data.client.targets.length ? (
      <span>
        {saved(index).subject}
        <small className={classnames('pull-right', saved(index).state.toLowerCase())}>
          {stateLabel(saved(index).state) + ' '}
          <i className={`fa fa-${stateIcon(saved(index).state)}`} />
        </small>
      </span>
    ) : (
      <span>
        {`Neues Ziel ${index + 1}`}
        <small className='pull-right'>Neu <i className='fa fa-asterisk' /></small>
      </span>
    )
    const subheader = (i, j) => i < data.client.targets.length && j < data.client.targets[i].subTargets.length
      ? <span>{saved(i, j).subject}</span>
      : <span>{`Neues Unterziel ${j + 1}`}</span>
    const dirtyWarning = <span>Ungespeicherte Änderungen</span>
    const submit = handleSubmit(this._handleSubmit)
    return (
      <form onSubmit={submit} className='integrator-plan padd-b-20'>
        {!data.client.own || !anyProposed ||
          <Alert bsStyle='warning'>
            Der Integrationsplan ist zur Bearbeitung gesperrt, da dem Klienten Ziele vorgelegt wurden.
            Sollte dies per Nachricht geschehen sein, wird eine Antwort automatisch eingetragen.
            Wurde die Vereinbarung hingegen gedruckt und unterschrieben, so können Sie das Ergebnis hier
            angeben:
            <h4 className='padd-t-20 text-center'>Wurden die Ziele akzeptiert?</h4>
            <Row className='padd-t-20'>
              <Col xs={8} xsOffset={2} md={3} className='padd-b-10'>
                <Button bsStyle='danger' block onClick={e => { dispatch(reject(data)) }}>
                  <i className='fa fa-remove' /> NEIN
                </Button>
              </Col>
              <Col xs={8} xsOffset={2} md={3} className='padd-b-10'>
                <Button bsStyle='success' block onClick={e => { dispatch(accept(data)) }}>
                  <i className='fa fa-check' /> JA
                </Button>
              </Col>
            </Row>
          </Alert>
        }
        {!targets.length && <h4 className='empty-list'>Es wurden bisher keine Ziele angelegt.</h4>}
        {!targets.length || <PanelGroup accordion activeKey={tkey} id='integration-plan-targets'
          onSelect={key => select(tkey && ~key.indexOf(tkey) ? '' : key)}>
          {targets.map(({ id, subject, details, category, dueDate, supporter, state, subTargets, confirm }, i) =>
            <Panel eventKey={`${i}`} key={`${i}`} onToggle={e => subject.onBlur()}>
              <Panel.Heading>
                <Panel.Title componentClass='span'>
                  <Panel.Toggle>
                    {header(i)}
                  </Panel.Toggle>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Row>
                  <Col md={4}>
                    <Select field={category} label={msg('targetType.heading')} entries={categories}
                      disabled={disabled} dirtyWarning={dirtyWarning} />
                  </Col>
                  <Col md={8}>
                    <ComboBox field={subject} label={msg('targetOverview.heading')}
                      entries={selectTargetSuggestions(category.value)}
                      disabled={disabled} dirtyWarning={dirtyWarning} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <TextInput field={details} rows={6} label={msg('targetDetail.heading')}
                      className='resize-vertical' disabled={disabled} dirtyWarning={dirtyWarning} />
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <DatePicker field={dueDate} label={msg('targetDueDate.heading')}
                      disabled={disabled} dirtyWarning={dirtyWarning} server />
                  </Col>
                  <Col md={4}>
                    <AddressSelect field={supporter} data={data} label={msg('targetSupportResponsible.label')}
                      disabled={disabled} dirtyWarning={dirtyWarning} />
                  </Col>
                  <Col md={4}>
                    <Select field={state} label={'Zielerreichung'} dirtyWarning={dirtyWarning}
                      disabled={disabled || ['New', 'Proposed'].includes(state.value)}
                      entries={['New', 'Proposed'].includes(state.value) ? enumTargetState : enumTargetState.slice(2)}
                      format={i => <span><i className={`fa fa-${stateIcon(i.id)}`} /> {i.label}</span>} />
                  </Col>
                </Row>
                {disabled ||
                  <Row className='form-footer'>
                    {!['New', 'Proposed'].includes(state.value) && (subject.value !== saved(i).subject ||
                      details.value !== saved(i).details || dueDate.value < saved(i).dueDate ||
                      !!subTargets.filter((s, j) => !s.id ||
                        s.subject.value !== saved(i, j).subject ||
                        s.details.value !== saved(i, j).details ||
                        s.dueDate.value < saved(i, j).dueDate).length) &&
                        <Col xs={12}>
                          <Alert bsStyle='warning' className='big-sign'>
                            <i className='fa fa-warning' />
                            <div>
                              Änderungen an den Feldern Ziele-Übersicht oder Ziele-Details oder Vorverlegung des Termins
                              erfordern eine erneute Bestätigung des Klienten. Dies gilt auch für entsprechende
                              Änderungen an Unterzielen. Nach dem Speichern wird die Zielerreichung daher auf
                              <strong> Neu&nbsp;<i className='fa fa-asterisk' /> </strong>zurückgesetzt.
                            </div>
                          </Alert>
                        </Col>
                    }
                    <Col md={2}>
                      <Button bsStyle='danger' disabled={!confirm.value}
                        onClick={e => { this._handleDrop(i) }} block>
                        <i className='fa fa-trash' /> Löschen
                      </Button>
                    </Col>
                    <Col md={2}>
                      <CheckboxInput field={confirm} label='Sicher?' inline />
                    </Col>
                    <Col md={3} mdOffset={2}>
                      <Button onClick={resetForm} block disabled={pristine}>
                        <i className='fa fa-history' /> Zurücksetzen
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button bsStyle='primary' type='submit' block disabled={pristine}>
                        <i className='fa fa-upload' /> Speichern
                      </Button>
                    </Col>
                  </Row>
                }

                <PanelGroup accordion activeKey={`${tkey},${skey}`} id='integration-plan-subtargets'
                  onSelect={key => select(key === target ? tkey : key)}>
                  {subTargets.map((st, j) =>
                    <Panel eventKey={`${i},${j}`} key={`${i},${j}`} onToggle={e => st.subject.onBlur()}>
                      <Panel.Heading>
                        <Panel.Title componentClass='span'>
                          <Panel.Toggle>
                            {subheader(i, j)}
                          </Panel.Toggle>
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <Row>
                          <Col md={8}>
                            <ComboBox field={st.subject} label={msg('subTargets.label')}
                              entries={selectSubtargetSuggestions(category.value, subject.value)}
                              disabled={disabled} dirtyWarning={dirtyWarning} />
                            <TextInput field={st.details} rows={6} label={msg('targetDetail.heading')}
                              className='resize-vertical' disabled={disabled} dirtyWarning={dirtyWarning} />
                          </Col>
                          <Col md={4}>
                            <DatePicker field={st.dueDate} label={msg('subTargetDueDate.label')}
                              disabled={disabled} dirtyWarning={dirtyWarning} server />
                            <AddressSelect field={st.supporter} data={data} disabled={disabled}
                              label={msg('targetSupportResponsible.label')} dirtyWarning={dirtyWarning} />
                            {disabled ||
                              <div className='buttons'>
                                <Button bsStyle='danger' disabled={!st.confirm.value}
                                  onClick={e => { this._handleDrop(i, j) }}>
                                  <i className='fa fa-trash' /> Löschen
                                </Button>
                                <CheckboxInput field={st.confirm} label='Sicher?' inline />
                                <Button onClick={resetForm} block disabled={pristine}>
                                  <i className='fa fa-history' /> Zurücksetzen
                                </Button>
                                <Button bsStyle='primary' type='submit' block disabled={pristine}>
                                  <i className='fa fa-upload' /> Speichern
                                </Button>
                              </div>
                            }
                          </Col>
                          {!['New', 'Proposed'].includes(state.value) && (
                            st.subject.value !== saved(i, j).subject ||
                            st.details.value !== saved(i, j).details ||
                            st.dueDate.value < saved(i, j).dueDate) &&
                            <Col xs={12}>
                              <Alert bsStyle='warning' className='big-sign'>
                                <i className='fa fa-warning' />
                                <div>
                                  Änderungen an den Feldern Unterziel oder Ziele-Details oder Vorverlegung des
                                  Termins erfordern eine erneute Bestätigung des Klienten. Nach dem Speichern wird die
                                  Zielerreichung daher auf<strong> Neu&nbsp;<i className='fa fa-asterisk' /> </strong>
                                  zurückgesetzt.
                                </div>
                              </Alert>
                            </Col>
                          }
                        </Row>
                      </Panel.Body>
                    </Panel>
                  )}
                </PanelGroup>
                {disabled ||
                  <Button bsStyle='success' type='button' onClick={() => {
                    select(`${i},${subTargets.length}`)
                    subTargets.addField({ confirm: false })
                  }}><i className='fa fa-plus-square' /> Unterziel hinzufügen</Button>
                }
              </Panel.Body>
            </Panel>
          )}
        </PanelGroup>}
        {disabled ||
          <Button bsStyle='success' type='button' onClick={() => {
            select(`${targets.length}`)
            targets.addField({ state: 'New', confirm: false })
          }}><i className='fa fa-plus-square' /> Ziel hinzufügen</Button>
        }
        {!data.client.own ||
          <ButtonToolbar className='pull-right'>
            <Button bsStyle='primary' onClick={e => { dispatch(printed(data)); window.print() }}>
              <i className='fa fa-print' /> {msg('printTarget.button')}
            </Button>
            <Button bsStyle='primary' onClick={e => { dispatch(send(data)) }} disabled={data.inManaged}>
              <i className='fa fa-send-o' /> {msg('sendTarget.button')}
            </Button>
          </ButtonToolbar>
        }
        <PrintView data={data} />
      </form>
    )
  }
}

const config = {
  form: 'IntegrationPlanForm',
  fields: [
    'targets[].id',
    'targets[].subject',
    'targets[].details',
    'targets[].category',
    'targets[].dueDate',
    'targets[].supporter',
    'targets[].state',
    'targets[].confirm',
    'targets[].subTargets[].id',
    'targets[].subTargets[].subject',
    'targets[].subTargets[].details',
    'targets[].subTargets[].supporter',
    'targets[].subTargets[].dueDate',
    'targets[].subTargets[].confirm'
  ],
  validate: values => ({
    targets: values.targets.map(t => ({
      subject: t.subject ? undefined : translate('field.error.required'),
      dueDate: t.dueDate ? undefined : translate('field.error.required'),
      subTargets: t.subTargets.map(s => ({
        subject: s.subject ? undefined : translate('field.error.required'),
        dueDate: s.dueDate ? undefined : translate('field.error.required')
      }))
    }))
  })
}

const mapStateToProps = (state, ownProps) => ({
  targetCategories: state.masterData.targetCategories,
  targetSuggestions: state.masterData.targetSuggestions,
  subtargetCluster: state.masterData.subtargetCluster,
  enumTargetState: state.masterData.enumTargetState,
  initialValues: {
    targets: ownProps.data.client.targets.map(target => {
      target.subject = target.subject || ''
      target.details = target.details || ''
      target.subTargets = target.subTargets.map(subTarget => {
        subTarget.subject = subTarget.subject || ''
        subTarget.details = subTarget.details || ''
        subTarget.confirm = false
        return subTarget
      })
      target.confirm = false
      return target
    })
  }
})

export default reduxForm(config, mapStateToProps)(IntegrationPlan)
