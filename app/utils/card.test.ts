import { describe, it, expect } from 'vitest'
import { createCard, generateCardValues, generateCards } from './card'

describe('generateCardValues', () => {
  describe('75-ball (American)', () => {
    it('generates a 5x5 grid', () => {
      const grid = generateCardValues('75-ball')

      expect(grid).toHaveLength(5)
      grid.forEach(row => {
        expect(row).toHaveLength(5)
      })
    })

    it('has free center cell (null)', () => {
      const grid = generateCardValues('75-ball')

      expect(grid[2][2]).toBeNull()
    })

    it('has correct column ranges', () => {
      const grid = generateCardValues('75-ball')
      const ranges = [
        [1, 15],   // B
        [16, 30],  // I
        [31, 45],  // N
        [46, 60],  // G
        [61, 75]   // O
      ]

      for (let col = 0; col < 5; col++) {
        const [min, max] = ranges[col]
        for (let row = 0; row < 5; row++) {
          const cell = grid[row][col]
          if (cell !== null) {
            expect(cell).toBeGreaterThanOrEqual(min)
            expect(cell).toBeLessThanOrEqual(max)
          }
        }
      }
    })

    it('has numbers sorted within each column', () => {
      const grid = generateCardValues('75-ball')

      for (let col = 0; col < 5; col++) {
        const columnNumbers = grid
          .map(row => row[col])
          .filter(n => n !== null) as number[]

        for (let i = 1; i < columnNumbers.length; i++) {
          expect(columnNumbers[i]).toBeGreaterThan(columnNumbers[i - 1])
        }
      }
    })

    it('has no duplicate numbers', () => {
      const grid = generateCardValues('75-ball')
      const allNumbers = grid.flat().filter(n => n !== null) as number[]
      const uniqueNumbers = new Set(allNumbers)

      expect(uniqueNumbers.size).toBe(allNumbers.length)
    })

    it('has exactly 24 numbers (25 cells - 1 free)', () => {
      const grid = generateCardValues('75-ball')
      const allNumbers = grid.flat().filter(n => n !== null)

      expect(allNumbers).toHaveLength(24)
    })
  })

  describe('90-ball (European)', () => {
    it('generates a 3x9 grid', () => {
      const grid = generateCardValues('90-ball')

      expect(grid).toHaveLength(3)
      grid.forEach(row => {
        expect(row).toHaveLength(9)
      })
    })

    it('has exactly 5 numbers per row', () => {
      const grid = generateCardValues('90-ball')

      grid.forEach(row => {
        const numbersInRow = row.filter(cell => cell !== null)
        expect(numbersInRow).toHaveLength(5)
      })
    })

    it('has exactly 4 empty cells per row', () => {
      const grid = generateCardValues('90-ball')

      grid.forEach(row => {
        const emptyCells = row.filter(cell => cell === null)
        expect(emptyCells).toHaveLength(4)
      })
    })

    it('has correct column ranges', () => {
      const grid = generateCardValues('90-ball')
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

      for (let col = 0; col < 9; col++) {
        const [min, max] = ranges[col]
        for (let row = 0; row < 3; row++) {
          const cell = grid[row][col]
          if (cell !== null) {
            expect(cell).toBeGreaterThanOrEqual(min)
            expect(cell).toBeLessThanOrEqual(max)
          }
        }
      }
    })

    it('has numbers sorted within each column', () => {
      const grid = generateCardValues('90-ball')

      for (let col = 0; col < 9; col++) {
        const columnNumbers = grid
          .map(row => row[col])
          .filter(n => n !== null) as number[]

        for (let i = 1; i < columnNumbers.length; i++) {
          expect(columnNumbers[i]).toBeGreaterThan(columnNumbers[i - 1])
        }
      }
    })

    it('has no duplicate numbers', () => {
      const grid = generateCardValues('90-ball')
      const allNumbers = grid.flat().filter(n => n !== null) as number[]
      const uniqueNumbers = new Set(allNumbers)

      expect(uniqueNumbers.size).toBe(allNumbers.length)
    })

    it('has exactly 15 numbers total', () => {
      const grid = generateCardValues('90-ball')
      const allNumbers = grid.flat().filter(n => n !== null)

      expect(allNumbers).toHaveLength(15)
    })

    it('has at least one number in each column', () => {
      const grid = generateCardValues('90-ball')

      for (let col = 0; col < 9; col++) {
        const columnNumbers = grid.map(row => row[col]).filter(n => n !== null)
        expect(columnNumbers.length).toBeGreaterThanOrEqual(1)
      }
    })
  })
})

describe('createCard', () => {
  it('creates a card with correct properties', () => {
    const card = createCard(1, 'Test Card', '75-ball')

    expect(card.id).toBe(1)
    expect(card.name).toBe('Test Card')
    expect(card.type).toBe('75-ball')
    expect(card.value).toBeDefined()
    expect(card.value).toHaveLength(5)
  })

  it('creates a 90-ball card with correct grid size', () => {
    const card = createCard(1, 'Test', '90-ball')

    expect(card.type).toBe('90-ball')
    expect(card.value).toHaveLength(3)
    expect(card.value[0]).toHaveLength(9)
  })
})

describe('generateCards', () => {
  it('generates the correct number of cards', () => {
    const cards = generateCards('75-ball', 5)

    expect(cards).toHaveLength(5)
  })

  it('assigns sequential IDs starting from 1 by default', () => {
    const cards = generateCards('90-ball', 3)

    expect(cards[0].id).toBe(1)
    expect(cards[1].id).toBe(2)
    expect(cards[2].id).toBe(3)
  })

  it('assigns sequential IDs starting from custom startId', () => {
    const cards = generateCards('75-ball', 3, 10)

    expect(cards[0].id).toBe(10)
    expect(cards[1].id).toBe(11)
    expect(cards[2].id).toBe(12)
  })

  it('generates unique cards', () => {
    const cards = generateCards('90-ball', 10)

    // Convert cards to strings for comparison
    const cardStrings = cards.map(c => JSON.stringify(c.value))
    const uniqueCards = new Set(cardStrings)

    // With 90-ball bingo and only 10 cards, duplicates are extremely unlikely
    expect(uniqueCards.size).toBe(10)
  })

  it('names cards with sequential numbers', () => {
    const cards = generateCards('75-ball', 3, 5)

    expect(cards[0].name).toBe('Carton #5')
    expect(cards[1].name).toBe('Carton #6')
    expect(cards[2].name).toBe('Carton #7')
  })
})

// Run multiple generations to ensure consistency
describe('generation consistency', () => {
  it('always produces valid 75-ball cards (10 iterations)', () => {
    for (let i = 0; i < 10; i++) {
      const grid = generateCardValues('75-ball')

      // Check structure
      expect(grid).toHaveLength(5)
      expect(grid[2][2]).toBeNull()

      // Check no duplicates
      const numbers = grid.flat().filter(n => n !== null) as number[]
      expect(new Set(numbers).size).toBe(24)
    }
  })

  it('always produces valid 90-ball cards (10 iterations)', () => {
    for (let i = 0; i < 10; i++) {
      const grid = generateCardValues('90-ball')

      // Check structure
      expect(grid).toHaveLength(3)

      // Check 5 numbers per row
      grid.forEach(row => {
        expect(row.filter(c => c !== null)).toHaveLength(5)
      })

      // Check at least 1 number per column
      for (let col = 0; col < 9; col++) {
        const columnNumbers = grid.map(row => row[col]).filter(n => n !== null)
        expect(columnNumbers.length).toBeGreaterThanOrEqual(1)
      }

      // Check no duplicates
      const numbers = grid.flat().filter(n => n !== null) as number[]
      expect(new Set(numbers).size).toBe(15)
    }
  })
})
