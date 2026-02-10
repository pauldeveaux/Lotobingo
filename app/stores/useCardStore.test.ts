import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCardStore } from './useCardStore'

describe('useCardStore', () => {
    let store: ReturnType<typeof useCardStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useCardStore()
    })

    describe('nextId', () => {
        it('returns 1 when store is empty', () => {
            expect(store.nextId).toBe(1)
        })

        it('returns next sequential ID', () => {
            store.addCard('Card 1', '75-ball')
            store.addCard('Card 2', '75-ball')
            expect(store.nextId).toBe(3)
        })

        it('fills gap at the beginning', () => {
            store.addCard('Card 1', '75-ball')
            store.addCard('Card 2', '75-ball')
            store.deleteCard(1)
            expect(store.nextId).toBe(1)
        })

        it('fills gap in the middle', () => {
            store.addCard('Card 1', '75-ball')
            store.addCard('Card 2', '75-ball')
            store.addCard('Card 3', '75-ball')
            store.deleteCard(2)
            expect(store.nextId).toBe(2)
        })
    })

    describe('count', () => {
        it('returns 0 when empty', () => {
            expect(store.count).toBe(0)
        })

        it('reflects the number of cards', () => {
            store.addCard('Card 1', '75-ball')
            store.addCard('Card 2', '90-ball')
            expect(store.count).toBe(2)
        })
    })

    describe('cardList', () => {
        it('returns empty array when no cards', () => {
            expect(store.cardList).toEqual([])
        })

        it('returns all cards as array', () => {
            store.addCard('Card 1', '75-ball')
            store.addCard('Card 2', '90-ball')
            expect(store.cardList).toHaveLength(2)
        })
    })

    describe('cardsByType', () => {
        it('filters cards by type', () => {
            store.addCard('A', '75-ball')
            store.addCard('B', '90-ball')
            store.addCard('C', '75-ball')

            expect(store.cardsByType('75-ball')).toHaveLength(2)
            expect(store.cardsByType('90-ball')).toHaveLength(1)
        })

        it('returns empty array for type with no cards', () => {
            store.addCard('A', '75-ball')
            expect(store.cardsByType('90-ball')).toEqual([])
        })
    })

    describe('addCard', () => {
        it('creates a card with correct data', () => {
            const card = store.addCard('My Card', '75-ball')

            expect(card.id).toBe(1)
            expect(card.name).toBe('My Card')
            expect(card.type).toBe('75-ball')
            expect(card.value).toBeDefined()
        })

        it('creates 90-ball cards', () => {
            const card = store.addCard('Euro Card', '90-ball')
            expect(card.type).toBe('90-ball')
        })

        it('fills gap when creating after deletion', () => {
            store.addCard('Card 1', '75-ball')
            store.addCard('Card 2', '75-ball')
            store.deleteCard(1)

            const card = store.addCard('Card 3', '75-ball')
            expect(card.id).toBe(1)
        })
    })

    describe('addCards', () => {
        it('generates multiple cards', () => {
            const cards = store.addCards('75-ball', 5)

            expect(cards).toHaveLength(5)
            expect(store.count).toBe(5)
        })

        it('assigns sequential IDs', () => {
            const cards = store.addCards('90-ball', 3)

            expect(cards[0].id).toBe(1)
            expect(cards[1].id).toBe(2)
            expect(cards[2].id).toBe(3)
        })
    })

    describe('getCard', () => {
        it('returns the card if it exists', () => {
            store.addCard('Card 1', '75-ball')
            expect(store.getCard(1)).not.toBeNull()
            expect(store.getCard(1)?.name).toBe('Card 1')
        })

        it('returns null if card does not exist', () => {
            expect(store.getCard(999)).toBeNull()
        })
    })

    describe('renameCard', () => {
        it('updates the card name', () => {
            store.addCard('Old Name', '75-ball')
            store.renameCard(1, 'New Name')
            expect(store.cards[1].name).toBe('New Name')
        })

        it('throws if card does not exist', () => {
            expect(() => store.renameCard(999, 'Name')).toThrow('Card 999 not found')
        })
    })

    describe('deleteCard', () => {
        it('removes the card', () => {
            store.addCard('Card 1', '75-ball')
            store.deleteCard(1)
            expect(store.cards[1]).toBeUndefined()
            expect(store.count).toBe(0)
        })

        it('throws if card does not exist', () => {
            expect(() => store.deleteCard(999)).toThrow('Card 999 not found')
        })
    })

    describe('deleteCards', () => {
        it('removes multiple cards', () => {
            store.addCard('A', '75-ball')
            store.addCard('B', '75-ball')
            store.addCard('C', '75-ball')

            store.deleteCards([1, 3])

            expect(store.count).toBe(1)
            expect(store.cards[2]).toBeDefined()
        })

        it('silently ignores non-existent IDs', () => {
            store.addCard('A', '75-ball')
            store.deleteCards([1, 999])
            expect(store.count).toBe(0)
        })
    })

    describe('clearAll', () => {
        it('removes all cards', () => {
            store.addCard('A', '75-ball')
            store.addCard('B', '90-ball')
            store.clearAll()
            expect(store.count).toBe(0)
            expect(store.cardList).toEqual([])
        })
    })

    describe('clearByType', () => {
        it('removes only cards of the given type', () => {
            store.addCard('A', '75-ball')
            store.addCard('B', '90-ball')
            store.addCard('C', '75-ball')

            store.clearByType('75-ball')

            expect(store.count).toBe(1)
            expect(store.cardList[0].type).toBe('90-ball')
        })

        it('does nothing if no cards of that type exist', () => {
            store.addCard('A', '75-ball')
            store.clearByType('90-ball')
            expect(store.count).toBe(1)
        })
    })
})
