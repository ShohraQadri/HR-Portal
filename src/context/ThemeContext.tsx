import React, { createContext, useContext, useEffect, useState } from 'react'
import type { CompanyBrandingSettings, ThemePreset, ThemePresetId } from '@/types'
import { storage } from '@/utils/storage'

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  lavender: {
    id: 'lavender',
    name: 'Lavender Calm',
    description: 'Soft, modern, focused enterprise aesthetic (Default)',
    primary: '#8B7BC8',
    primaryHover: '#7564B4',
    surfaceSubtle: '#F2EEFC',
    pageBg: '#FAF9FD',
    cardBg: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    textMain: '#252438',
    textSecondary: '#77758A',
    border: '#EAE7F1',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Crisp, trustworthy corporate technology palette',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    surfaceSubtle: '#EFF6FF',
    pageBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    textMain: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Growth',
    description: 'Refreshing, balanced, natural performance tones',
    primary: '#10B981',
    primaryHover: '#059669',
    surfaceSubtle: '#ECFDF5',
    pageBg: '#F7FCF9',
    cardBg: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    textMain: '#064E3B',
    textSecondary: '#4B7B6B',
    border: '#D1FAE5',
  },
  rose: {
    id: 'rose',
    name: 'Rose Quartz',
    description: 'Warm, vibrant, human-centered culture atmosphere',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    surfaceSubtle: '#FFF1F2',
    pageBg: '#FFF9F9',
    cardBg: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    textMain: '#1F1115',
    textSecondary: '#88626C',
    border: '#FFE4E6',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    description: 'High contrast dark mode styling for modern engineering teams',
    primary: '#818CF8',
    primaryHover: '#6366F1',
    surfaceSubtle: '#1E1B4B44',
    pageBg: '#0F172A',
    cardBg: '#1E293B',
    sidebarBg: '#0F172A',
    textMain: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    isDark: true,
  },
}

export const DEFAULT_BRANDING_SETTINGS: CompanyBrandingSettings = {
  companyName: 'Acme Global Technologies',
  organizationId: 'ORG-8842',
  tagline: 'Empowering collaborative culture and talent growth',
  supportEmail: 'people-ops@acmeglobal.io',
  website: 'https://acmeglobal.io',
  logoUrl: '',
  themePreset: 'lavender',
  primaryColor: '#8B7BC8',
  accentColor: '#F2EEFC',
  sidebarStyle: 'light',
  isDarkMode: false,
  timezone: 'America/New_York (UTC-5)',
  workingHours: {
    startTime: '09:00',
    endTime: '18:00',
    gracePeriodMinutes: 15,
    breakMinutes: 60,
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
}

interface ThemeContextType {
  settings: CompanyBrandingSettings
  updateSettings: (newSettings: Partial<CompanyBrandingSettings>) => void
  applyPreset: (presetId: ThemePresetId) => void
  toggleDarkMode: () => void
  resetToDefault: () => void
  activePreset: ThemePreset
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanyBrandingSettings>(() => {
    return storage.get<CompanyBrandingSettings>('branding_settings', DEFAULT_BRANDING_SETTINGS)
  })

  const activePreset = THEME_PRESETS[settings.themePreset] || THEME_PRESETS.lavender

  // Apply CSS variables whenever settings change
  useEffect(() => {
    const root = document.documentElement
    const isDark = settings.isDarkMode || activePreset.isDark || false

    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Apply primary color
    root.style.setProperty('--color-primary', settings.primaryColor)
    
    // Auto calculate a hover color if custom color used
    if (settings.themePreset !== 'lavender' && settings.primaryColor !== activePreset.primary) {
      root.style.setProperty('--color-primary-hover', settings.primaryColor)
    } else {
      root.style.setProperty('--color-primary-hover', activePreset.primaryHover)
    }

    if (!isDark) {
      root.style.setProperty('--color-surface-subtle', activePreset.surfaceSubtle)
      root.style.setProperty('--color-bg-page', activePreset.pageBg)
      root.style.setProperty('--color-card-bg', activePreset.cardBg)
      root.style.setProperty('--color-text-main', activePreset.textMain)
      root.style.setProperty('--color-text-secondary', activePreset.textSecondary)
      root.style.setProperty('--color-border', activePreset.border)
    }

    // Sidebar appearance styling
    if (settings.sidebarStyle === 'dark') {
      root.style.setProperty('--color-sidebar-bg', '#1E1B2E')
      root.style.setProperty('--color-sidebar-border', '#2F2B48')
    } else if (settings.sidebarStyle === 'tinted') {
      root.style.setProperty('--color-sidebar-bg', isDark ? '#1C192E' : '#F6F3FC')
      root.style.setProperty('--color-sidebar-border', isDark ? '#2E2A4A' : '#E8E3F5')
    } else {
      root.style.setProperty('--color-sidebar-bg', isDark ? '#161520' : '#FFFFFF')
      root.style.setProperty('--color-sidebar-border', isDark ? '#2A273C' : '#EAE7F1')
    }

    storage.set('branding_settings', settings)
  }, [settings, activePreset])

  const updateSettings = (newSettings: Partial<CompanyBrandingSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  const applyPreset = (presetId: ThemePresetId) => {
    const preset = THEME_PRESETS[presetId]
    if (!preset) return
    setSettings((prev) => ({
      ...prev,
      themePreset: presetId,
      primaryColor: preset.primary,
      accentColor: preset.surfaceSubtle,
      isDarkMode: preset.isDark || false,
    }))
  }

  const toggleDarkMode = () => {
    setSettings((prev) => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
    }))
  }

  const resetToDefault = () => {
    setSettings(DEFAULT_BRANDING_SETTINGS)
    storage.set('branding_settings', DEFAULT_BRANDING_SETTINGS)
  }

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        applyPreset,
        toggleDarkMode,
        resetToDefault,
        activePreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
