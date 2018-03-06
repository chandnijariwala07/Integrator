import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router'
import url from 'routes/tokens'
import { selectClientsData } from '../store/selectors'
import { Col, Panel, Grid, Row, Tabs, Tab } from 'react-bootstrap'
import Markdown from 'components/Markdown/Markdown'
import Message from 'components/Message/Message'
import StateButton from '../components/StateButton'
import IntegrationPlan from '../components/IntegrationPlan'
import PersonalData from '../components/PersonalData'
import ProfilePhoto from '../components/ProfilePhoto'
import Download from '../components/Download'
import VitaInfo from '../components/VitaInfo'
import Calendar from '../components/Calendar'
import Messages from '../components/Messages'
import Meetings from '../components/Meetings'
import Notes from '../components/Notes'
import Vita from '../components/Vita'

const Details = ({ data, userInfo, dispatch, colleagues, params: { tab, modal, id } }) => {
  tab = tab || 'calendar'
  const selectTab = tab => dispatch(push(`${url.integrator.clientview}/${data.vita.userId}/${tab}`))
  const selectModal = (m, id) => {
    const suffix = !m ? '' : !id ? `/${m}` : `/${m}/${id}`
    return dispatch(push(`${url.integrator.clientview}/${data.vita.userId}/${tab}${suffix}`))
  }
  const integratorId = (data.client && data.client.integrator) || (data.vita && data.vita.invitedBy)
  return <Grid className='integrator-client padd-b-20'>
    <h2><Message id='integrator.details.title' /></h2>
    <Row>
      <Col md={3}>
        <div className='padd-b-10'>
          <Link to={url.integrator.clients} className='btn btn-block btn-default'>
            <i className='fa fa-chevron-left' /> <Message id='general.back' />
          </Link>
        </div>
        {data.vita &&
          <div>
            <div className='padd-b-10'>
              <StateButton data={data}
                integrator={colleagues.find(c => c.id === integratorId)}
                userInfo={userInfo}
                dispatch={dispatch} />
            </div>
            <Panel>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  <Message id='integrator.details.info.heading' />
                  {data.isManaged && <div className='label label-primary pull-right'>Verwaltet</div>}
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <ProfilePhoto src={data.vita.photo} />
                </div>
                <VitaInfo vita={data.client || data.vita} />
              </Panel.Body>
            </Panel>
            {data.isManaged || <Download userId={data.vita.userId} />}
          </div>
        }
      </Col>

      <Col md={9}>
        {data.vita
          ? <Tabs defaultActiveKey={tab} id='imClientTabs' onSelect={selectTab} bsStyle='pills'>
            <hr />
            <Tab eventKey='calendar' title={<Message id='integrator.details.tasks.heading' />}>
              <Calendar data={data} userInfo={userInfo} colleagues={colleagues}
                modal={tab === 'calendar' ? modal : undefined}
                id={tab === 'calendar' ? id : undefined}
                select={selectModal}
                dispatch={dispatch} />
            </Tab>
            <Tab eventKey='plan' disabled={!data.client}
              title={<Message id='integrator.details.integrationPlan.heading' />}>
              {!data.client ||
                <IntegrationPlan data={data} target={tab === 'plan' ? modal : undefined} select={selectModal} />
              }
            </Tab>
            <Tab eventKey='data' disabled={!data.client}
              title={<Message id='integrator.details.personalData.heading' />}>
              {!data.client ||
                <PersonalData data={data} accordion={tab === 'data' ? modal : undefined} select={selectModal} />}
            </Tab>
            <Tab eventKey='vita' disabled={data.isManaged} title={<Message id='integrator.details.cv.heading' />}>
              {data.isManaged ||
                <Vita data={data} />}
            </Tab>
            <Tab eventKey='messages' disabled={data.isManaged}
              title={<Message id='integrator.details.messages.heading' />}>
              {data.isManaged ||
                <Messages data={data} integrator={userInfo}
                  modal={tab === 'messages' ? modal : undefined} select={selectModal} />}
            </Tab>
            <Tab eventKey='notes' disabled={!data.client} title={<Message id='integrator.details.notes.heading' />}>
              {!data.client ||
                <Notes data={data} target={tab === 'notes' ? modal : undefined} select={selectModal} />}
            </Tab>
            <Tab eventKey='meetings' disabled={!data.minutes} title='Gesprächsnotizen'>
              {!data.minutes ||
                <Meetings data={data} target={tab === 'meetings' ? modal : undefined} select={selectModal} />}
            </Tab>
          </Tabs>
          : <div className='404-not-found'><Markdown id='general.404.text' /></div>
        }
      </Col>
    </Row>
  </Grid>
}

Details.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
  colleagues: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
}

Details.path = `${url.integrator.clientview}/:userId(/:tab(/:modal(/:id)))`

const mapStateToProps = (state, ownProps) => ({
  data: selectClientsData(state).find(data => data.vita.userId === ownProps.params.userId) || {},
  userInfo: state.account.info,
  colleagues: state.integrator.clients.colleagues
})

export default connect(mapStateToProps)(Details)
