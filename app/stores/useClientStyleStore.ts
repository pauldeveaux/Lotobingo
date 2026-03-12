import { defineStore } from 'pinia'

export interface ClientStyle {
  // Layout
  gridX: number
  gridY: number
  prizeX: number
  prizeY: number
  prizeVisible: boolean
  sponsorX: number
  sponsorY: number
  sponsorVisible: boolean
  gridSizePercent: number
  prizeImageSize: number
  sponsorImageSize: number
  logoSize: number
  titleFontSize: number
  subtitleFontSize: number
  bingoNameFontSize: number
  ballVolume: boolean

  // Background
  backgroundImage: string | null
  backgroundImageOpacity: number

  // Colors
  backgroundColor: string
  backgroundColorOpacity: number
  titleColor: string
  subtitleColor: string
  bingoNameColor: string
  bingoTypeColor: string
  ballColor: string
  ballDrawnColor: string
  ballAnimationColor: string
  prizePanelColor: string
  prizeBadgeColor: string
  prizeTextColor: string
  prizeValueColor: string
  prizeProviderLabelColor: string
  sponsorPanelColor: string
  sponsorBadgeColor: string
  sponsorTextColor: string
}

const defaults: ClientStyle = {
  gridX: 31,
  gridY: 47,
  prizeX: 88,
  prizeY: 28,
  prizeVisible: true,
  sponsorX: 88,
  sponsorY: 78,
  sponsorVisible: true,
  gridSizePercent: 80,
  prizeImageSize: 300,
  sponsorImageSize: 280,
  logoSize: 72,
  titleFontSize: 2.5,
  subtitleFontSize: 1.25,
  bingoNameFontSize: 1.25,
  ballVolume: true,

  backgroundImage: '/default-bg.svg',
  backgroundImageOpacity: 1,

  backgroundColor: '#f5f3ff',
  backgroundColorOpacity: 0.55,
  titleColor: '#1e1b4b',
  subtitleColor: '#5b21b6',
  bingoNameColor: '#4c1d95',
  bingoTypeColor: '#7c3aed',
  ballColor: '#818cf8',
  ballDrawnColor: '#f472b6',
  ballAnimationColor: '#f472b6',
  prizePanelColor: '#ffffff',
  prizeBadgeColor: '#fb923c',
  prizeTextColor: '#1e1b4b',
  prizeValueColor: '#059669',
  prizeProviderLabelColor: '#7c3aed',
  sponsorPanelColor: '#ffffff',
  sponsorBadgeColor: '#a78bfa',
  sponsorTextColor: '#1e1b4b',
}

export const useClientStyleStore = defineStore('clientStyle', {
  state: (): ClientStyle => ({ ...defaults }),

  persist: {
    key: 'client-style-state',
  },

  actions: {
    update(partial: Partial<ClientStyle>): void {
      Object.assign(this, partial)
    },

    resetToDefault(): void {
      Object.assign(this, defaults)
    },
  },
})
