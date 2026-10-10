import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import { storage } from '@/utils/storage'

const TestComponent = () => {
  const { settings, applyPreset, toggleDarkMode, resetToDefault } = useTheme()
  return (
    <div>
      <span data-testid="current-preset">{settings.themePreset}</span>
      <span data-testid="current-color">{settings.primaryColor}</span>
      <span data-testid="dark-mode">{settings.isDarkMode ? 'dark' : 'light'}</span>
      <button onClick={() => applyPreset('ocean')}>Switch to Ocean</button>
      <button onClick={() => toggleDarkMode()}>Toggle Dark</button>
      <button onClick={() => resetToDefault()}>Reset Default</button>
    </div>
  )
}

describe('Company Branding & Theme Context', () => {
  beforeEach(() => {
    storage.clearAll()
    document.documentElement.className = ''
  })

  it('initializes with Lavender Calm default preset', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-preset').textContent).toBe('lavender')
    expect(screen.getByTestId('current-color').textContent).toBe('#8B7BC8')
    expect(screen.getByTestId('dark-mode').textContent).toBe('light')
  })

  it('switches preset to Ocean Blue and updates color tokens', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText('Switch to Ocean'))
    expect(screen.getByTestId('current-preset').textContent).toBe('ocean')
    expect(screen.getByTestId('current-color').textContent).toBe('#3B82F6')
  })

  it('toggles dark mode class on document element', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByText('Toggle Dark'))
    expect(screen.getByTestId('dark-mode').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
