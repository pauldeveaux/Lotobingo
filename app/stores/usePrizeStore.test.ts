import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it } from "vitest"
import { usePrizeStore } from "./usePrizeStore"

describe('usePrizeStore', () => {
    let store: ReturnType<typeof usePrizeStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = usePrizeStore()
    })

    describe('nextId', () => {
        it('returns 1 when store is empty', () => {
            expect(store.nextId).toBe(1)
        })

        it('returns next sequential ID when no gaps', () => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })
            store.createPrize({ name: "Prize 2", value: 200, photo: null, providerName: null, providerImage: null })

            expect(store.nextId).toBe(3)
        })

        it('fills gap at the beginning', () => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })
            store.createPrize({ name: "Prize 2", value: 200, photo: null, providerName: null, providerImage: null })
            // Now we have IDs [1, 2]
            store.deletePrize(1)
            // Now we have IDs [2]

            expect(store.nextId).toBe(1)
        })

        it('fills gap in the middle', () => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })
            store.createPrize({ name: "Prize 2", value: 200, photo: null, providerName: null, providerImage: null })
            store.createPrize({ name: "Prize 3", value: 300, photo: null, providerName: null, providerImage: null })
            // Now we have IDs [1, 2, 3]
            store.deletePrize(2)
            // Now we have IDs [1, 3]

            expect(store.nextId).toBe(2)
        })
    })


    describe('createPrize', () => {
        it('creates a prize with correct data', () => {
            const prize = store.createPrize({
                name: "Gold Trophy",
                value: 500,
                photo: "trophy.jpg",
                providerName: null,
                providerImage: null,
            })

            expect(prize.id).toBe(1)
            expect(prize.name).toBe("Gold Trophy")
            expect(prize.value).toBe(500)
            expect(prize.photo).toBe("trophy.jpg")
            expect(prize.providerName).toBeNull()
            expect(prize.providerImage).toBeNull()
        })

        it('fills gap when creating after deletion', () => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })
            store.createPrize({ name: "Prize 2", value: 200, photo: null, providerName: null, providerImage: null })
            store.deletePrize(1)

            const newPrize = store.createPrize({ name: "Prize 3", value: 300, photo: null, providerName: null, providerImage: null })

            expect(newPrize.id).toBe(1) // Should fill the gap
        })
    })


    describe('deletePrize', () => {
        beforeEach(() => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })
        })

        it('removes the prize from the store', () => {
            store.deletePrize(1)

            expect(store.prizes[1]).toBeUndefined()
        })

        it('throws if prize does not exist', () => {
            expect(() => store.deletePrize(999)).toThrow("Prize 999 not found")
        })
    })


    describe('updatePrize', () => {
        beforeEach(() => {
            store.createPrize({ name: "Original", value: 100, photo: null, providerName: null, providerImage: null })
        })

        it('updates prize data', () => {
            store.updatePrize(1, { name: "Updated", value: 200, photo: "new.jpg", providerName: null, providerImage: null })

            expect(store.prizes[1].name).toBe("Updated")
            expect(store.prizes[1].value).toBe(200)
            expect(store.prizes[1].photo).toBe("new.jpg")
        })

        it('throws if prize does not exist', () => {
            expect(() => store.updatePrize(999, { name: "X", value: 0, photo: null, providerName: null, providerImage: null }))
                .toThrow("Prize 999 not found")
        })
    })


    describe('getPrize', () => {
        it('returns the prize if it exists', () => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })

            const prize = store.getPrize(1)

            expect(prize).not.toBeNull()
            expect(prize?.name).toBe("Prize 1")
        })

        it('returns null if prize does not exist', () => {
            expect(store.getPrize(999)).toBeNull()
        })
    })


    describe('prizeList', () => {
        it('returns empty array when no prizes', () => {
            expect(store.prizeList).toEqual([])
        })

        it('returns all prizes as array', () => {
            store.createPrize({ name: "Prize 1", value: 100, photo: null, providerName: null, providerImage: null })
            store.createPrize({ name: "Prize 2", value: 200, photo: null, providerName: null, providerImage: null })

            expect(store.prizeList).toHaveLength(2)
        })
    })

    describe('provider fields', () => {
        it('creates a prize with provider data', () => {
            const prize = store.createPrize({
                name: "Sponsored Prize",
                value: 300,
                photo: null,
                providerName: "Acme Corp",
                providerImage: "acme.png",
            })

            expect(prize.providerName).toBe("Acme Corp")
            expect(prize.providerImage).toBe("acme.png")
        })

        it('updates prize with provider data', () => {
            store.createPrize({ name: "Prize", value: 100, photo: null, providerName: null, providerImage: null })

            store.updatePrize(1, {
                name: "Prize",
                value: 100,
                photo: null,
                providerName: "New Provider",
                providerImage: "provider.jpg",
            })

            expect(store.prizes[1].providerName).toBe("New Provider")
            expect(store.prizes[1].providerImage).toBe("provider.jpg")
        })

        it('removes provider data on update', () => {
            store.createPrize({
                name: "Prize",
                value: 100,
                photo: null,
                providerName: "Old Provider",
                providerImage: "old.jpg",
            })

            store.updatePrize(1, {
                name: "Prize",
                value: 100,
                photo: null,
                providerName: null,
                providerImage: null,
            })

            expect(store.prizes[1].providerName).toBeNull()
            expect(store.prizes[1].providerImage).toBeNull()
        })
    })
})
