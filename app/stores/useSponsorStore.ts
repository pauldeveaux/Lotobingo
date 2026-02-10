import { defineStore } from 'pinia'
import { nextId } from '~/utils/nextId'
import type { Sponsor, SponsorFormData, SponsorState } from '~/types/sponsor'

export const useSponsorStore = defineStore('sponsor', {
  state: (): SponsorState => ({
    sponsors: {},
  }),
  persist: {
    key: 'sponsor-state',
    storage: localStorage
  },
  getters: {
    nextId(): number {
      return nextId(this.sponsors)
    },

    sponsorList(): Sponsor[] {
      return Object.values(this.sponsors)
    },
  },

  actions: {
    createSponsor(data: SponsorFormData): Sponsor {
      const id = this.nextId
      this.sponsors[id] = {
        id,
        name: data.name,
        image: data.image!,
      }
      return this.sponsors[id]
    },

    updateSponsor(id: number, data: SponsorFormData): Sponsor {
      if (!this.sponsors[id]) {
        throw new Error(`Sponsor ${id} not found`)
      }
      this.sponsors[id] = {
        ...this.sponsors[id],
        name: data.name,
        image: data.image!,
      }
      return this.sponsors[id]
    },

    deleteSponsor(id: number): void {
      if (!this.sponsors[id]) {
        throw new Error(`Sponsor ${id} not found`)
      }
      delete this.sponsors[id]
    },

    getSponsor(id: number): Sponsor | null {
      return this.sponsors[id] ?? null
    },
  },
})
