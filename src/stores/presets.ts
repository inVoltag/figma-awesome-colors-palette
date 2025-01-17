import { lang, locals } from '../content/locals'
import { PresetConfiguration } from '../types/configurations'

export const presets: Array<PresetConfiguration> = [
  {
    name: 'Material Design, 50-900',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 24,
    max: 96,
    isDistributed: true,
    family: 'Google',
    id: 'MATERIAL',
  },
  {
    name: 'Material 3, 0-100',
    scale: [100, 99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0],
    min: 0,
    max: 100,
    isDistributed: false,
    family: 'Google',
    id: 'MATERIAL_3',
  },
  {
    name: 'Tailwind, 50-950',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    min: 16,
    max: 96,
    isDistributed: true,
    id: 'TAILWIND',
  },
  {
    name: 'Ant Design, 1-10',
    scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    min: 24,
    max: 96,
    isDistributed: true,
    id: 'ANT',
  },
  {
    name: 'ADS Foundations, 100-1000',
    scale: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    min: 24,
    max: 96,
    isDistributed: true,
    family: 'Atlassian',
    id: 'ADS',
  },
  {
    name: 'ADS Foundations, Neutral 0-1100',
    scale: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
    min: 8,
    max: 100,
    isDistributed: true,
    family: 'Atlassian',
    id: 'ADS_NEUTRAL',
  },
  {
    name: 'Carbon, 10-100 (IBM)',
    scale: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    min: 24,
    max: 96,
    isDistributed: true,
    family: locals[lang].scale.presets.more,
    id: 'CARBON',
  },
  {
    name: 'Base, 50-700 (Uber)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700],
    min: 24,
    max: 96,
    isDistributed: true,
    family: locals[lang].scale.presets.more,
    id: 'BASE',
  },
  {
    name: 'Custom',
    scale: [1, 2],
    min: 10,
    max: 90,
    isDistributed: true,
    id: 'CUSTOM',
  },
]

export const defaultPreset = presets[0]
