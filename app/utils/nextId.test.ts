import { describe, expect, it } from 'vitest'
import { nextId } from './nextId'

describe('nextId', () => {
  it('returns 1 for an empty record', () => {
    expect(nextId({})).toBe(1)
  })

  it('returns next sequential ID', () => {
    expect(nextId({ 1: 'a', 2: 'b' })).toBe(3)
  })

  it('fills gap at the beginning', () => {
    expect(nextId({ 2: 'a', 3: 'b' })).toBe(1)
  })

  it('fills gap in the middle', () => {
    expect(nextId({ 1: 'a', 3: 'b' })).toBe(2)
  })

  it('handles single entry', () => {
    expect(nextId({ 1: 'a' })).toBe(2)
  })

  it('handles non-sequential keys', () => {
    expect(nextId({ 1: 'a', 2: 'b', 5: 'c' })).toBe(3)
  })
})
