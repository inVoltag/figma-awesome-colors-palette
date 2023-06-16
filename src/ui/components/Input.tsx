import * as React from 'react'

interface Props {
  id?: string
  type: string
  icon: { type: string; value: string }
  placeholder?: string
  value: string
  charactersLimit?: number
  min?: string
  max?: string
  step?: string
  isBlocked?: boolean
  feature: string
  isAutoFocus?: boolean
  onChange: React.FocusEventHandler<HTMLInputElement>
  onFocus: React.FocusEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
  onConfirm?: React.KeyboardEventHandler<HTMLInputElement>
}

export default class Input extends React.Component<Props> {
  static defaultProps = {
    step: '1',
    isBlocked: false,
    isAutoFocus: false,
  }

  // Direct actions
  onNudge = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.key === 'ArrowUp')
      (e.target as HTMLInputElement).value = (
        parseFloat((e.target as HTMLInputElement).value) +
        9 * parseFloat(this.props.step)
      ).toString()
    else if (e.shiftKey && e.key === 'ArrowDown')
      (e.target as HTMLInputElement).value = (
        parseFloat((e.target as HTMLInputElement).value) -
        9 * parseFloat(this.props.step)
      ).toString()
  }

  // Templates
  Color = () => {
    return (
      <div
        className={`input ${
          this.props.isBlocked ? 'input--blocked' : ''
        } input input--with-icon`}
      >
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="color"
          className="input__color"
          value={this.props.value}
          autoFocus={this.props.isAutoFocus}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="input"
          className="input__field"
          value={this.props.value.toUpperCase().substr(1, 6)}
          autoFocus={this.props.isAutoFocus}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  Number = () => {
    return (
      <div
        className={`input ${this.props.isBlocked ? 'input--blocked' : ''} ${
          this.props.icon.type === 'none' ? '' : 'input--with-icon'
        }`}
      >
        {this.props.icon.type != 'none' ? (
          <div
            className={`icon${
              this.props.icon.type === 'icon'
                ? ` icon--${this.props.icon.value}`
                : ''
            }`}
          >
            {this.props.icon.type === 'letter' ? this.props.icon.value : ''}
          </div>
        ) : null}
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="number"
          className="input__field"
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          autoFocus={this.props.isAutoFocus}
          onKeyDown={this.onNudge}
          onKeyPress={this.props.onConfirm}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  Text = () => {
    return (
      <div
        className={`input ${this.props.isBlocked ? 'input--blocked' : ''} ${
          this.props.icon.type === 'none' ? '' : ' input--with-icon'
        }`}
      >
        {this.props.icon.type != 'none' ? (
          <div
            className={`icon${
              this.props.icon.type === 'icon'
                ? ` icon--${this.props.icon.value}`
                : ''
            }`}
          >
            {this.props.icon.type === 'letter' ? this.props.icon.value : ''}
          </div>
        ) : null}
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="text"
          className="input__field"
          placeholder={this.props.placeholder}
          value={this.props.value}
          maxLength={this.props.charactersLimit}
          autoFocus={this.props.isAutoFocus}
          onKeyPress={this.props.onConfirm}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.type === 'number' ? <this.Number /> : null}
        {this.props.type === 'color' ? <this.Color /> : null}
        {this.props.type === 'text' ? <this.Text /> : null}
      </>
    )
  }
}
