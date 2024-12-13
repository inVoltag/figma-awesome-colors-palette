import chroma from 'chroma-js'
import { PureComponent } from 'preact/compat'
import React from 'react'

import {
  Bar,
  Button,
  HexModel,
  layouts,
  Select,
  texts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import features from '../../config'
import { locals } from '../../content/locals'
import { $isAPCADisplayed, $isWCAGDisplayed } from '../../stores/preferences'
import { Language, PlanStatus } from '../../types/app'
import {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  ScaleConfiguration,
  SourceColorConfiguration,
  VisionSimulationModeConfiguration,
} from '../../types/configurations'
import { TextColorsThemeHexModel } from '../../types/models'
import Color from '../../utils/Color'
import Contrast from '../../utils/Contrast'
import Feature from '../components/Feature'

interface PreviewProps {
  colors: Array<SourceColorConfiguration> | Array<ColorConfiguration> | []
  scale: ScaleConfiguration
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  algorithmVersion: AlgorithmVersionConfiguration
  textColorsTheme: TextColorsThemeHexModel
  planStatus: PlanStatus
  lang: Language
  onResetSourceColors?: () => void
}

interface PreviewStates {
  isWCAGDisplayed: boolean
  isAPCADisplayed: boolean
  drawerHeight: string
}

export default class Preview extends PureComponent<
  PreviewProps,
  PreviewStates
> {
  private drawerRef: React.RefObject<HTMLDivElement>
  private unsubscribeWCAG: (() => void) | undefined
  private unsubscribeAPCA: (() => void) | undefined

  static features = (planStatus: PlanStatus) => ({
    PREVIEW_WCAG: new FeatureStatus({
      features: features,
      featureName: 'PREVIEW_WCAG',
      planStatus: planStatus,
    }),
    PREVIEW_APCA: new FeatureStatus({
      features: features,
      featureName: 'PREVIEW_APCA',
      planStatus: planStatus,
    }),
  })

  static defaultProps = {
    sourceColors: [],
    scale: {},
  }

  constructor(props: PreviewProps) {
    super(props)
    this.state = {
      isWCAGDisplayed: true,
      isAPCADisplayed: true,
      drawerHeight: 'auto',
    }
    this.drawerRef = React.createRef()
  }

  // Lifecycle
  componentDidMount = (): void => {
    this.unsubscribeWCAG = $isWCAGDisplayed.subscribe((value) => {
      this.setState({ isWCAGDisplayed: value })
    })
    this.unsubscribeAPCA = $isAPCADisplayed.subscribe((value) => {
      this.setState({ isAPCADisplayed: value })
    })
  }

  componentWillUnmount = (): void => {
    if (this.unsubscribeWCAG) this.unsubscribeWCAG()

    if (this.unsubscribeAPCA) this.unsubscribeAPCA()
  }

  componentDidUpdate = (): void => {
    if (this.props.colors.length === 0)
      this.setState({
        drawerHeight: 'auto',
      })
  }

  // Direct actions
  setColor = (
    color: ColorConfiguration | SourceColorConfiguration | HexModel,
    scale: number
  ): HexModel => {
    const isString = typeof color === 'string'
    const colorData = new Color({
      sourceColor: isString
        ? chroma(color).rgb(false)
        : [color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255],
      lightness: scale,
      hueShifting: isString ? 0 : color.hueShifting,
      chromaShifting: isString ? 100 : color.chromaShifting,
      algorithmVersion: this.props.algorithmVersion,
      visionSimulationMode: this.props.visionSimulationMode,
    })

    switch (this.props.colorSpace) {
      case 'LCH':
        return colorData.lch() as HexModel
      case 'OKLCH':
        return colorData.oklch() as HexModel
      case 'LAB':
        return colorData.lab() as HexModel
      case 'OKLAB':
        return colorData.oklab() as HexModel
      case 'HSL':
        return colorData.hsl() as HexModel
      case 'HSLUV':
        return colorData.hsluv() as HexModel
      default:
        return '#000000'
    }
  }

  onGrab = () => {
    document.body.style.cursor = 'ns-resize'
    document.addEventListener('mousemove', this.onDrag)
  }

  onDrag = (e: MouseEvent) => {
    const { drawerRef } = this
    const { clientY } = e
    const bottom = drawerRef.current
      ? drawerRef.current.getBoundingClientRect().bottom
      : 0
    const delta = bottom - clientY

    this.setState({
      drawerHeight: `${delta}px`,
    })

    document.body.style.cursor = 'ns-resize'
    document.addEventListener('mouseup', () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', this.onDrag)
    })
  }

  clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.detail === 2)
      this.setState({
        drawerHeight: this.state.drawerHeight === 'auto' ? '100%' : 'auto',
      })
  }

  // Templates
  stopTag = ({ stop }: { stop: string }) => (
    <div className="preview__tag">
      <span className={`preview__tag__score type ${texts['type--truncated']}`}>
        {stop}
      </span>
    </div>
  )

  wcagScoreTag = ({ color, score }: { color: HexModel; score: number }) => (
    <div className="preview__tag">
      <div
        className="preview__tag__color"
        style={{
          backgroundColor: color,
        }}
      />
      <span className={`preview__tag__score type ${texts['type--truncated']}`}>
        {`${score.toFixed(2)} : 1`}
      </span>
      <span className={'preview__tag__obs type'}>
        {score <= 4.5 ? '✘' : '✔'}
      </span>
    </div>
  )

  apcaScoreTag = ({ color, score }: { color: HexModel; score: number }) => (
    <div className="preview__tag">
      <div
        className="preview__tag__color"
        style={{
          backgroundColor: color,
        }}
      />
      <span
        className={`preview__tag__score type ${texts['type--truncated']}`}
      >{`Lc ${score.toFixed(1)}`}</span>
      <span className={'preview__tag__obs type'}>
        {score <= 45 ? '✘' : '✔'}
      </span>
    </div>
  )

  // Render
  render() {
    if (!this.props.colors.length) return null
    return (
      <div
        className="preview"
        style={{
          height: this.state.drawerHeight,
        }}
        ref={this.drawerRef}
      >
        <div
          className="preview__knob-spot"
          onMouseDown={this.onGrab}
          onClick={this.clickHandler}
        />
        <Bar
          leftPartSlot={
            <div className={layouts['snackbar--tight']}>
              <Feature
                isActive={Preview.features(
                  this.props.planStatus
                ).PREVIEW_WCAG.isActive()}
              >
                <Select
                  id="enable-wcag-score"
                  type="SWITCH_BUTTON"
                  name="enable-wcag-score"
                  label={locals[this.props.lang].preview.wcag.label}
                  isChecked={this.state.isWCAGDisplayed}
                  isBlocked={Preview.features(
                    this.props.planStatus
                  ).PREVIEW_WCAG.isBlocked()}
                  isNew={Preview.features(
                    this.props.planStatus
                  ).PREVIEW_WCAG.isNew()}
                  onChange={() => {
                    $isWCAGDisplayed.set(!this.state.isWCAGDisplayed)
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SET_ITEMS',
                          items: [
                            {
                              key: 'is_wcag_displayed',
                              value: !this.state.isWCAGDisplayed,
                            },
                          ],
                        },
                      },
                      '*'
                    )
                  }}
                />
              </Feature>
              <Feature
                isActive={Preview.features(
                  this.props.planStatus
                ).PREVIEW_APCA.isActive()}
              >
                <Select
                  id="enable-apca-score"
                  type="SWITCH_BUTTON"
                  name="enable-apca-score"
                  label={locals[this.props.lang].preview.apca.label}
                  isChecked={this.state.isAPCADisplayed}
                  isBlocked={Preview.features(
                    this.props.planStatus
                  ).PREVIEW_APCA.isBlocked()}
                  isNew={Preview.features(
                    this.props.planStatus
                  ).PREVIEW_APCA.isNew()}
                  onChange={() => {
                    $isAPCADisplayed.set(!this.state.isAPCADisplayed)
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SET_ITEMS',
                          items: [
                            {
                              key: 'is_apca_displayed',
                              value: !this.state.isAPCADisplayed,
                            },
                          ],
                        },
                      },
                      '*'
                    )
                  }}
                />
              </Feature>
            </div>
          }
          rightPartSlot={
            <>
              {this.props.onResetSourceColors && (
                <Button
                  type="icon"
                  icon="trash"
                  action={this.props.onResetSourceColors}
                  isDisabled={
                    this.props.colors.some(
                      (color) =>
                        (color as SourceColorConfiguration).source ===
                          'COOLORS' ||
                        (color as SourceColorConfiguration).source ===
                          'REALTIME_COLORS' ||
                        (color as SourceColorConfiguration).source ===
                          'COLOUR_LOVERS'
                    )
                      ? false
                      : true
                  }
                  helper={locals[this.props.lang].preview.reset.helper}
                />
              )}
            </>
          }
          border={['BOTTOM']}
        />
        <div className="preview__header">
          {Object.keys(this.props.scale)
            .reverse()
            .map((scale, index) => {
              return (
                <div
                  className="preview__cell preview__cell--no-height"
                  key={index}
                >
                  <this.stopTag stop={scale.replace('lightness-', '')} />
                </div>
              )
            })}
        </div>
        <div className="preview__rows">
          {this.props.colors.map((color, index) => (
            <div
              className="preview__row"
              key={index}
            >
              {Object.values(this.props.scale)
                .reverse()
                .map((lightness, index) => {
                  const background: HexModel = this.setColor(color, lightness)
                  const darkText = new Color({
                    visionSimulationMode: this.props.visionSimulationMode,
                  }).simulateColorBlindHex(
                    chroma(this.props.textColorsTheme.darkColor).rgb(false)
                  )
                  const lightText = new Color({
                    visionSimulationMode: this.props.visionSimulationMode,
                  }).simulateColorBlindHex(
                    chroma(this.props.textColorsTheme.lightColor).rgb(false)
                  )

                  return (
                    <div
                      className="preview__cell"
                      key={index}
                      style={{
                        backgroundColor: background,
                      }}
                    >
                      {this.state.isWCAGDisplayed && (
                        <this.wcagScoreTag
                          color={lightText}
                          score={new Contrast({
                            backgroundColor: chroma(background).rgb(false),
                            textColor: lightText,
                          }).getWCAGContrast()}
                        />
                      )}
                      {this.state.isAPCADisplayed && (
                        <this.apcaScoreTag
                          color={lightText}
                          score={new Contrast({
                            backgroundColor: chroma(background).rgb(false),
                            textColor: lightText,
                          }).getAPCAContrast()}
                        />
                      )}
                      {this.state.isWCAGDisplayed && (
                        <this.wcagScoreTag
                          color={darkText}
                          score={new Contrast({
                            backgroundColor: chroma(background).rgb(false),
                            textColor: darkText,
                          }).getWCAGContrast()}
                        />
                      )}
                      {this.state.isAPCADisplayed && (
                        <this.apcaScoreTag
                          color={darkText}
                          score={new Contrast({
                            backgroundColor: chroma(background).rgb(false),
                            textColor: darkText,
                          }).getAPCAContrast()}
                        />
                      )}
                    </div>
                  )
                })}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
