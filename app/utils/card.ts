import type { Card, CardType } from '~/types/card'

export function createCard(
  id: number,
  name: string,
  type: CardType
): Card {
  return {
    id,
    name,
    type,
    value: generateCardValues(type)
  }
}

export function generateCardValues(type: CardType): (number | null)[][] {
  if (type === '75-ball') {
    return generate75Ball()
  } else {
    return generate90Ball()
  }
}

/**
 * 75-ball (American) Bingo
 * - 5×5 grid
 * - Columns: B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
 * - Center cell is FREE (null)
 * - Numbers sorted within each column
 */
function generate75Ball(): (number | null)[][] {
  const ranges = [
    [1, 15],   // B
    [16, 30],  // I
    [31, 45],  // N
    [46, 60],  // G
    [61, 75]   // O
  ]

  const grid: (number | null)[][] = []

  // Generate 5 numbers per column
  const columns: number[][] = ranges.map(([min, max]) => {
    return pickRandomNumbers(min, max, 5).sort((a, b) => a - b)
  })

  // Build rows from columns
  for (let row = 0; row < 5; row++) {
    grid[row] = []
    for (let col = 0; col < 5; col++) {
      grid[row][col] = columns[col][row]
    }
  }

  // Free center cell
  grid[2][2] = null

  return grid
}

/**
 * 90-ball (European) Bingo
 * - 3×9 grid
 * - Each row has exactly 5 numbers and 4 empty cells
 * - Column ranges: 1-9, 10-19, 20-29, ..., 80-90
 * - Numbers sorted within each column
 */
function generate90Ball(): (number | null)[][] {
  const ranges = [
    [1, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 90]
  ]

  // Create empty 3x9 grid
  const grid: (number | null)[][] = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null]
  ]

  // For each column, decide how many numbers (1, 2, or 3)
  // Total must be 15 (5 per row × 3 rows)
  const columnCounts = distributeNumbersAcrossColumns()

  // Generate and place numbers for each column
  for (let col = 0; col < 9; col++) {
    const [min, max] = ranges[col]
    const count = columnCounts[col]
    const numbers = pickRandomNumbers(min, max, count).sort((a, b) => a - b)
    const positions = pickRandomPositions(3, count)

    for (let i = 0; i < count; i++) {
      grid[positions[i]][col] = numbers[i]
    }
  }

  // Adjust rows to have exactly 5 numbers each
  balanceRows(grid, ranges)

  return grid
}

/** Distribute 15 numbers across 9 columns (each column gets 1-3) */
function distributeNumbersAcrossColumns(): number[] {
  // Start with 1 number per column (9 total), then add 6 more randomly
  const counts = [1, 1, 1, 1, 1, 1, 1, 1, 1]
  let remaining = 6

  while (remaining > 0) {
    const col = randomInt(0, 8)
    if (counts[col] < 3) {
      counts[col]++
      remaining--
    }
  }

  return counts
}

/** Count how many numbers are in a column */
function countColumnNumbers(grid: (number | null)[][], col: number): number {
  return grid.map(r => r[col]).filter(n => n !== null).length
}

/** Ensure each row has exactly 5 numbers */
function balanceRows(grid: (number | null)[][], ranges: number[][]): void {
  for (let row = 0; row < 3; row++) {
    let filledCount = grid[row].filter(cell => cell !== null).length

    while (filledCount !== 5) {
      if (filledCount < 5) {
        // Find an empty cell in this row where we can add a number
        const emptyCols = grid[row]
          .map((cell, col) => cell === null ? col : -1)
          .filter(col => col !== -1)

        if (emptyCols.length === 0) break

        const col = emptyCols[randomInt(0, emptyCols.length - 1)]
        const [min, max] = ranges[col]

        // Get used numbers in this column
        const usedInCol = grid.map(r => r[col]).filter(n => n !== null) as number[]

        // Find available number
        const available = []
        for (let n = min; n <= max; n++) {
          if (!usedInCol.includes(n)) available.push(n)
        }

        if (available.length > 0) {
          const num = available[randomInt(0, available.length - 1)]
          grid[row][col] = num
          // Re-sort column
          sortColumn(grid, col)
          filledCount++
        }
      } else {
        // Remove a number from this row, but only from columns that have 2+ numbers
        const filledCols = grid[row]
          .map((cell, col) => cell !== null ? col : -1)
          .filter(col => col !== -1)
          .filter(col => countColumnNumbers(grid, col) >= 2)

        if (filledCols.length === 0) break // Can't remove without emptying a column

        const col = filledCols[randomInt(0, filledCols.length - 1)]
        grid[row][col] = null
        filledCount--
      }
    }
  }
}

/** Sort numbers within a column (nulls stay in place relatively) */
function sortColumn(grid: (number | null)[][], col: number): void {
  const numbers = grid.map(r => r[col]).filter(n => n !== null) as number[]
  numbers.sort((a, b) => a - b)

  let numIdx = 0
  for (let row = 0; row < 3; row++) {
    if (grid[row][col] !== null) {
      grid[row][col] = numbers[numIdx++]
    }
  }
}

/** Pick n random unique numbers from range [min, max] */
function pickRandomNumbers(min: number, max: number, count: number): number[] {
  const available = []
  for (let i = min; i <= max; i++) {
    available.push(i)
  }

  const result: number[] = []
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = randomInt(0, available.length - 1)
    result.push(available[idx])
    available.splice(idx, 1)
  }

  return result
}

/** Pick n random unique positions from 0 to total-1, sorted */
function pickRandomPositions(total: number, count: number): number[] {
  const positions = pickRandomNumbers(0, total - 1, count)
  return positions.sort((a, b) => a - b)
}

/** Random integer between min and max (inclusive) */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Generate multiple cards */
export function generateCards(
  type: CardType,
  count: number,
  startId: number = 1
): Card[] {
  const cards: Card[] = []
  for (let i = 0; i < count; i++) {
    cards.push(createCard(startId + i, `Carton #${startId + i}`, type))
  }
  return cards
}
