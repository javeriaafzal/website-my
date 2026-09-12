import { useEffect, useRef, useState } from 'react'
import { advance, GRID_SIZE, initialGame, requestDirection, TICK_MS } from './snake'

const keys = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' }

export default function SnakeGame({ onExit }) {
  const [game, setGame] = useState(initialGame)
  const heading = useRef(null)

  useEffect(() => { heading.current?.focus() }, [])
  useEffect(() => {
    function onKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return
      const direction = keys[event.key] || keys[event.key.toLowerCase()]
      if (!direction) return
      event.preventDefault()
      setGame(current => requestDirection(current, direction))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (game.gameOver) return
    const timer = window.setInterval(() => setGame(current => advance(current)), TICK_MS)
    return () => window.clearInterval(timer)
  }, [game.gameOver])

  function restart() {
    setGame(initialGame())
    heading.current?.focus()
  }

  return <main className="snake-game">
    <div className="snake-layout">
      <button className="snake-button" onClick={onExit}>← Back to portfolio</button>
      <div className="snake-heading"><h1 ref={heading} tabIndex={-1}>Snake</h1><p className="snake-score">Score: <strong>{game.score}</strong></p></div>
      <p id="snake-instructions">Use Arrow keys, WASD, or the buttons below. Eat the orange food and avoid the walls and yourself.</p>
      <div className="snake-board-wrap">
        <div className="snake-board" role="img" aria-label={`Snake board. Length ${game.snake.length}. Head at column ${game.snake[0].x + 1}, row ${game.snake[0].y + 1}.`} aria-describedby="snake-instructions" style={{ '--grid-size': GRID_SIZE }}>
          {game.snake.map((cell, index) => <span key={`${cell.x},${cell.y}`} className={`snake-cell${index === 0 ? ' snake-head' : ''}`} style={{ gridColumn: cell.x + 1, gridRow: cell.y + 1 }} />)}
          {game.food && <span className="food-cell" style={{ gridColumn: game.food.x + 1, gridRow: game.food.y + 1 }} />}
        </div>
        {game.gameOver && <div className="snake-overlay"><p>{game.food ? 'Game over' : 'You win!'}</p><p>Final score: {game.score}</p><button className="snake-button" onClick={restart}>Play again</button></div>}
      </div>
      <p className="snake-status" role="status" aria-live="polite">{game.gameOver ? `${game.food ? 'Game over' : 'You win'}! Final score: ${game.score}. Play again to restart.` : ''}</p>
      <div className="snake-controls" aria-label="Directional controls">
        {Object.entries({ up: '↑', left: '←', down: '↓', right: '→' }).map(([direction, arrow]) => <button key={direction} className={`snake-button snake-${direction}`} aria-label={`Move ${direction}`} disabled={game.gameOver} onClick={() => setGame(current => requestDirection(current, direction))}>{arrow}</button>)}
      </div>
      <button className="snake-button snake-restart" onClick={restart}>Restart game</button>
    </div>
  </main>
}
