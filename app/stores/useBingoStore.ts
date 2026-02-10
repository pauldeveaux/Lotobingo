import { defineStore } from 'pinia'
import { createBingoFromSettings } from '~/utils/bingo'
import { nextId } from '~/utils/nextId'
import type { Bingo, BingoFormData, BingoState } from '~/types/bingo'

/**
 * Central store for managing bingo games state.
 * Handles multiple games, number drawing, and game lifecycle.
 */
export const useBingoStore = defineStore('bingo', {
    state: (): BingoState => ({
        lotoName: 'Loto Bingo',
        lotoSubtitle: '',
        lotoLogo: null,
        bingos: {
            1: createBingoFromSettings(1, "Tirage #1", "Carton plein", 90)
        },
        currentBingoId: 1,
    }),
    persist: {
        key: 'bingo-state',
        storage: localStorage,
        pick: ['bingos', 'lotoName', 'lotoSubtitle', 'lotoLogo']
    },
    getters: {
        /** Returns the currently active bingo game */
        bingo(): Bingo {
            if (this.currentBingoId == null)
                throw new Error("Not current bingo id")
            if (!this.bingos[this.currentBingoId])
                throw new Error(`Bingo ${this.currentBingoId} not found`)
            if (this.currentBingoId == -1) {
                throw new Error("No bingo selected")
            }
            return this.bingos[this.currentBingoId]!
        },
        nextId(): number {
            return nextId(this.bingos)
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
        },
        /** Returns bingos sorted by order */
        sortedBingos(): Bingo[] {
            return Object.values(this.bingos).sort((a, b) => a.order - b.order)
        },
        /** Returns the next order value for new bingos */
        nextOrder(): number {
            const orders = Object.values(this.bingos).map(b => b.order)
            return orders.length ? Math.max(...orders) + 1 : 0
        }
    },
    actions: {
        createBingo(bingoSettings: BingoFormData): Bingo {
            const id = this.nextId
            const order = this.nextOrder
            this.bingos[id] = createBingoFromSettings(
                id,
                bingoSettings.name,
                bingoSettings.type,
                bingoSettings.maxNumber,
                1,
                order
            )
            return this.bingos[id]
        },
        updateBingo(id: number, bingoSettings: BingoFormData): Bingo {
            if (!this.bingos[id]) {
                throw new Error(`Bingo ${id} not found`)
            }
            this.bingos[id].settings.name = bingoSettings.name
            this.bingos[id].settings.type = bingoSettings.type
            this.bingos[id].settings.maxNumber = bingoSettings.maxNumber
            this.bingos[id].prizeIds = bingoSettings.prizeIds
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
        validateDraw(number: number): void {
            if (!this.bingo) {
                throw new Error("No Bingo game is currently in progress.")
            }

            if (this.bingo.isFinished) {
                throw new Error("Cannot draw: the game is finished.")
            }

            if (!this.remainingNumbers.includes(number)) {
                if (this.drawnNumbers.includes(number)) {
                    throw new Error(`Number ${number} has already been drawn.`)
                } else {
                    throw new Error(`Number ${number} is not part of this game.`)
                }
            }
        },
        canDraw(number: number): boolean {
            try {
                this.validateDraw(number)
                return true
            } catch {
                return false
            }
        },
        drawNumber(number: number): void {
            this.validateDraw(number)
            this.drawnNumbers.push(number)
        },
        isDrawn(number: number): boolean {
            return this.drawnNumbers.includes(number)
        },
        /** Removes a number from drawn list (undo functionality) */
        cancelDraw(number: number): void {
            if (!this.bingo.drawnNumbers.includes(number))
                throw new Error("The number was not drawn")

            if(this.bingo.isFinished)
                throw new Error("Cannot cancel : the game is finished")

            const index = this.bingo.drawnNumbers.indexOf(number)
            if (index !== -1) {
                this.bingo.drawnNumbers.splice(index, 1)
            }
        },
        toggleFinishCurrent(): void {
            this.bingo.isFinished = !this.bingo.isFinished
        },
        deleteBingo(id: number): void {
            if (!this.bingos[id]) {
                throw new Error(`Bingo ${id} not found`)
            }
            // Don't delete if it's the current bingo in use
            if (this.currentBingoId === id) {
                // Switch to another bingo if available
                const otherIds = Object.keys(this.bingos).map(Number).filter(k => k !== id)
                if (otherIds.length > 0) {
                    this.currentBingoId = otherIds[0]
                } else {
                    throw new Error('Cannot delete the last bingo')
                }
            }
            delete this.bingos[id]
        },
        /** Updates order of bingos based on array of IDs */
        reorderBingos(orderedIds: number[]): void {
            orderedIds.forEach((id, index) => {
                if (this.bingos[id]) {
                    this.bingos[id].order = index
                }
            })
        }
    }
})
