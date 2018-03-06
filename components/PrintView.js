import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { srv2mom } from 'services/dateconversion'
import Markdown from 'components/Markdown/Markdown'
import { getTargetCategoriesMap, maybeLabel } from 'redux/selectors/masterData'

import '../assets/PrintView.scss'

const Person = ({ person }) => person
  ? <span>{person.lastName}, {person.firstName}</span>
  : <span>Keiner zugeordnet</span>

Person.propTypes = {
  person: PropTypes.object
}

class PrintView extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    targets: PropTypes.array.isRequired,
    integrator: PropTypes.string.isRequired,
    clientname: PropTypes.string.isRequired,
    format: PropTypes.func.isRequired,
    person: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    replacements: PropTypes.object.isRequired
  }

  componentDidMount () {
    const node = ReactDOM.findDOMNode(this)
    document.body.appendChild(node)
  }

  componentWillUnmount () {
    const node = ReactDOM.findDOMNode(this)
    document.body.removeChild(node)
  }

  render () {
    const { targets, format, person, label, integrator, clientname, replacements } = this.props
    return (
      <div className='print-view'>
        <h2>Zielvereinbarung</h2>
        {targets
          .filter(({ state }) => ['New', 'Proposed'].includes(state))
          .map(({ subject, details, category, dueDate, supporter, subTargets }, i) =>
            <div className='target' key={i}>
              <h4>
                {i + 1}. {subject}
                <small className='pull-right'>
                  <label className='label'>{label(category)}</label>
                </small>
              </h4>
              {details && <p className='details'>{details}</p>}
              <p className='due-date'>Fällig am: <b>{format(dueDate)}</b></p>
              <p className='supporter'>Unterstützer: <Person person={person(supporter)} /></p>
              {!subTargets.length || <h5>Unterziele</h5>}
              {!subTargets.length || subTargets.map(({ subject, details, dueDate, supporter }, j) =>
                <div className='subtarget' key={j}>
                  <h6>{subject}</h6>
                  <p className='details'>{details}</p>
                  <p className='due-date'>Fällig am: <b>{format(dueDate)}</b></p>
                  <p className='supporter'>Unterstützer: <Person person={person(supporter)} /></p>
                </div>
              )}
            </div>
          )
        }
        <Markdown id='integrator.plan.agreement' values={replacements} />
        <div className='signatures'>
          <div className='integrator'>
            {integrator}
          </div>
          <div className='clientname'>
            {clientname}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const addressbook = { ...state.integrator.clients.people, ...ownProps.data.client.people }
  const categories = getTargetCategoriesMap(state)
  return {
    targets: ownProps.data.client.targets,
    label: id => maybeLabel(categories, id),
    format: date => date ? srv2mom(date).format('L') : '',
    person: id => addressbook[id] || null,
    integrator: `${state.account.info.firstName} ${state.account.info.lastName}`,
    clientname: `${ownProps.data.vita.firstName} ${ownProps.data.vita.lastName}`,
    replacements: {
      integratorFirstName: state.account.info.firstName,
      integratorLastName: state.account.info.lastName,
      jobseekerFirstName: ownProps.data.vita.firstName,
      jobseekerLastName: ownProps.data.vita.lastName
    }
  }
}

export default connect(mapStateToProps)(PrintView)
