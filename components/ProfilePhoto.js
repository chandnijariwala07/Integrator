import React from 'react'
import PropTypes from 'prop-types'
import noPhoto from '../assets/no-photo.png'

const prefix = src => src.startsWith('//') ? src : `//lqemedia.blob.core.windows.net/users/${src}`

const ProfilePhoto = ({ src }) =>
  <img src={src ? prefix(src) : noPhoto} style={{ maxWidth: '100%' }} />
ProfilePhoto.propTypes = { src: PropTypes.string }
export default ProfilePhoto
