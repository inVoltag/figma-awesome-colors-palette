import type {
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
} from '../utils/types'
import Colors from '../canvas/Colors'

const updateView = (msg, palette) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')
    
    palette.setPluginData('view', msg.data.view)
    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        colors: colors,
        scale: scale,
        properties: msg.data.properties,
        preset: preset,
        textColorsTheme: textColorsTheme,
        view: msg.data.view,
        algorithmVersion: algorithmVersion,
      }, palette).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${paletteName}﹒${preset.name}`
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateView