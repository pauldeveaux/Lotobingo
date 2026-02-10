import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useClientStyleStore } from './useClientStyleStore'

describe('useClientStyleStore', () => {
    let store: ReturnType<typeof useClientStyleStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useClientStyleStore()
    })

    describe('initial state', () => {
        it('has correct default layout values', () => {
            expect(store.prizePosition).toBe('right')
            expect(store.sponsorPosition).toBe('left')
            expect(store.gridSizePercent).toBe(80)
            expect(store.gridPosition).toBe('center')
            expect(store.prizeImageSize).toBe(300)
            expect(store.sponsorImageSize).toBe(300)
            expect(store.logoSize).toBe(64)
            expect(store.titleFontSize).toBe(2)
            expect(store.subtitleFontSize).toBe(1)
            expect(store.bingoNameFontSize).toBe(1.2)
            expect(store.ballVolume).toBe(true)
        })

        it('has correct default color values', () => {
            expect(store.backgroundColor).toBe('#ffffff')
            expect(store.titleColor).toBe('#000000')
            expect(store.subtitleColor).toBe('#6b7280')
            expect(store.bingoNameColor).toBe('#6b7280')
            expect(store.ballColor).toBe('#6392cc')
            expect(store.ballDrawnColor).toBe('#e74c3c')
            expect(store.prizePanelColor).toBe('#ffffff')
            expect(store.prizeBadgeColor).toBe('#ef4444')
            expect(store.prizeTextColor).toBe('#374151')
            expect(store.prizeValueColor).toBe('#16a34a')
            expect(store.prizeProviderLabelColor).toBe('#9ca3af')
            expect(store.sponsorPanelColor).toBe('#ffffff')
            expect(store.sponsorBadgeColor).toBe('#3b82f6')
            expect(store.sponsorTextColor).toBe('#374151')
        })
    })

    describe('update', () => {
        it('applies a partial update', () => {
            store.update({ backgroundColor: '#000000', titleColor: '#ffffff' })

            expect(store.backgroundColor).toBe('#000000')
            expect(store.titleColor).toBe('#ffffff')
        })

        it('does not affect other fields', () => {
            store.update({ ballColor: '#ff0000' })

            expect(store.backgroundColor).toBe('#ffffff')
            expect(store.ballColor).toBe('#ff0000')
        })

        it('updates layout fields', () => {
            store.update({ prizePosition: 'left', gridSizePercent: 90, ballVolume: false })

            expect(store.prizePosition).toBe('left')
            expect(store.gridSizePercent).toBe(90)
            expect(store.ballVolume).toBe(false)
        })

        it('supports all valid positions for prize and sponsor', () => {
            store.update({ prizePosition: 'left' })
            expect(store.prizePosition).toBe('left')

            store.update({ sponsorPosition: 'right' })
            expect(store.sponsorPosition).toBe('right')

            store.update({ prizePosition: 'hidden' })
            expect(store.prizePosition).toBe('hidden')
        })
    })

    describe('resetToDefault', () => {
        it('restores all values to defaults after changes', () => {
            store.update({
                backgroundColor: '#000000',
                titleColor: '#ff0000',
                prizePosition: 'hidden',
                gridSizePercent: 60,
                ballVolume: false,
            })

            store.resetToDefault()

            expect(store.backgroundColor).toBe('#ffffff')
            expect(store.titleColor).toBe('#000000')
            expect(store.prizePosition).toBe('right')
            expect(store.gridSizePercent).toBe(80)
            expect(store.ballVolume).toBe(true)
        })
    })
})
