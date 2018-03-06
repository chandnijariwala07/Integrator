import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'services/locale'
import classnames from 'classnames'
import FormField from 'components/FormField/FormField'
import Addressbook from './Addressbook'

class AddressSelect extends React.Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    format: PropTypes.string,
    help: PropTypes.node,
    label: PropTypes.node,
    locale: PropTypes.string,
    isRtl: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    before: PropTypes.node,
    after: PropTypes.node,
    placeholder: PropTypes.string,
    addressbook: PropTypes.object,
    inline: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    dirtyWarning: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    childrenBottom: PropTypes.node
  };

  constructor () {
    super()
    this.state = {
      show: false
    }
  }

  render () {
    const {
      field,
      help,
      label,
      data,
      format,
      placeholder,
      addressbook,
      dirtyWarning,
      before,
      after,
      inline,
      className,
      disabled,
      childrenBottom
    } = this.props
    const { show } = this.state
    const handleShow = e => {
      e && e.stopPropagation && e.stopPropagation()
      if (disabled) return
      this.setState({ show: true })
      const { onFocus } = this.props;
      (onFocus || field.onFocus)()
    }
    const handleHide = e => {
      e && e.stopPropagation && e.stopPropagation()
      this.setState({ show: false })
      const { onBlur } = this.props;
      (onBlur || field.onBlur)()
    }
    const handleChange = person => {
      const { onChange } = this.props;
      (onChange || field.onChange)(person.id)
      handleHide()
    }
    const handleClear = e => {
      e.stopPropagation()
      const { onChange } = this.props;
      (onChange || field.onChange)(null)
    }
    const selected = addressbook[field.value]
    const value = format
      ? format(field.value, selected)
      : selected && `${selected.lastName}, ${selected.firstName}`
    const fakeInput =
      <a className={classnames('picker-value form-control', { disabled })} onClick={handleShow}>
        {value || <div className='placeholder'>{placeholder || translate('general.choose')}</div>}
        {disabled || !value ||
          <i className='fa fa-times-circle form-control-feedback clear' onClick={handleClear} />}
      </a>
    return (
      <FormField field={field} help={help} label={label} dirtyWarning={dirtyWarning} disabled={disabled}
        className={classnames(className, { inline, disabled })} inputClass='form-input'>
        {(before || after) ? this._createGroup(fakeInput, before, after) : fakeInput}
        {childrenBottom}
        <Addressbook data={data} show={show} onHide={handleHide} onChange={handleChange} value={field.value} />
      </FormField>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  addressbook: [
    ...(state.integrator.clients.people || []),
    ...(ownProps.data ? ownProps.data.client.people : [])
  ].reduce((m, p) => {
    m[p.id] = p
    return m
  }, {}),
  locale: state.i18n.locale,
  isRtl: state.i18n.isRtl
})
export default connect(mapStateToProps)(AddressSelect)
