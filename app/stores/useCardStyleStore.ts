import { defineStore } from 'pinia'

export interface CardStyle {
  id: number
  background: string
  number: string
  title: string
  numberBox: string
  emptyBox: string
}

export type DistributionMode = 'uni' | 'random'

interface CardStyleState {
  styles: CardStyle[]
  distributionMode: DistributionMode
  selectedStyleIndex: number
}

const createDefaultStyle = (): CardStyle => ({
  id: Date.now(),
  background: '#ffffff',
  number: '#000000',
  title: '#000000',
  numberBox: '#e2e8f0',
  emptyBox: '#ffffff',
})

export const useCardStyleStore = defineStore('cardStyle', {
  state: (): CardStyleState => ({
    styles: [createDefaultStyle()],
    distributionMode: 'uni',
    selectedStyleIndex: 0
  }),

  persist: {
    key: 'card-style-state',
    pick: ['styles', 'distributionMode', 'selectedStyleIndex']
  },

  getters: {
    /** Get the selected style (used in uniform mode) */
    selectedStyle(): CardStyle {
      const index = Math.min(this.selectedStyleIndex, this.styles.length - 1)
      return this.styles[index] ?? this.styles[0]
    }
  },

  actions: {
    addStyle(): CardStyle {
      const style = createDefaultStyle()
      this.styles.push(style)
      return style
    },

    removeStyle(index: number): void {
      if (this.styles.length > 1) {
        this.styles.splice(index, 1)
        // Keep selectedStyleIndex in bounds
        if (this.selectedStyleIndex >= this.styles.length) {
          this.selectedStyleIndex = this.styles.length - 1
        }
      }
    },

    updateStyle(index: number, style: Partial<CardStyle>): void {
      if (this.styles[index]) {
        Object.assign(this.styles[index], style)
      }
    },

    setDistributionMode(mode: DistributionMode): void {
      this.distributionMode = mode
    },

    selectStyle(index: number): void {
      if (index >= 0 && index < this.styles.length) {
        this.selectedStyleIndex = index
      }
    },

    resetToDefault(): void {
      this.styles = [createDefaultStyle()]
      this.distributionMode = 'uni'
      this.selectedStyleIndex = 0
    }
  }
})
