import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSponsorStore } from './useSponsorStore'

describe('useSponsorStore', () => {
    let store: ReturnType<typeof useSponsorStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useSponsorStore()
    })

    describe('nextId', () => {
        it('returns 1 when store is empty', () => {
            expect(store.nextId).toBe(1)
        })

        it('returns next sequential ID', () => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img1.png' })
            store.createSponsor({ name: 'Sponsor 2', image: 'img2.png' })
            expect(store.nextId).toBe(3)
        })

        it('fills gap at the beginning', () => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img1.png' })
            store.createSponsor({ name: 'Sponsor 2', image: 'img2.png' })
            store.deleteSponsor(1)
            expect(store.nextId).toBe(1)
        })

        it('fills gap in the middle', () => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img1.png' })
            store.createSponsor({ name: 'Sponsor 2', image: 'img2.png' })
            store.createSponsor({ name: 'Sponsor 3', image: 'img3.png' })
            store.deleteSponsor(2)
            expect(store.nextId).toBe(2)
        })
    })

    describe('sponsorList', () => {
        it('returns empty array when no sponsors', () => {
            expect(store.sponsorList).toEqual([])
        })

        it('returns all sponsors as array', () => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img1.png' })
            store.createSponsor({ name: 'Sponsor 2', image: 'img2.png' })
            expect(store.sponsorList).toHaveLength(2)
        })
    })

    describe('createSponsor', () => {
        it('creates a sponsor with correct data', () => {
            const sponsor = store.createSponsor({ name: 'Acme Corp', image: 'acme.png' })

            expect(sponsor.id).toBe(1)
            expect(sponsor.name).toBe('Acme Corp')
            expect(sponsor.image).toBe('acme.png')
        })

        it('fills gap when creating after deletion', () => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img1.png' })
            store.createSponsor({ name: 'Sponsor 2', image: 'img2.png' })
            store.deleteSponsor(1)

            const sponsor = store.createSponsor({ name: 'Sponsor 3', image: 'img3.png' })
            expect(sponsor.id).toBe(1)
        })
    })

    describe('updateSponsor', () => {
        beforeEach(() => {
            store.createSponsor({ name: 'Original', image: 'old.png' })
        })

        it('updates sponsor data', () => {
            store.updateSponsor(1, { name: 'Updated', image: 'new.png' })

            expect(store.sponsors[1].name).toBe('Updated')
            expect(store.sponsors[1].image).toBe('new.png')
        })

        it('preserves the ID', () => {
            store.updateSponsor(1, { name: 'Updated', image: 'new.png' })
            expect(store.sponsors[1].id).toBe(1)
        })

        it('throws if sponsor does not exist', () => {
            expect(() => store.updateSponsor(999, { name: 'X', image: 'x.png' }))
                .toThrow('Sponsor 999 not found')
        })
    })

    describe('deleteSponsor', () => {
        beforeEach(() => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img.png' })
        })

        it('removes the sponsor from the store', () => {
            store.deleteSponsor(1)
            expect(store.sponsors[1]).toBeUndefined()
        })

        it('throws if sponsor does not exist', () => {
            expect(() => store.deleteSponsor(999)).toThrow('Sponsor 999 not found')
        })
    })

    describe('getSponsor', () => {
        it('returns the sponsor if it exists', () => {
            store.createSponsor({ name: 'Sponsor 1', image: 'img.png' })

            const sponsor = store.getSponsor(1)
            expect(sponsor).not.toBeNull()
            expect(sponsor?.name).toBe('Sponsor 1')
        })

        it('returns null if sponsor does not exist', () => {
            expect(store.getSponsor(999)).toBeNull()
        })
    })
})
