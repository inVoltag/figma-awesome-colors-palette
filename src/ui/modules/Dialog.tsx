import * as React from 'react'
import { PopIn } from '@a-ng-d/figmug.layouts.popin'

interface Props {
  title: string
  actions: {
    primary?: {
      label: string
      action: React.ReactEventHandler | (() => void)
    }
    secondary?: {
      label: string
      action: React.ReactEventHandler | (() => void)
    }
  }
  indicator?: string
  children: React.ReactNode
  onClose: React.ReactEventHandler
}

export default class Dialog extends React.Component<Props> {
  render() {
    return (
      <div className="dialog">
        <PopIn
          title={this.props.title}
          actions={this.props.actions}
          indicator={this.props.indicator}
          onClose={this.props.onClose}
        >
          {this.props.children}
        </PopIn>
      </div>
    )
  }
}
