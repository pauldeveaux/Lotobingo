import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it } from "vitest"
import { useBingoStore } from "./useBingoStore"

describe('useBingoStore', () => {
    let store: ReturnType<typeof useBingoStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useBingoStore()
    })

    it('has a default bingo game', () => {
        expect(store.bingo).toBeDefined()
        expect(store.bingo.id).toBe(1)
    })


    describe('canDraw', () => {
        it('returns true for a number has not been drawn', () => {
            expect(store.canDraw(42)).toBe(true)
        })

        it('return false for a number already drawn', () => {
            store.bingo.drawnNumbers.push(42)

            expect(store.canDraw(42)).toBe(false)
        })

        it('return false when game is finished', () => {
            store.bingo.isFinished = true

            expect(store.canDraw(42)).toBe(false)
        })
    })


    describe('drawNumber', () => {
        it('adds the number to drawnNumbers', () => {
            store.drawNumber(42)

            expect(store.drawnNumbers).toContain(42)
        })

        it('throws an error if number was already drawn', () => {
            store.drawNumber(42)

            expect(() => store.drawNumber(42)).toThrow()
        })

    })


    describe('cancelDraw', () => {
        beforeEach(() => {
            store.drawNumber(42)
        })

        it('has the number in drawnNumbers before canceling', () => {
            expect(store.drawnNumbers).toContain(42)
        })

        it('cancel a draw already in drawnNumbers', () => {
            store.cancelDraw(42)

            expect(store.drawnNumbers).not.toContain(42)
        })

        it('throws if number was not drawn', () => {
            expect(() => store.cancelDraw(20)).toThrow("The number was not drawn")
        })

        it('throw if double cancel on a number', () => {
            store.cancelDraw(42)
            expect(() => store.cancelDraw(42)).toThrow("The number was not drawn")
        })
    })


    describe('createBingo', () => {

        it('creates a new bingo at the next ID', () => {
            const bingoSettings = {
                name: "My Bingo",
                type: "Quine",
                ballsNumber: 75
            }
            const bingo = store.createBingo(bingoSettings)

            expect(Object.keys(store.bingos).length).toBe(2)
            expect(bingo.id).toBe(2)
            expect(store.bingos[2]).toBeDefined()
            expect(store.bingos[2].settings.name).toBe("My Bingo")
            expect(store.bingos[2].settings.maxNumber).toBe(75)
            expect(store.bingos[2].settings.type).toBe("Quine")
            expect(store.bingos[2].drawnNumbers).toEqual([])
        })
    })


    describe('changeCurrentBingo', () => {
        beforeEach(() => {
            store.createBingo({ name: "Second", type: "Quine", ballsNumber: 50 })
        })

        it('switches to an existing bingo', () => {
            store.changeCurrentBingo(2)

            expect(store.currentBingoId).toBe(2)
        })

        it('updates the bingo getter after switching', () => {
            store.changeCurrentBingo(2)

            expect(store.bingo).toBe(store.bingos[2])
        })

        it('throws if bingo ID does not exist', () => {
            expect(() => store.changeCurrentBingo(999)).toThrow("999 not found in registered bingos")
        })
    })
})
