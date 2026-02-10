import { defineStore } from 'pinia'

export interface ClientStyle {
  // Layout
  prizePosition: 'left' | 'right' | 'hidden'
  sponsorPosition: 'left' | 'right' | 'hidden'
  gridSizePercent: number
  gridPosition: 'left' | 'center' | 'right'
  prizeImageSize: number
  sponsorImageSize: number
  logoSize: number
  titleFontSize: number
  subtitleFontSize: number
  bingoNameFontSize: number
  ballVolume: boolean

  // Colors
  backgroundColor: string
  titleColor: string
  subtitleColor: string
  bingoNameColor: string
  ballColor: string
  ballDrawnColor: string
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
  prizePosition: 'right',
  sponsorPosition: 'left',
  gridSizePercent: 80,
  gridPosition: 'center',
  prizeImageSize: 300,
  sponsorImageSize: 300,
  logoSize: 64,
  titleFontSize: 2,
  subtitleFontSize: 1,
  bingoNameFontSize: 1.2,
  ballVolume: true,

  backgroundColor: '#ffffff',
  titleColor: '#000000',
  subtitleColor: '#6b7280',
  bingoNameColor: '#6b7280',
  ballColor: '#6392cc',
  ballDrawnColor: '#e74c3c',
  prizePanelColor: '#ffffff',
  prizeBadgeColor: '#ef4444',
  prizeTextColor: '#374151',
  prizeValueColor: '#16a34a',
  prizeProviderLabelColor: '#9ca3af',
  sponsorPanelColor: '#ffffff',
  sponsorBadgeColor: '#3b82f6',
  sponsorTextColor: '#374151',
}

export const useClientStyleStore = defineStore('clientStyle', {
  state: (): ClientStyle => ({ ...defaults }),

  persist: {
    key: 'client-style-state',
    storage: localStorage,
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
