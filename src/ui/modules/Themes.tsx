import * as React from 'react'
import chroma from 'chroma-js'
import type {
  HoveredColor,
  SelectedColor,
  ThemeConfiguration,
} from '../../utils/types'
import Button from '../components/Button'
import Message from '../components/Message'
import Actions from './Actions'
import { locals } from '../../content/locals'

interface Props {
  themes: Array<ThemeConfiguration>
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
  view: string
  editorType: string
  planStatus: string
  lang: string
  onChangeColor: React.ChangeEventHandler
  onAddTheme: React.MouseEventHandler
  onChangeSelection: React.ChangeEventHandler
  onDragChange: (
    id: string,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => void
  onDropOutside: React.ChangeEventHandler
  onChangeOrder: React.ChangeEventHandler
  onCreateLocalStyles: () => void
  onUpdateLocalStyles: () => void
  onCreateLocalVariables: () => void
  onUpdateLocalVariables: () => void
}

export default class Themes extends React.Component<Props> {
  render() {
    console.log(this.props.themes)
    return (
      <>
        <div className="list-controller controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].themes.title}
              </div>
              <div className="type">{`(${this.props.themes.length})`}</div>
            </div>
            <div className="section-controls__right-part">
              <Button
                icon="plus"
                type="icon"
                feature="ADD_THEME"
                action={this.props.onAddTheme}
              />
            </div>
          </div>
          {this.props.themes.length == 0 ? (
            <div className="onboarding__callout">
              <Message
                icon="theme"
                messages={[locals[this.props.lang].themes.tips.creation]}
              />
              <div className="onboarding__actions">
                <Button
                  type='primary'
                  feature="ADD_THEME"
                  label={locals[this.props.lang].themes.label}
                  action={this.props.onAddTheme}
                />
              </div>
            </div>
          ) : (
            <ul className="list">
            
            </ul>
          )}      
        </div>
        {this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
            view={this.props.view}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onCreateLocalStyles={this.props.onCreateLocalStyles}
            onUpdateLocalStyles={this.props.onUpdateLocalStyles}
            onCreateLocalVariables={this.props.onCreateLocalVariables}
            onUpdateLocalVariables={this.props.onUpdateLocalVariables}
          />
        ) : null}
      </>
    )
  }
}