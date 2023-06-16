import * as React from 'react'
import Feature from '../components/Feature'
import Icon from './../modules/Icon'
import Message from '../components/Message'
import Shortcuts from '../modules/Shortcuts'
import features from '../../utils/features'

interface Props {
  planStatus: string
  onReopenHighlight: React.MouseEventHandler
}

export default class Onboarding extends React.Component<Props> {
  render() {
    return (
      <>
        <section>
          <div className="onboarding controls__control">
            <Icon size={48} />
            <Message
              icon="list-tile"
              messages={[
                'Select your source colors (solid colors only) on the Figma/Figjam canvas to create a UI Color Palette',
              ]}
            />
            <div className="type">－ or －</div>
            <Message
              icon="theme"
              messages={['Select a UI Color Palette to edit it']}
            />
          </div>
        </section>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SHORTCUTS').isActive
          }
        >
          <Shortcuts
            actions={[
              {
                label: 'Read the documentation',
                isLink: true,
                url: 'https://docs.ui-color-palette.com',
                action: null,
              },
              {
                label: 'Give feedback',
                isLink: true,
                url: 'https://uicp.link/feedback',
                action: null,
              },
              {
                label: "What's new",
                isLink: false,
                url: '',
                action: this.props.onReopenHighlight,
              },
            ]}
            planStatus={this.props.planStatus}
          />
        </Feature>
      </>
    )
  }
}
