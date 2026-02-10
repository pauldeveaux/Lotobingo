import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCardStyleStore } from './useCardStyleStore'

describe('useCardStyleStore', () => {
    let store: ReturnType<typeof useCardStyleStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useCardStyleStore()
    })

    describe('initial state', () => {
        it('starts with one default style', () => {
            expect(store.styles).toHaveLength(1)
        })

        it('starts in uniform distribution mode', () => {
            expect(store.distributionMode).toBe('uni')
        })

        it('starts with selectedStyleIndex 0', () => {
            expect(store.selectedStyleIndex).toBe(0)
        })
    })

    describe('selectedStyle', () => {
        it('returns the first style by default', () => {
            expect(store.selectedStyle).toBe(store.styles[0])
        })

        it('returns the correct style after selection', () => {
            store.addStyle()
            store.selectStyle(1)
            expect(store.selectedStyle).toBe(store.styles[1])
        })

        it('clamps to last style if index is out of bounds', () => {
            store.selectedStyleIndex = 99
            expect(store.selectedStyle).toBe(store.styles[store.styles.length - 1])
        })
    })

    describe('addStyle', () => {
        it('adds a new style to the list', () => {
            store.addStyle()
            expect(store.styles).toHaveLength(2)
        })

        it('returns the newly created style', () => {
            const style = store.addStyle()
            expect(style.background).toBe('#ffffff')
            expect(style.id).toBeDefined()
        })
    })

    describe('removeStyle', () => {
        it('removes a style by index', () => {
            store.addStyle()
            expect(store.styles).toHaveLength(2)

            store.removeStyle(1)
            expect(store.styles).toHaveLength(1)
        })

        it('does not remove the last style', () => {
            store.removeStyle(0)
            expect(store.styles).toHaveLength(1)
        })

        it('clamps selectedStyleIndex when removing the selected style', () => {
            store.addStyle()
            store.selectStyle(1)
            store.removeStyle(1)
            expect(store.selectedStyleIndex).toBe(0)
        })
    })

    describe('updateStyle', () => {
        it('updates style properties at given index', () => {
            store.updateStyle(0, { background: '#ff0000' })
            expect(store.styles[0].background).toBe('#ff0000')
        })

        it('does nothing for out-of-bounds index', () => {
            const before = { ...store.styles[0] }
            store.updateStyle(99, { background: '#ff0000' })
            expect(store.styles[0].background).toBe(before.background)
        })
    })

    describe('setDistributionMode', () => {
        it('switches to random mode', () => {
            store.setDistributionMode('random')
            expect(store.distributionMode).toBe('random')
        })

        it('switches back to uniform mode', () => {
            store.setDistributionMode('random')
            store.setDistributionMode('uni')
            expect(store.distributionMode).toBe('uni')
        })
    })

    describe('selectStyle', () => {
        it('updates selectedStyleIndex', () => {
            store.addStyle()
            store.selectStyle(1)
            expect(store.selectedStyleIndex).toBe(1)
        })

        it('rejects negative index', () => {
            store.selectStyle(-1)
            expect(store.selectedStyleIndex).toBe(0)
        })

        it('rejects out-of-bounds index', () => {
            store.selectStyle(99)
            expect(store.selectedStyleIndex).toBe(0)
        })
    })

    describe('resetToDefault', () => {
        it('resets to a single default style', () => {
            store.addStyle()
            store.addStyle()
            store.setDistributionMode('random')
            store.selectStyle(1)

            store.resetToDefault()

            expect(store.styles).toHaveLength(1)
            expect(store.distributionMode).toBe('uni')
            expect(store.selectedStyleIndex).toBe(0)
        })
    })
})
