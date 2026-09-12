export const GRID_SIZE = 16
export const TICK_MS = 150
export const DIRECTIONS = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
}
const same = (a, b) => a.x === b.x && a.y === b.y

export function placeFood(snake, random = Math.random) {
  const empty = []
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!snake.some(cell => same(cell, { x, y }))) empty.push({ x, y })
    }
  }
  return empty.length ? empty[Math.floor(random() * empty.length)] : null
}

export function initialGame(random = Math.random) {
  const snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }]
  return { snake, food: placeFood(snake, random), direction: 'right', pending: 'right', score: 0, gameOver: false }
}

export function requestDirection(state, direction) {
  if (state.gameOver || !DIRECTIONS[direction]) return state
  const current = DIRECTIONS[state.direction]
  const next = DIRECTIONS[direction]
  if (current.x + next.x === 0 && current.y + next.y === 0) return state
  return { ...state, pending: direction }
}

export function advance(state, random = Math.random) {
  if (state.gameOver) return state
  const delta = DIRECTIONS[state.pending]
  const head = { x: state.snake[0].x + delta.x, y: state.snake[0].y + delta.y }
  const eating = state.food && same(head, state.food)
  // The tail vacates its cell on moves that don't grow the snake.
  const body = eating ? state.snake : state.snake.slice(0, -1)
  if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE || body.some(cell => same(cell, head))) {
    return { ...state, gameOver: true }
  }
  const snake = [head, ...state.snake]
  if (!eating) snake.pop()
  const food = eating ? placeFood(snake, random) : state.food
  return { ...state, snake, food, direction: state.pending, score: state.score + (eating ? 1 : 0), gameOver: food === null }
}
