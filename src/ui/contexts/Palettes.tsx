import {
  Bar,
  Button,
  Icon,
  Input,
  Message,
  Tabs,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'

import { signIn, supabase } from '../../bridges/publication/authentication'
import { locals } from '../../content/locals'
import features, { palettesDbTableName } from '../../utils/config'
import type {
  ActionsList,
  ColorConfiguration,
  Language,
  MetaConfiguration,
  PaletteConfiguration,
  PlanStatus,
  PresetConfiguration,
  SourceColorConfiguration,
  ThemeConfiguration,
  UserSession,
} from '../../utils/types'
import Feature from '../components/Feature'
import PaletteItem from '../components/PaletteItem'

interface PalettesProps {
  userSession: UserSession
  planStatus: PlanStatus
  lang: Language
}

interface PalettesStates {
  context: string | undefined
  paletteListStatus:
    | 'LOADING'
    | 'LOADED'
    | 'EMPTY'
    | 'ERROR'
    | 'FULL'
    | 'SIGN_IN_FIRST'
  pageSize: number
  currentPage: number
  isLoadMoreActionLoading: boolean
  isSignInLoading: boolean
  isAddToFileActionLoading: Array<boolean>
  paletteList: Array<{
    palette_id: string
    screenshot: string
    name: string
    preset: PresetConfiguration
    colors: ColorConfiguration
    themes: ThemeConfiguration
    creator_avatar: string
    creator_full_name: string
  }>
}

export default class Palettes extends React.Component<
  PalettesProps,
  PalettesStates
> {
  constructor(props: PalettesProps) {
    super(props)
    this.state = {
      context:
        this.setContexts()[0] !== undefined ? this.setContexts()[0].id : '',
      paletteListStatus: 'LOADING',
      pageSize: 2,
      currentPage: 1,
      isLoadMoreActionLoading: false,
      isSignInLoading: false,
      isAddToFileActionLoading: [],
      paletteList: [],
    }
  }

  // Lifecycle
  componentDidMount = async () => this.callUICPAgent(this.state['context'])

  componentDidUpdate = (
    prevProps: Readonly<PalettesProps>,
    prevState: Readonly<PalettesStates>
  ): void => {
    if (
      prevProps.userSession.connectionStatus !==
      this.props.userSession.connectionStatus
    ) {
      this.setState({
        paletteListStatus: 'LOADING',
      })
      this.callUICPAgent(this.state['context'])
    }
    if (prevState.context !== this.state['context']) {
      this.setState({
        paletteList: [],
        paletteListStatus: 'LOADING',
      })
      this.callUICPAgent(this.state['context'])
    }
    if (prevState.currentPage !== this.state['currentPage'])
      this.callUICPAgent(this.state['context'])
  }

  // Direct actions
  callUICPAgent = async (context: string | undefined) => {
    const getSeftPalettes = async () => {
      const { data, error } = await supabase
        .from(palettesDbTableName)
        .select(
          'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name, creator_id'
        )
        .eq('creator_id', this.props.userSession.userId)
        .range(
          this.state['pageSize'] * (this.state['currentPage'] - 1),
          this.state['pageSize'] * this.state['currentPage'] - 1
        )

      if (!error) {
        this.setState({
          isLoadMoreActionLoading: false,
          isAddToFileActionLoading: Array(
            this.state['paletteList'].concat(data).length
          ).fill(false),
          paletteListStatus: data.length > 0 ? 'LOADED' : 'FULL',
          paletteList: this.state['paletteList'].concat(data),
        })
      } else if (this.props.userSession.connectionStatus === 'UNCONNECTED')
        this.setState({
          paletteListStatus: 'SIGN_IN_FIRST',
        })
      else
        this.setState({
          paletteListStatus: 'ERROR',
        })
    }

    const getCommunityPalettes = async () => {
      const { data, error } = await supabase
        .from(palettesDbTableName)
        .select(
          'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name'
        )
        .range(
          this.state['pageSize'] * (this.state['currentPage'] - 1),
          this.state['pageSize'] * this.state['currentPage'] - 1
        )

      if (!error) {
        this.setState({
          isLoadMoreActionLoading: false,
          isAddToFileActionLoading: Array(
            this.state['paletteList'].concat(data).length
          ).fill(false),
          paletteListStatus: data.length > 0 ? 'LOADED' : 'FULL',
          paletteList: this.state['paletteList'].concat(data),
        })
      } else
        this.setState({
          paletteListStatus: 'ERROR',
        })
    }

    const actions: ActionsList = {
      SELF: () => getSeftPalettes(),
      COMMUNITY: () => getCommunityPalettes(),
      DEFAULT: () => null,
    }

    actions[context ?? 'DEFAULT']?.()
  }

  getPaletteMeta = (
    colors: Array<ColorConfiguration>,
    themes: Array<ThemeConfiguration>
  ) => {
    const colorsNumber = colors.length,
      themesNumber = themes.filter(
        (theme) => theme.type === 'custom theme'
      ).length

    let colorLabel: string, themeLabel: string

    if (colorsNumber > 1)
      colorLabel = locals[this.props.lang].actions.sourceColorsNumber.several
    else colorLabel = locals[this.props.lang].actions.sourceColorsNumber.single

    if (themesNumber > 1)
      themeLabel = locals[this.props.lang].actions.colorThemesNumber.several
    else themeLabel = locals[this.props.lang].actions.colorThemesNumber.single

    return `${colorsNumber} ${colorLabel}, ${themesNumber} ${themeLabel}`
  }

  onSelectPalette = async (id: string) => {
    const { data, error } = await supabase
      .from(palettesDbTableName)
      .select('*')
      .eq('palette_id', id)

    console.log(data)

    if (!error && data.length > 0) {
      try {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'CREATE_PALETTE',
              data: {
                sourceColors: data[0].colors.map(
                  (color: ColorConfiguration) => {
                    return {
                      name: color.name,
                      rgb: color.rgb,
                      source: 'REMOTE',
                      id: color.id,
                    }
                  }
                ) as Array<SourceColorConfiguration>,
                palette: {
                  name: data[0].name,
                  description: data[0].description,
                  preset: data[0].preset,
                  scale: data[0].scale,
                  colorSpace: data[0].color_space,
                  visionSimulationMode: data[0].vision_simulation_mode,
                  view: data[0].view,
                  textColorsTheme: data[0].text_colors_theme,
                  algorithmVersion: data[0].algorithm_version,
                } as Partial<PaletteConfiguration>,
                themes: data[0].themes,
                isRemote: true,
                paletteMeta: {
                  id: data[0].palette_id,
                  dates: {
                    createdAt: data[0].created_at,
                    updatedAt: data[0].updated_at,
                    publishedAt: data[0].published_at,
                  },
                  publicationStatus: {
                    isPublished: true,
                    isShared: data[0].is_shared,
                  },
                  creatorIdentity: {
                    creatorFullName: data[0].creator_full_name,
                    creatorAvatar: data[0].creator_avatar,
                    creatorId: data[0].creator_id,
                  },
                } as MetaConfiguration,
              },
            },
          },
          '*'
        )

        return
      } catch {
        throw error
      }
    } else throw error
  }

  setContexts = () => {
    const contexts: Array<{
      label: string
      id: string
      isUpdated: boolean
    }> = []
    if (features.find((feature) => feature.name === 'PALETTES_SELF')?.isActive)
      contexts.push({
        label: locals[this.props.lang].palettes.contexts.self,
        id: 'SELF',
        isUpdated:
          features.find((feature) => feature.name === 'PALETTES_SELF')?.isNew ??
          false,
      })
    if (
      features.find((feature) => feature.name === 'PALETTES_COMMUNITY')
        ?.isActive
    )
      contexts.push({
        label: locals[this.props.lang].palettes.contexts.community,
        id: 'COMMUNITY',
        isUpdated:
          features.find((feature) => feature.name === 'PALETTES_COMMUNITY')
            ?.isNew ?? false,
      })
    if (
      features.find((feature) => feature.name === 'PALETTES_EXPLORE')?.isActive
    )
      contexts.push({
        label: locals[this.props.lang].palettes.contexts.explore,
        id: 'EXPLORE',
        isUpdated:
          features.find((feature) => feature.name === 'PALETTES_EXPLORE')
            ?.isNew ?? false,
      })
    return contexts
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
      currentPage: 1,
    })

  // Templates
  PalettesList = () => {
    return (
      <ul className="rich-list">
        {this.state['paletteList'].map((palette: any, index: number) => (
          <PaletteItem
            id={palette.palette_id}
            key={`palette-${index}`}
            src={palette.screenshot}
            title={palette.name}
            subtitle={palette.preset.name}
            info={this.getPaletteMeta(palette.colors, palette.themes)}
            user={{
              avatar: palette.creator_avatar,
              name: palette.creator_full_name,
            }}
            action={() => null}
          >
            <Button
              type="secondary"
              label={locals[this.props.lang].actions.addToFile}
              isLoading={this.state['isAddToFileActionLoading'][index]}
              action={() => {
                this.setState({
                  isAddToFileActionLoading: this.state[
                    'isAddToFileActionLoading'
                  ].map((loading, i) => (i === index ? true : loading)),
                })
                this.onSelectPalette(palette.palette_id)
                  .finally(() => {
                    this.setState({
                      isAddToFileActionLoading:
                        this.state.isAddToFileActionLoading.map((loading, i) =>
                          i === index ? false : loading
                        ),
                    })
                  })
                  .catch(() => {
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SEND_MESSAGE',
                          message: locals[this.props.lang].error.addToFile,
                        },
                      },
                      '*'
                    )
                  })
              }}
            />
          </PaletteItem>
        ))}
        <div className="list-control">
          {this.state['paletteListStatus'] === 'LOADED' ? (
            <Button
              type="secondary"
              label={locals[this.props.lang].palettes.lazyLoad.loadMore}
              isLoading={this.state['isLoadMoreActionLoading']}
              action={() =>
                this.setState({
                  isLoadMoreActionLoading: true,
                  currentPage: this.state['currentPage'] + 1,
                })
              }
            />
          ) : (
            <div className={`${texts['type--secondary']} type`}>
              {locals[this.props.lang].palettes.lazyLoad.completeList}
            </div>
          )}
        </div>
      </ul>
    )
  }

  // Render
  render() {
    let controls

    if (
      this.state['paletteListStatus'] === 'LOADED' ||
      this.state['paletteListStatus'] === 'FULL'
    ) {
      controls = <this.PalettesList />
    } else if (this.state['paletteListStatus'] === 'ERROR') {
      controls = (
        <div className="onboarding__callout--centered">
          <Message
            icon="warning"
            messages={[locals[this.props.lang].error.fetchPalette]}
          />
        </div>
      )
    } else if (this.state['paletteListStatus'] === 'SIGN_IN_FIRST') {
      controls = (
        <div className="onboarding__callout--centered">
          <Message
            icon="info"
            messages={[locals[this.props.lang].palettes.signInFirst.message]}
          />
          <div className="onboarding__actions">
            <Button
              type="primary"
              label={locals[this.props.lang].palettes.signInFirst.signIn}
              isLoading={this.state['isSignInLoading']}
              action={async () => {
                this.setState({ isSignInLoading: true })
                signIn()
                  .finally(() => {
                    this.setState({ isSignInLoading: false })
                  })
                  .catch((error) => {
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SEND_MESSAGE',
                          message:
                            error.message === 'Authentication timeout'
                              ? locals[this.props.lang].error.timeout
                              : locals[this.props.lang].error.authentication,
                        },
                      },
                      '*'
                    )
                  })
              }}
            />
          </div>
        </div>
      )
    } else
      controls = (
        <Icon
          type="PICTO"
          iconName="spinner"
          customClassName="control__block__loader"
        />
      )

    return (
      <div className="controls__control">
        <Bar
          leftPart={
            <Tabs
              tabs={this.setContexts()}
              active={this.state['context'] ?? ''}
              action={this.navHandler}
            />
          }
          rightPart={
            <Feature
              isActive={
                features.find((feature) => feature.name === 'PALETTES_SEARCH')
                  ?.isActive
              }
            >
              <Input
                type="TEXT"
                icon={{
                  type: 'PICTO',
                  value: 'search',
                }}
                placeholder={locals[this.props.lang].palettes.lazyLoad.search}
              />
            </Feature>
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <div className="control__block control__block--no-padding">
          {controls}
        </div>
      </div>
    )
  }
}