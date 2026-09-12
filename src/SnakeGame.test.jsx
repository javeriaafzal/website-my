import { act, fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import SnakeGame from './SnakeGame'
import App from './App'
import { TICK_MS } from './snake'

it('supports keyboard and pointer movement, stops on collision, and restarts all state', () => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(<SnakeGame onExit={() => {}} />)
  fireEvent.keyDown(window, { key: 'W' })
  act(() => vi.advanceTimersByTime(TICK_MS))
  expect(screen.getByRole('img')).toHaveAccessibleName(/column 8, row 8/)
  fireEvent.click(screen.getByRole('button', { name: 'Move left' }))
  act(() => vi.advanceTimersByTime(TICK_MS * 7))
  fireEvent.keyDown(window, { key: 'ArrowUp' })
  act(() => vi.advanceTimersByTime(TICK_MS * 7))
  expect(screen.getByText('Score:')).toHaveTextContent('Score: 1')
  expect(screen.getByRole('img')).toHaveAccessibleName(/Length 4/)
  act(() => vi.advanceTimersByTime(TICK_MS))
  expect(screen.getByRole('status')).toHaveTextContent('Game over! Final score: 1')
  expect(vi.getTimerCount()).toBe(0)
  fireEvent.click(screen.getByRole('button', { name: 'Play again' }))
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
  expect(screen.getByText('Score:')).toHaveTextContent('Score: 0')
  expect(screen.getByRole('img')).toHaveAccessibleName(/Length 3. Head at column 8, row 9/)
  act(() => vi.advanceTimersByTime(TICK_MS))
  expect(screen.getByRole('img')).toHaveAccessibleName(/column 9, row 9/)
  fireEvent.click(screen.getByRole('button', { name: 'Restart game' }))
  expect(screen.getByRole('img')).toHaveAccessibleName(/column 8, row 9/)
})

it('cleans up its timer and keyboard listener on unmount', () => {
  vi.useFakeTimers()
  const remove = vi.spyOn(window, 'removeEventListener')
  const interval = vi.spyOn(window, 'setInterval')
  const clear = vi.spyOn(window, 'clearInterval')
  const { unmount } = render(<SnakeGame onExit={() => {}} />)
  const timer = interval.mock.results[0].value
  unmount()
  expect(clear).toHaveBeenCalledWith(timer)
  expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function))
})

it('switches screens through navigation and exit, closing the mobile menu', () => {
  render(<App />)
  const portfolioTitle = screen.getByRole('heading', { level: 1 }).textContent
  fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }))
  expect(screen.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Play Snake' }))
  expect(screen.getByRole('heading', { name: 'Snake' })).toHaveFocus()
  expect(screen.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(screen.getByRole('button', { name: '← Back to portfolio' }))
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(portfolioTitle)
  fireEvent.click(screen.getByRole('button', { name: 'Play Snake' }))
  fireEvent.click(screen.getByRole('button', { name: 'Back to portfolio', exact: true }))
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(portfolioTitle)
})
