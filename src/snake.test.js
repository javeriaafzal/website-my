import { describe, expect, it } from 'vitest'
import { advance, GRID_SIZE, initialGame, placeFood, requestDirection } from './snake'

describe('snake rules', () => {
  it('moves one cell without growing', () => {
    const state = initialGame(() => 0)
    const next = advance(state)
    expect(next.snake).toEqual([{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }])
    expect(state.snake[0]).toEqual({ x: 7, y: 8 })
    expect(next.score).toBe(0)
  })
  it('grows and scores when eating, placing new food off the snake', () => {
    const next = advance({ ...initialGame(), food: { x: 8, y: 8 } }, () => 0)
    expect(next.snake).toHaveLength(4)
    expect(next.score).toBe(1)
    expect(next.snake).not.toContainEqual(next.food)
  })
  it('uses only empty cells and handles a full board', () => {
    const full = Array.from({ length: GRID_SIZE ** 2 }, (_, i) => ({ x: i % GRID_SIZE, y: Math.floor(i / GRID_SIZE) }))
    expect(placeFood(full.slice(1), () => .999)).toEqual(full[0])
    expect(placeFood(full)).toBeNull()
  })
  it.each(['up', 'down', 'left', 'right'])('detects the %s wall before committing', direction => {
    const state = { ...initialGame(), snake: [{ x: direction === 'right' ? 15 : 0, y: direction === 'down' ? 15 : 0 }], direction, pending: direction }
    const next = advance(state)
    expect(next.gameOver).toBe(true)
    expect(next.snake).toEqual(state.snake)
    expect(advance(next)).toBe(next)
  })
  it('detects self collision but allows entering a vacating tail', () => {
    const state = { ...initialGame(), direction: 'up', pending: 'left', snake: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 2 }, { x: 1, y: 1 }] }
    expect(advance(state).gameOver).toBe(true)
    expect(advance({ ...state, snake: state.snake.slice(0, -1) }).gameOver).toBe(false)
  })
  it('blocks direct and rapid queued reversals against actual movement', () => {
    const state = initialGame()
    expect(requestDirection(state, 'left')).toBe(state)
    const queued = requestDirection(state, 'up')
    expect(requestDirection(queued, 'left')).toBe(queued)
    const moved = advance(queued)
    expect(moved.snake[0]).toEqual({ x: 7, y: 7 })
    expect(requestDirection(moved, 'down')).toBe(moved)
    expect(requestDirection(moved, 'left').pending).toBe('left')
  })
})
