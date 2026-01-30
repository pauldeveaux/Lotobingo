import { describe, it, expect } from 'vitest'
import { createBingoFromSettings } from './bingo'

describe('createBingoFromSettings', () => {
    it('returns an object with the correct structure', () => {
        const id = 1
        const name = "My Bingo"
        const type = "Carton plein" as const
        const maxNumber = 90

        const result = createBingoFromSettings(id, name, type, maxNumber)

        expect(result.id).toBe(1)
        expect(result.drawnNumbers).toEqual([])
        expect(result.isFinished).toBe(false)
        expect(result.settings.name).toBe('My Bingo')
        expect(result.settings.maxNumber).toBe(90)
        expect(result.settings.minNumber).toBe(1)
    })

    it('uses minNumber = 1 as default', () => {
        const result = createBingoFromSettings(1, 'Test', 'Carton plein', 90)

        expect(result.settings.minNumber).toBe(1)
    })
})
