import React from 'react'
import PropTypes from 'prop-types'
import MessageCenter from 'modules/MessageCenter/MessageCenter'

const Messages = ({ data: { vita, messages }, integrator, modal, select }) =>
  <MessageCenter
    messages={messages}
    users={{
      [vita.userId]: {
        senderId: vita.userId,
        name: `${vita.firstName} ${vita.lastName}`
      },
      [integrator.id]: {
        senderId: integrator.id,
        name: `${integrator.firstName} ${integrator.lastName}`
      }
    }}
    select={select}
    id={modal}
  />

Messages.propTypes = {
  data: PropTypes.shape({
    vita: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired
  }).isRequired,
  integrator: PropTypes.object.isRequired,
  modal: PropTypes.string,
  select: PropTypes.func
}

export default Messages
