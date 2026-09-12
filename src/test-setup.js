import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

window.matchMedia = vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks() })
