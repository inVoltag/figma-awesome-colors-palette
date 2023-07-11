import * as React from 'react'
import chroma from 'chroma-js'
import type {
  HoveredColor,
  SelectedColor,
  ColorConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import Button from '../components/Button'
import ColorItem from '../components/ColorItem'
import Actions from './Actions'
import Shortcuts from './Shortcuts'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  colors: Array<ColorConfiguration>
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
  view: string
  editorType: string
  planStatus: string
  lang: string
  onChangeColor: React.ChangeEventHandler
  onAddColor: React.MouseEventHandler
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
  onReopenHighlight: React.ChangeEventHandler
}

export default class Colors extends React.Component<Props> {
  render() {
    return (
      <>
        <div className="list-controller controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].colors.title}
              </div>
              <div className="type">{`(${this.props.colors.length})`}</div>
            </div>
            <div className="section-controls__right-part">
              <Button
                icon="plus"
                type="icon"
                feature="ADD_COLOR"
                action={this.props.onAddColor}
              />
            </div>
          </div>
          <ul className="list">
            {this.props.colors.map((color, index) => (
              <ColorItem
                key={color.id}
                name={color.name}
                index={index}
                hex={chroma(
                  color.rgb.r * 255,
                  color.rgb.g * 255,
                  color.rgb.b * 255
                ).hex()}
                oklch={color.oklch}
                shift={color.hueShifting}
                description={color.description}
                uuid={color.id}
                selected={
                  this.props.selectedElement.id === color.id ? true : false
                }
                guideAbove={
                  this.props.hoveredElement.id === color.id
                    ? this.props.hoveredElement.hasGuideAbove
                    : false
                }
                guideBelow={
                  this.props.hoveredElement.id === color.id
                    ? this.props.hoveredElement.hasGuideBelow
                    : false
                }
                lang={this.props.lang}
                onChangeColor={this.props.onChangeColor}
                onChangeSelection={this.props.onChangeSelection}
                onCancellationSelection={this.props.onChangeSelection}
                onDragChange={this.props.onDragChange}
                onDropOutside={this.props.onDropOutside}
                onChangeOrder={this.props.onChangeOrder}
              />
            ))}
          </ul>
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
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SHORTCUTS').isActive
          }
        >
          <Shortcuts
            actions={[
              {
                label: locals[this.props.lang].shortcuts.documentation,
                isLink: true,
                url: 'https://docs.ui-color-palette.com',
                action: null,
              },
              {
                label: locals[this.props.lang].shortcuts.feedback,
                isLink: true,
                url: 'https://uicp.link/feedback',
                action: null,
              },
              {
                label: locals[this.props.lang].shortcuts.news,
                isLink: false,
                url: '',
                action: this.props.onReopenHighlight,
              },
            ]}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
          />
        </Feature>
      </>
    )
  }
}
