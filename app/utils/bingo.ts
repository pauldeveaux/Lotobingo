import type { Bingo, BingoType } from '~/types/bingo'

/**
 * Factory function to create a new bingo game instance with default state.
 */
export function createBingoFromSettings(
    id: number,
    name: string,
    type: BingoType,
    maxNumber: number,
    minNumber: number = 1
): Bingo {
    return {
        id,
        drawnNumbers: [],
        isFinished: false,
        settings: {
            name: name,
            type: type,
            minNumber: minNumber,
            maxNumber: maxNumber,
        }
    }
}
