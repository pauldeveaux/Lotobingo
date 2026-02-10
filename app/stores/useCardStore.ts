import { defineStore } from 'pinia'
import type { Card, CardState, CardType } from '~/types/card'
import { createCard, generateCards } from '~/utils/card'
import { nextId } from '~/utils/nextId'

export const useCardStore = defineStore('card', {
  state: (): CardState => ({
    cards: {}
  }),

  persist: {
    key: 'card-state',
    storage: localStorage,
    pick: ['cards']
  },

  getters: {
    /** Returns all cards as an array */
    cardList(): Card[] {
      return Object.values(this.cards)
    },

    /** Returns cards filtered by type */
    cardsByType(): (type: CardType) => Card[] {
      return (type: CardType) => this.cardList.filter(c => c.type === type)
    },

    nextId(): number {
      return nextId(this.cards)
    },

    /** Returns total card count */
    count(): number {
      return Object.keys(this.cards).length
    }
  },

  actions: {
    /** Get a card by ID */
    getCard(id: number): Card | null {
      return this.cards[id] ?? null
    },

    /** Add a single card */
    addCard(name: string, type: CardType): Card {
      const id = this.nextId
      const card = createCard(id, name, type)
      this.cards[id] = card
      return card
    },

    /** Generate and add multiple cards */
    addCards(type: CardType, count: number): Card[] {
      const startId = this.nextId
      const newCards = generateCards(type, count, startId)

      for (const card of newCards) {
        this.cards[card.id] = card
      }

      return newCards
    },

    /** Update a card's name */
    renameCard(id: number, name: string): void {
      if (!this.cards[id]) {
        throw new Error(`Card ${id} not found`)
      }
      this.cards[id].name = name
    },

    /** Delete a single card */
    deleteCard(id: number): void {
      if (!this.cards[id]) {
        throw new Error(`Card ${id} not found`)
      }
      delete this.cards[id]
    },

    /** Delete multiple cards */
    deleteCards(ids: number[]): void {
      for (const id of ids) {
        delete this.cards[id]
      }
    },

    /** Delete all cards */
    clearAll(): void {
      this.cards = {}
    },

    /** Delete all cards of a specific type */
    clearByType(type: CardType): void {
      const idsToDelete = this.cardList
        .filter(c => c.type === type)
        .map(c => c.id)

      this.deleteCards(idsToDelete)
    }
  }
})
