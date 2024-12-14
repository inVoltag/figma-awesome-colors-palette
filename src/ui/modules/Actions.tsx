import { Button, DropdownOption, Menu, texts } from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'

import { UserSession } from 'src/types/user'
import features from '../../config'
import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus, Service } from '../../types/app'
import {
  CreatorConfiguration,
  SourceColorConfiguration,
} from '../../types/configurations'
import Feature from '../components/Feature'
import { ActionsList } from 'src/types/models'

interface ActionsProps {
  service: Service
  sourceColors: Array<SourceColorConfiguration> | []
  creatorIdentity?: CreatorConfiguration
  userSession?: UserSession
  exportType?: string
  planStatus?: PlanStatus
  editorType?: EditorType
  lang: Language
  isPrimaryLoading?: boolean
  isSecondaryLoading?: boolean
  onCreatePalette?: React.MouseEventHandler<HTMLButtonElement> &
    React.KeyboardEventHandler<HTMLButtonElement>
  onSyncLocalStyles?: (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => void
  onSyncLocalVariables?: (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => void
  onPublishPalette?: (
    e: React.MouseEvent<Element> | React.KeyboardEvent<Element>
  ) => void
  onExportPalette?: React.MouseEventHandler<HTMLButtonElement> &
    React.KeyboardEventHandler<HTMLButtonElement>
}

interface ActionsStates {
  isPrimaryLoading: boolean
  isSecondaryLoading: boolean
}

export default class Actions extends PureComponent<
  ActionsProps,
  ActionsStates
> {
  static defaultProps = {
    sourceColors: [],
  }

  static features = (planStatus: PlanStatus) => ({
    GET_PRO_PLAN: new FeatureStatus({
      features: features,
      featureName: 'GET_PRO_PLAN',
      planStatus: planStatus,
    }),
    CREATE_PALETTE: new FeatureStatus({
      features: features,
      featureName: 'CREATE_PALETTE',
      planStatus: planStatus,
    }),
    SYNC_LOCAL_STYLES: new FeatureStatus({
      features: features,
      featureName: 'SYNC_LOCAL_STYLES',
      planStatus: planStatus,
    }),
    SYNC_LOCAL_VARIABLES: new FeatureStatus({
      features: features,
      featureName: 'SYNC_LOCAL_VARIABLES',
      planStatus: planStatus,
    }),
    PUBLISH_PALETTE: new FeatureStatus({
      features: features,
      featureName: 'PUBLISH_PALETTE',
      planStatus: planStatus,
    }),
  })

  constructor(props: ActionsProps) {
    super(props)
    this.state = {
      isPrimaryLoading: this.props.isPrimaryLoading ?? false,
      isSecondaryLoading: this.props.isSecondaryLoading ?? false,
    }
  }

  // Lifecycle
  componentDidMount = () => {
    parent.postMessage({ pluginMessage: { type: 'GET_PALETTES' } }, '*')

    window.addEventListener('message', this.handleMessage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('message', this.handleMessage)
  }

  componentDidUpdate(previousProps: Readonly<ActionsProps>): void {
    if (previousProps.isPrimaryLoading !== this.props.isPrimaryLoading)
      this.setState({
        isPrimaryLoading: this.props.isPrimaryLoading ?? false,
      })
  }

  // Handlers
  handleMessage = (e: MessageEvent) => {
    const actions: ActionsList = {
      STOP_LOADER: () =>
        this.setState({
          isPrimaryLoading: false,
        }),
      DEFAULT: () => null,
    }

    return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
  }

  // Direct actions
  publicationAction = (): Partial<DropdownOption> => {
    if (this.props.userSession?.connectionStatus === 'UNCONNECTED')
      return {
        label: locals[this.props.lang].actions.publishOrSyncPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'PUBLISH_SYNC_PALETTE',
      }
    else if (
      this.props.userSession?.userId === this.props.creatorIdentity?.creatorId
    )
      return {
        label: locals[this.props.lang].actions.publishPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'PUBLISH_PALETTE',
      }
    else if (
      this.props.userSession?.userId !==
        this.props.creatorIdentity?.creatorId &&
      this.props.creatorIdentity?.creatorId !== ''
    )
      return {
        label: locals[this.props.lang].actions.syncPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'SYNC_PALETTE',
      }
    else
      return {
        label: locals[this.props.lang].actions.publishPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'PUBLISH_PALETTE',
      }
  }

  publicationLabel = (): string => {
    if (this.props.userSession?.connectionStatus === 'UNCONNECTED')
      return locals[this.props.lang].actions.publishOrSyncPalette
    else if (
      this.props.userSession?.userId === this.props.creatorIdentity?.creatorId
    )
      return locals[this.props.lang].actions.publishPalette
    else if (
      this.props.userSession?.userId !==
        this.props.creatorIdentity?.creatorId &&
      this.props.creatorIdentity?.creatorId !== ''
    )
      return locals[this.props.lang].actions.syncPalette
    else return locals[this.props.lang].actions.publishPalette
  }

  // Templates
  Create = () => {
    return (
      <div className="actions">
        <div className="actions__right">
          <Feature
            isActive={Actions.features(
              this.props.planStatus ?? 'UNPAID'
            ).CREATE_PALETTE.isActive()}
          >
            <Button
              type="primary"
              label={locals[this.props.lang].actions.createPalette}
              feature="CREATE_PALETTE"
              isDisabled={this.props.sourceColors.length > 0 ? false : true}
              isLoading={this.state.isPrimaryLoading}
              action={this.props.onCreatePalette}
            />
          </Feature>
        </div>
        <div className="actions__left">
          <div className={`type ${texts.type}`}>{`${
            this.props.sourceColors.length
          } ${
            this.props.sourceColors.length > 1
              ? locals[this.props.lang].actions.sourceColorsNumber.several
              : locals[this.props.lang].actions.sourceColorsNumber.single
          }`}</div>
        </div>
      </div>
    )
  }

  Deploy = () => {
    return (
      <div className="actions">
        <div className="actions__right">
          {this.props.editorType === 'figma' ? (
            <>
              <Feature
                isActive={Actions.features(
                  this.props.planStatus ?? 'UNPAID'
                ).PUBLISH_PALETTE.isActive()}
              >
                <Button
                  type="secondary"
                  label={this.publicationLabel()}
                  feature="PUBLISH_PALETTE"
                  isBlocked={Actions.features(
                    this.props.planStatus ?? 'UNPAID'
                  ).PUBLISH_PALETTE.isBlocked()}
                  isNew={Actions.features(
                    this.props.planStatus ?? 'UNPAID'
                  ).PUBLISH_PALETTE.isNew()}
                  action={this.props.onPublishPalette}
                />
              </Feature>
              <Menu
                id="local-styles-variables"
                label={locals[this.props.lang].actions.sync}
                type="PRIMARY"
                options={[
                  {
                    label: locals[this.props.lang].actions.createLocalStyles,
                    value: 'EDIT',
                    feature: 'SYNC_LOCAL_STYLES',
                    type: 'OPTION',
                    isActive: Actions.features(
                      this.props.planStatus ?? 'UNPAID'
                    ).SYNC_LOCAL_STYLES.isActive(),
                    isBlocked: Actions.features(
                      this.props.planStatus ?? 'UNPAID'
                    ).SYNC_LOCAL_STYLES.isBlocked(),
                    isNew: Actions.features(
                      this.props.planStatus ?? 'UNPAID'
                    ).SYNC_LOCAL_STYLES.isNew(),
                    action: (e) => this.props.onSyncLocalStyles?.(e),
                  },
                  {
                    label: locals[this.props.lang].actions.createLocalVariables,
                    value: 'LOCAL_VARIABLES',
                    feature: 'SYNC_LOCAL_VARIABLES',
                    type: 'OPTION',
                    isActive: Actions.features(
                      this.props.planStatus ?? 'UNPAID'
                    ).SYNC_LOCAL_VARIABLES.isActive(),
                    isBlocked: Actions.features(
                      this.props.planStatus ?? 'UNPAID'
                    ).SYNC_LOCAL_VARIABLES.isBlocked(),
                    isNew: Actions.features(
                      this.props.planStatus ?? 'UNPAID'
                    ).SYNC_LOCAL_VARIABLES.isNew(),
                    action: (e) => this.props.onSyncLocalVariables?.(e),
                  },
                ]}
                alignment="TOP_RIGHT"
                state={this.state.isPrimaryLoading ? 'LOADING' : 'DEFAULT'}
              />
            </>
          ) : (
            <Feature
              isActive={Actions.features(
                this.props.planStatus ?? 'UNPAID'
              ).PUBLISH_PALETTE.isActive()}
            >
              <Button
                type="primary"
                label={this.publicationLabel()}
                feature="PUBLISH_PALETTE"
                isBlocked={Actions.features(
                  this.props.planStatus ?? 'UNPAID'
                ).PUBLISH_PALETTE.isBlocked()}
                isNew={Actions.features(
                  this.props.planStatus ?? 'UNPAID'
                ).PUBLISH_PALETTE.isNew()}
                action={this.props.onPublishPalette}
              />
            </Feature>
          )}
        </div>
        <div className="actions__left"></div>
      </div>
    )
  }

  Export = () => {
    return (
      <div className="actions">
        <div className="buttons">
          <Button
            type="primary"
            label={this.props.exportType}
            feature="EXPORT_PALETTE"
            action={this.props.onExportPalette}
          >
            <a></a>
          </Button>
        </div>
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.service === 'CREATE' && <this.Create />}
        {this.props.service === 'EDIT' && <this.Deploy />}
        {this.props.service === 'TRANSFER' && <this.Export />}
      </>
    )
  }
}
