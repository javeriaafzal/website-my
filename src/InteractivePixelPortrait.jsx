import { useEffect, useRef } from 'react'

// Distances are in CSS pixels. These defaults can also be overridden with props.
const PIXEL_SIZE = 8
const INTERACTION_RADIUS = 85
const DISPLACEMENT_STRENGTH = 7
const RETURN_SPEED = 12 // Higher values settle faster.
const MAX_DEVICE_PIXEL_RATIO = 2

export default function InteractivePixelPortrait({
  src, alt, pixelSize = PIXEL_SIZE,
  interactionRadius = INTERACTION_RADIUS,
  displacementStrength = DISPLACEMENT_STRENGTH,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)')
    const image = new Image()
    let pixels = []
    let width = 0
    let height = 0
    let frame = 0
    let previousTime = 0
    let visible = true
    let disposed = false
    let cursor = null
    const size = Math.max(2, Number(pixelSize) || PIXEL_SIZE)
    const radius = Math.max(1, Number(interactionRadius) || INTERACTION_RADIUS)
    const strength = Math.max(0, Number(displacementStrength) || 0)

    function draw(time = 0) {
      frame = 0
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60
      previousTime = time
      const ease = 1 - Math.exp(-RETURN_SPEED * delta)
      let moving = false
      context.clearRect(0, 0, width, height)
      for (const pixel of pixels) {
        let targetX = 0
        let targetY = 0
        if (cursor) {
          const dx = pixel.x + pixel.w / 2 - cursor.x
          const dy = pixel.y + pixel.h / 2 - cursor.y
          const distance = Math.hypot(dx, dy)
          if (distance < radius && distance > 0) {
            const force = strength * (1 - distance / radius) ** 2
            targetX = dx / distance * force
            targetY = dy / distance * force
          }
        }
        pixel.dx += (targetX - pixel.dx) * ease
        pixel.dy += (targetY - pixel.dy) * ease
        if (Math.abs(targetX - pixel.dx) + Math.abs(targetY - pixel.dy) > 0.02) moving = true
        else { pixel.dx = targetX; pixel.dy = targetY }
        context.fillStyle = pixel.color
        context.fillRect(pixel.x + pixel.dx, pixel.y + pixel.dy, pixel.w, pixel.h)
      }
      if (moving && visible && !document.hidden) frame = requestAnimationFrame(draw)
    }

    function schedule() {
      if (!frame && visible && !document.hidden && pixels.length) {
        previousTime = 0
        frame = requestAnimationFrame(draw)
      }
    }

    function reset() {
      cursor = null
      cancelAnimationFrame(frame)
      frame = 0
      for (const pixel of pixels) { pixel.dx = 0; pixel.dy = 0 }
      draw()
    }

    function resize() {
      if (disposed || !image.naturalWidth) return
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      if (!width || !height) return
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      // Contain the whole photograph: no stretching or cropping.
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
      const photoWidth = image.naturalWidth * scale
      const photoHeight = image.naturalHeight * scale
      const left = (width - photoWidth) / 2
      const top = (height - photoHeight) / 2
      const columns = Math.ceil(photoWidth / size)
      const rows = Math.ceil(photoHeight / size)
      const sample = document.createElement('canvas')
      sample.width = columns
      sample.height = rows
      const sampler = sample.getContext('2d', { willReadFrequently: true })
      if (!sampler) return
      sampler.drawImage(image, 0, 0, photoWidth / size, photoHeight / size)
      const { data } = sampler.getImageData(0, 0, columns, rows)
      pixels = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const index = (y * columns + x) * 4
          pixels.push({
            x: left + x * size, y: top + y * size,
            w: Math.min(size, photoWidth - x * size),
            h: Math.min(size, photoHeight - y * size), dx: 0, dy: 0,
            color: `rgb(${data[index]} ${data[index + 1]} ${data[index + 2]})`,
          })
        }
      }
      reset()
    }

    function move(event) {
      if (motion.matches || !mouse.matches || event.pointerType !== 'mouse') return
      const bounds = canvas.getBoundingClientRect()
      cursor = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      schedule()
    }
    function leave() { cursor = null; schedule() }
    function visibilityChange() { if (document.hidden) reset() }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) reset()
    })
    intersectionObserver.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('pointercancel', leave)
    motion.addEventListener('change', reset)
    mouse.addEventListener('change', reset)
    document.addEventListener('visibilitychange', visibilityChange)
    image.onload = resize
    image.src = src
    return () => {
      disposed = true
      image.onload = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('pointercancel', leave)
      motion.removeEventListener('change', reset)
      mouse.removeEventListener('change', reset)
      document.removeEventListener('visibilitychange', visibilityChange)
    }
  }, [src, pixelSize, interactionRadius, displacementStrength])

  return <canvas ref={canvasRef} className="interactive-pixel-portrait" role="img" aria-label={alt}>{alt}</canvas>
}
