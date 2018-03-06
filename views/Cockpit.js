import React from 'react'
import url from 'routes/tokens'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectReducer } from 'redux/rootReducer'
import { Alert, Grid, Row, Col } from 'react-bootstrap'
import DashboardItem from 'components/Dashboard/DashboardItem'
import MessagesItem from 'components/Dashboard/MessagesItem'
import CockpitCalendar from '../components/CockpitCalendar'
import Markdown from 'components/Markdown/Markdown'
import EnsureData from '../EnsureData'
import reducer from '../store/reducer'

import '../assets/style.scss'

class CockpitView extends React.Component {
  static propTypes = {
    hash: PropTypes.string
  }

  static contextTypes = {
    store: PropTypes.object
  }

  componentWillMount () {
    const { store } = this.context
    injectReducer(store, { key: 'integrator', reducer })
  }

  render () {
    const { hash } = this.props
    return (
      <Grid className='dashboard-view integrator-dashboard-view'>
        <Alert bsStyle='info'>
          <Markdown id='socialworker.cockpit.hash.body' />
          <h4>{hash}</h4>
        </Alert>
        <Row>
          <Col md={4} sm={4}>
            <DashboardItem
              background='integrator.cockpit.clientOverview.image'
              captionHead='integrator.cockpit.clientOverview.body'
              linkLabel='integrator.cockpit.clientOverview.button'
              linkTo={url.integrator.clients} />
            <DashboardItem
              background='company.cockpit.search.image'
              captionHead='company.cockpit.search.header'
              linkLabel='company.cockpit.search.button'
              linkTo={url.org.search} />
            <DashboardItem
              background='integrator.cockpit.reports.image'
              captionHead='integrator.cockpit.reports.body'
              linkLabel='integrator.cockpit.reports.button' />
          </Col>

          <Col md={4} sm={4}>
            <MessagesItem prefix='socialworker.cockpit' unread={0} />
            <DashboardItem
              background='socialworker.cockpit.invitejobseeker.image'
              captionHead='socialworker.cockpit.inviteRefugees.body'
              linkLabel='socialworker.cockpit.inviteRefugees.button' />
            <DashboardItem
              background='socialworker.cockpit.invitecompany.image'
              captionHead='socialworker.cockpit.inviteCompanies.body'
              linkLabel='socialworker.cockpit.inviteCompanies.button' />
          </Col>

          <Col md={4} sm={4}>
            <EnsureData><CockpitCalendar /></EnsureData>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({ hash: (state.account.info.integrator || {}).hash })
export default connect(mapStateToProps)(CockpitView)
