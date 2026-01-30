import { defineStore } from 'pinia'
import { createBingoFromSettings } from '~/utils/bingo'
import type { Bingo, BingoFormData, BingoState } from '~/types/bingo'

/**
 * Central store for managing bingo games state.
 * Handles multiple games, number drawing, and game lifecycle.
 */
export const useBingoStore = defineStore('bingo', {
    state: (): BingoState => ({
        // Map of all bingo games indexed by their ID
        bingos: {
            1: createBingoFromSettings(1, "Test", "Carton plein", 90)
        },
        currentBingoId: 1,
        lastId: null, // Lazy-initialized for auto-increment
    }),
    getters: {
        /** Returns the currently active bingo game */
        bingo(): Bingo {
            if (this.currentBingoId == null)
                throw new Error("Not current bingo id")
            if (!this.bingos[this.currentBingoId])
                throw new Error(`Bingo ${this.currentBingoId} not found`)

            return this.bingos[this.currentBingoId]
        },
        /** Computes next available ID (lazy init from existing keys) */
        nextId(): number {
            if (this.lastId == null) {
                const keys = Object.keys(this.bingos).map(Number)
                return keys.length ? Math.max(...keys) + 1 : 1
            }
            return this.lastId
        },
        drawnNumbers(): number[] {
            return this.bingo.drawnNumbers
        },
        /** Generates the full range of available ball numbers */
        balls(): number[] {
            const { minNumber, maxNumber } = this.bingo.settings
            return Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber)
        },
        remainingNumbers(): number[] {
            const all = this.balls
            return all.filter((n: number) => !this.drawnNumbers.includes(n))
        },
        isFinished(): boolean {
            return this.bingo.isFinished
        }
    },
    actions: {
        createBingo(bingoSettings: BingoFormData): Bingo {
            const id = this.nextId
            this.bingos[id] = createBingoFromSettings(
                id,
                bingoSettings.name,
                bingoSettings.type,
                bingoSettings.ballsNumber
            )
            this.lastId = (this.lastId ?? id) + 1
            return this.bingos[id]
        },
        changeCurrentBingo(id: number): void {
            if (!Object.keys(this.bingos).includes(String(id)))
                throw new Error(`${id} not found in registered bingos`)
            this.currentBingoId = id
        },
        resetCurrent(): void {
            this.bingo.drawnNumbers = []
        },
        canDraw(number: number): boolean {
            if (!this.bingo)
                return false
            if (this.bingo.isFinished)
                return false
            return this.remainingNumbers.includes(number)
        },
        drawNumber(number: number): void {
            if (!this.canDraw(number)) {
                throw new Error("Number already drawn")
            }
            this.drawnNumbers.push(number)
        },
        isDrawn(number: number): boolean {
            return this.drawnNumbers.includes(number)
        },
        /** Removes a number from drawn list (undo functionality) */
        cancelDraw(number: number): void {
            if (!this.bingo.drawnNumbers.includes(number))
                throw new Error("The number was not drawn")

            const index = this.bingo.drawnNumbers.indexOf(number)
            if (index !== -1) {
                this.bingo.drawnNumbers.splice(index, 1)
            }
        },
        toggleFinishCurrent(): void {
            this.bingo.isFinished = !this.bingo.isFinished
        }
    }
})
