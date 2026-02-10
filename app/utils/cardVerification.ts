import type { Card } from '~/types/card'
import type { BingoType } from '~/types/bingo'

/**
 * Extracts all possible lines from a card grid.
 * - 75-ball: rows, columns, and 2 diagonals (12 lines)
 * - 90-ball: horizontal rows only (3 lines), excluding null cells
 */
export function getLines(card: Card): number[][] {
  if (card.type === '75-ball') {
    return getLines75(card.value)
  }
  return getLines90(card.value)
}

function getLines75(grid: (number | null)[][]): number[][] {
  const lines: number[][] = []

  // 5 rows
  for (let row = 0; row < 5; row++) {
    const line: number[] = []
    for (let col = 0; col < 5; col++) {
      const cell = grid[row][col]
      if (cell !== null) line.push(cell)
      // FREE cell (center) counts as always matched, so we skip it
    }
    lines.push(line)
  }

  // 5 columns
  for (let col = 0; col < 5; col++) {
    const line: number[] = []
    for (let row = 0; row < 5; row++) {
      const cell = grid[row][col]
      if (cell !== null) line.push(cell)
    }
    lines.push(line)
  }

  // Diagonal top-left to bottom-right
  const diag1: number[] = []
  for (let i = 0; i < 5; i++) {
    const cell = grid[i][i]
    if (cell !== null) diag1.push(cell)
  }
  lines.push(diag1)

  // Diagonal top-right to bottom-left
  const diag2: number[] = []
  for (let i = 0; i < 5; i++) {
    const cell = grid[i][4 - i]
    if (cell !== null) diag2.push(cell)
  }
  lines.push(diag2)

  return lines
}

function getLines90(grid: (number | null)[][]): number[][] {
  const lines: number[][] = []

  // 3 horizontal rows, only non-null cells
  for (let row = 0; row < 3; row++) {
    const line: number[] = []
    for (let col = 0; col < 9; col++) {
      const cell = grid[row][col]
      if (cell !== null) line.push(cell)
    }
    lines.push(line)
  }

  return lines
}

/**
 * Returns the set of card numbers that have been drawn.
 */
export function getMatchedNumbers(card: Card, drawnNumbers: number[]): Set<number> {
  const drawnSet = new Set(drawnNumbers)
  const matched = new Set<number>()

  for (const row of card.value) {
    for (const cell of row) {
      if (cell !== null && drawnSet.has(cell)) {
        matched.add(cell)
      }
    }
  }

  return matched
}

/**
 * Counts how many lines on the card are fully matched by drawn numbers.
 * For 75-ball, the FREE center cell is always considered matched.
 */
export function countCompletedLines(card: Card, drawnNumbers: number[]): number {
  const drawnSet = new Set(drawnNumbers)
  const lines = getLines(card)

  let completed = 0
  for (const line of lines) {
    if (line.every(n => drawnSet.has(n))) {
      completed++
    }
  }

  return completed
}

/**
 * Checks whether a card wins given the drawn numbers and bingo type.
 * - Quine: 1 complete line
 * - Double quine: 2 complete lines
 * - Carton plein: all numbers on the card matched
 */
export function checkCardWin(
  card: Card,
  drawnNumbers: number[],
  bingoType: BingoType
): { won: boolean; completedLines: number } {
  const completedLines = countCompletedLines(card, drawnNumbers)

  let won: boolean
  if (bingoType === 'Carton plein') {
    // All numbers on the card must be drawn
    const allNumbers = card.value.flat().filter(n => n !== null) as number[]
    const drawnSet = new Set(drawnNumbers)
    won = allNumbers.every(n => drawnSet.has(n))
  } else if (bingoType === 'Double quine') {
    won = completedLines >= 2
  } else {
    // Quine
    won = completedLines >= 1
  }

  return { won, completedLines }
}
