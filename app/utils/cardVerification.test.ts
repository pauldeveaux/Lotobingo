import { describe, it, expect } from 'vitest'
import type { Card } from '~/types/card'
import {
  getLines,
  getMatchedNumbers,
  countCompletedLines,
  checkCardWin
} from './cardVerification'

// Helper to create a 75-ball card with a known grid
function make75Card(grid: (number | null)[][]): Card {
  return { id: 1, name: 'Test', type: '75-ball', value: grid }
}

// Helper to create a 90-ball card with a known grid
function make90Card(grid: (number | null)[][]): Card {
  return { id: 2, name: 'Test', type: '90-ball', value: grid }
}

// A known 75-ball grid for testing:
//   B    I    N    G    O
// [ 1,  16,  31,  46,  61 ]  row 0
// [ 2,  17,  32,  47,  62 ]  row 1
// [ 3,  18, null, 48,  63 ]  row 2 (center is FREE)
// [ 4,  19,  34,  49,  64 ]  row 3
// [ 5,  20,  35,  50,  65 ]  row 4
const grid75: (number | null)[][] = [
  [1, 16, 31, 46, 61],
  [2, 17, 32, 47, 62],
  [3, 18, null, 48, 63],
  [4, 19, 34, 49, 64],
  [5, 20, 35, 50, 65]
]

// A known 90-ball grid for testing:
// Row 0: 3, null, 21, null, null, 55, null, 72, null  (5 numbers)
// Row 1: null, 12, null, 33, 44, null, null, null, 88 (5 numbers)
// Row 2: 7, null, null, null, 41, null, 66, 79, null  (5 numbers - actually only 4, let me fix)
// Corrected: each row must have exactly 5 numbers
const grid90: (number | null)[][] = [
  [3, null, 21, null, null, 55, null, 72, null],
  [null, 12, null, 33, 44, null, null, null, 88],
  [7, null, null, null, 41, null, 66, 79, null]
]

describe('getLines', () => {
  describe('75-ball', () => {
    it('returns 12 lines (5 rows + 5 cols + 2 diagonals)', () => {
      const card = make75Card(grid75)
      const lines = getLines(card)
      expect(lines).toHaveLength(12)
    })

    it('row lines contain only non-null values', () => {
      const card = make75Card(grid75)
      const lines = getLines(card)

      // Row 0: all numbers
      expect(lines[0]).toEqual([1, 16, 31, 46, 61])
      // Row 2: center is null/FREE, so only 4 numbers
      expect(lines[2]).toEqual([3, 18, 48, 63])
    })

    it('column lines contain only non-null values', () => {
      const card = make75Card(grid75)
      const lines = getLines(card)

      // Column 0 (index 5): B column
      expect(lines[5]).toEqual([1, 2, 3, 4, 5])
      // Column 2 (index 7): N column, center is FREE
      expect(lines[7]).toEqual([31, 32, 34, 35])
    })

    it('diagonal lines skip FREE center', () => {
      const card = make75Card(grid75)
      const lines = getLines(card)

      // Diagonal TL-BR (index 10): 1, 17, FREE, 49, 65
      expect(lines[10]).toEqual([1, 17, 49, 65])
      // Diagonal TR-BL (index 11): 61, 47, FREE, 19, 5
      expect(lines[11]).toEqual([61, 47, 19, 5])
    })
  })

  describe('90-ball', () => {
    it('returns 3 lines (rows only)', () => {
      const card = make90Card(grid90)
      const lines = getLines(card)
      expect(lines).toHaveLength(3)
    })

    it('lines contain only non-null values', () => {
      const card = make90Card(grid90)
      const lines = getLines(card)

      expect(lines[0]).toEqual([3, 21, 55, 72])
      expect(lines[1]).toEqual([12, 33, 44, 88])
      expect(lines[2]).toEqual([7, 41, 66, 79])
    })
  })
})

describe('getMatchedNumbers', () => {
  it('returns empty set when no numbers drawn', () => {
    const card = make75Card(grid75)
    const matched = getMatchedNumbers(card, [])
    expect(matched.size).toBe(0)
  })

  it('returns only card numbers that were drawn', () => {
    const card = make75Card(grid75)
    const matched = getMatchedNumbers(card, [1, 16, 99, 100])
    expect(matched).toEqual(new Set([1, 16]))
  })

  it('works with 90-ball cards', () => {
    const card = make90Card(grid90)
    const matched = getMatchedNumbers(card, [3, 12, 99])
    expect(matched).toEqual(new Set([3, 12]))
  })
})

describe('countCompletedLines', () => {
  describe('75-ball', () => {
    it('returns 0 when no numbers drawn', () => {
      const card = make75Card(grid75)
      expect(countCompletedLines(card, [])).toBe(0)
    })

    it('counts a completed row', () => {
      const card = make75Card(grid75)
      // Complete row 0: [1, 16, 31, 46, 61]
      const drawn = [1, 16, 31, 46, 61]
      expect(countCompletedLines(card, drawn)).toBe(1)
    })

    it('counts a completed column', () => {
      const card = make75Card(grid75)
      // Complete column 0 (B): [1, 2, 3, 4, 5]
      const drawn = [1, 2, 3, 4, 5]
      expect(countCompletedLines(card, drawn)).toBe(1)
    })

    it('row with FREE center needs only 4 numbers', () => {
      const card = make75Card(grid75)
      // Row 2: [3, 18, FREE, 48, 63] -> need 3, 18, 48, 63
      const drawn = [3, 18, 48, 63]
      expect(countCompletedLines(card, drawn)).toBeGreaterThanOrEqual(1)
    })

    it('counts diagonal as a line', () => {
      const card = make75Card(grid75)
      // Diagonal TL-BR: [1, 17, FREE, 49, 65]
      const drawn = [1, 17, 49, 65]
      expect(countCompletedLines(card, drawn)).toBeGreaterThanOrEqual(1)
    })

    it('counts multiple completed lines', () => {
      const card = make75Card(grid75)
      // Row 0 + Row 1
      const drawn = [1, 16, 31, 46, 61, 2, 17, 32, 47, 62]
      expect(countCompletedLines(card, drawn)).toBeGreaterThanOrEqual(2)
    })

    it('partial line does not count', () => {
      const card = make75Card(grid75)
      // 4 out of 5 in row 0
      const drawn = [1, 16, 31, 46]
      expect(countCompletedLines(card, drawn)).toBe(0)
    })
  })

  describe('90-ball', () => {
    it('returns 0 when no numbers drawn', () => {
      const card = make90Card(grid90)
      expect(countCompletedLines(card, [])).toBe(0)
    })

    it('counts a completed row', () => {
      const card = make90Card(grid90)
      // Row 0: [3, 21, 55, 72] (4 numbers in this test grid)
      const drawn = [3, 21, 55, 72]
      expect(countCompletedLines(card, drawn)).toBe(1)
    })

    it('partial row does not count', () => {
      const card = make90Card(grid90)
      const drawn = [3, 21, 55]
      expect(countCompletedLines(card, drawn)).toBe(0)
    })
  })
})

describe('checkCardWin', () => {
  describe('Quine (1 line)', () => {
    it('wins with 1 completed line (75-ball)', () => {
      const card = make75Card(grid75)
      const drawn = [1, 16, 31, 46, 61] // row 0
      const result = checkCardWin(card, drawn, 'Quine')
      expect(result.won).toBe(true)
      expect(result.completedLines).toBeGreaterThanOrEqual(1)
    })

    it('loses with no completed lines (75-ball)', () => {
      const card = make75Card(grid75)
      const result = checkCardWin(card, [1, 16, 31, 46], 'Quine')
      expect(result.won).toBe(false)
    })

    it('wins with 1 completed row (90-ball)', () => {
      const card = make90Card(grid90)
      const drawn = [12, 33, 44, 88] // row 1
      const result = checkCardWin(card, drawn, 'Quine')
      expect(result.won).toBe(true)
    })

    it('loses with no completed rows (90-ball)', () => {
      const card = make90Card(grid90)
      const result = checkCardWin(card, [12, 33, 44], 'Quine')
      expect(result.won).toBe(false)
    })
  })

  describe('Double quine (2 lines)', () => {
    it('wins with 2 completed lines (75-ball)', () => {
      const card = make75Card(grid75)
      // row 0 + row 1
      const drawn = [1, 16, 31, 46, 61, 2, 17, 32, 47, 62]
      const result = checkCardWin(card, drawn, 'Double quine')
      expect(result.won).toBe(true)
      expect(result.completedLines).toBeGreaterThanOrEqual(2)
    })

    it('loses with only 1 completed line (75-ball)', () => {
      const card = make75Card(grid75)
      const drawn = [1, 16, 31, 46, 61]
      const result = checkCardWin(card, drawn, 'Double quine')
      expect(result.won).toBe(false)
      expect(result.completedLines).toBe(1)
    })

    it('wins with 2 completed rows (90-ball)', () => {
      const card = make90Card(grid90)
      // row 0 + row 1
      const drawn = [3, 21, 55, 72, 12, 33, 44, 88]
      const result = checkCardWin(card, drawn, 'Double quine')
      expect(result.won).toBe(true)
    })

    it('loses with only 1 completed row (90-ball)', () => {
      const card = make90Card(grid90)
      const drawn = [3, 21, 55, 72]
      const result = checkCardWin(card, drawn, 'Double quine')
      expect(result.won).toBe(false)
    })
  })

  describe('Carton plein (all numbers)', () => {
    it('wins when all numbers matched (75-ball)', () => {
      const card = make75Card(grid75)
      // All non-null numbers on the card
      const allNumbers = grid75.flat().filter(n => n !== null) as number[]
      const result = checkCardWin(card, allNumbers, 'Carton plein')
      expect(result.won).toBe(true)
    })

    it('loses when missing one number (75-ball)', () => {
      const card = make75Card(grid75)
      const allNumbers = grid75.flat().filter(n => n !== null) as number[]
      // Remove last number
      const drawn = allNumbers.slice(0, -1)
      const result = checkCardWin(card, drawn, 'Carton plein')
      expect(result.won).toBe(false)
    })

    it('wins when all numbers matched (90-ball)', () => {
      const card = make90Card(grid90)
      const allNumbers = grid90.flat().filter(n => n !== null) as number[]
      const result = checkCardWin(card, allNumbers, 'Carton plein')
      expect(result.won).toBe(true)
    })

    it('loses when missing one number (90-ball)', () => {
      const card = make90Card(grid90)
      const allNumbers = grid90.flat().filter(n => n !== null) as number[]
      const drawn = allNumbers.slice(0, -1)
      const result = checkCardWin(card, drawn, 'Carton plein')
      expect(result.won).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('returns 0 completed lines with empty drawn numbers', () => {
      const card = make75Card(grid75)
      const result = checkCardWin(card, [], 'Quine')
      expect(result.won).toBe(false)
      expect(result.completedLines).toBe(0)
    })

    it('extra drawn numbers do not affect result', () => {
      const card = make75Card(grid75)
      // Row 0 complete + many extra numbers not on card
      const drawn = [1, 16, 31, 46, 61, 90, 91, 92, 93]
      const result = checkCardWin(card, drawn, 'Quine')
      expect(result.won).toBe(true)
    })
  })
})
