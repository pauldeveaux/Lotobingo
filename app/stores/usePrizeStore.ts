import { defineStore } from 'pinia'
import { nextId } from '~/utils/nextId'
import type { Prize, PrizeFormData, PrizeState } from '~/types/bingo'

export const usePrizeStore = defineStore('prize', {
  state: (): PrizeState => ({
    prizes: {},
  }),
  persist: {
    key: 'prize-state',
  },
  getters: {
    nextId(): number {
      return nextId(this.prizes)
    },

    prizeList(): Prize[] {
      return Object.values(this.prizes)
    },
  },

  actions: {
    createPrize(data: PrizeFormData): Prize {
      const id = this.nextId
      this.prizes[id] = {
        id,
        name: data.name,
        value: data.value,
        photo: data.photo,
        providerName: data.providerName,
        providerImage: data.providerImage,
      }
      return this.prizes[id]
    },

    updatePrize(id: number, data: PrizeFormData): Prize {
      if (!this.prizes[id]) {
        throw new Error(`Prize ${id} not found`)
      }
      this.prizes[id] = {
        ...this.prizes[id],
        name: data.name,
        value: data.value,
        photo: data.photo,
        providerName: data.providerName,
        providerImage: data.providerImage,
      }
      return this.prizes[id]
    },

    deletePrize(id: number): void {
      if (!this.prizes[id]) {
        throw new Error(`Prize ${id} not found`)
      }
      delete this.prizes[id]
    },

    getPrize(id: number): Prize | null {
      return this.prizes[id] ?? null
    },
  },
})
