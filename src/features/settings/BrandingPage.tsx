import React, { useState } from 'react'
import { useTheme, THEME_PRESETS, DEFAULT_BRANDING_SETTINGS } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import type { CompanyBrandingSettings, ThemePresetId } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import {
  Palette,
  Check,
  RotateCcw,
  Upload,
  Sparkles,
  Eye,
  Sun,
  Moon,
  Layers,
  Building,
  Save,
} from 'lucide-react'

export const BrandingPage: React.FC = () => {
  const { settings, updateSettings, applyPreset, resetToDefault } = useTheme()
  const { toast } = useToast()

  // Local draft state for live editing & preview before saving
  const [draft, setDraft] = useState<CompanyBrandingSettings>({ ...settings })
  const [logoPreview, setLogoPreview] = useState<string>(settings.logoUrl || '')

  const handlePresetSelect = (presetId: ThemePresetId) => {
    const preset = THEME_PRESETS[presetId]
    if (!preset) return
    const updatedDraft: CompanyBrandingSettings = {
      ...draft,
      themePreset: presetId,
      primaryColor: preset.primary,
      accentColor: preset.surfaceSubtle,
      isDarkMode: preset.isDark || false,
    }
    setDraft(updatedDraft)
    // Instantly preview in theme context
    updateSettings(updatedDraft)
    toast({
      title: `Switched to ${preset.name}! ✨`,
      description: 'Preview updated across all components.',
      type: 'info',
    })
  }

  const handlePrimaryColorChange = (color: string) => {
    const updatedDraft = {
      ...draft,
      primaryColor: color,
    }
    setDraft(updatedDraft)
    updateSettings({ primaryColor: color })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
        setDraft((prev) => ({ ...prev, logoUrl: result }))
        updateSettings({ logoUrl: result })
        toast({ title: 'Company logo updated', type: 'success' })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!draft.companyName.trim()) {
      toast({ title: 'Validation error', description: 'Company name cannot be empty.', type: 'error' })
      return
    }
    updateSettings(draft)
    toast({
      title: 'Branding preferences saved! 🎨',
      description: 'Your changes are persisted to organization storage.',
      type: 'success',
    })
  }

  const handleReset = () => {
    resetToDefault()
    setDraft(DEFAULT_BRANDING_SETTINGS)
    setLogoPreview('')
    toast({
      title: 'Reset to default theme',
      description: 'Lavender Calm default restored.',
      type: 'info',
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Company Branding & Appearance</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Personalize your workspace aesthetic, company logos, primary color schemes, and sidebars
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={handleReset}
          >
            Reset Default
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preset Palettes */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-text-main">Curated Theme Presets</h3>
              <p className="text-xs text-text-secondary">
                Select from our harmonious, accessible enterprise palettes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(THEME_PRESETS) as ThemePresetId[]).map((pid) => {
                const preset = THEME_PRESETS[pid]
                const isSelected = draft.themePreset === pid
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => handlePresetSelect(pid)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-surface-subtle/50 shadow-xs'
                        : 'border-border hover:border-text-secondary/40 bg-surface'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <h4 className="text-xs font-bold text-text-main">{preset.name}</h4>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-[11px] text-text-secondary mt-1.5 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: preset.primary }} />
                      <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: preset.surfaceSubtle }} />
                      <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: preset.border }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Custom Color Picker & Sidebar Style */}
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-bold text-text-main">Custom Primary Color & Contrast</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-main block">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.primaryColor}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border p-1 bg-surface"
                  />
                  <Input
                    value={draft.primaryColor}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    placeholder="#8B7BC8"
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-main block">
                  Sidebar Visual Appearance
                </label>
                <Select
                  value={draft.sidebarStyle}
                  onChange={(e) => {
                    const val = e.target.value as any
                    setDraft((prev) => ({ ...prev, sidebarStyle: val }))
                    updateSettings({ sidebarStyle: val })
                  }}
                  options={[
                    { value: 'light', label: 'Clean White / Light' },
                    { value: 'tinted', label: 'Lavender Tinted Subtle' },
                    { value: 'dark', label: 'Deep Slate Contrast' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/80">
              <div>
                <span className="text-xs font-semibold text-text-main block">Dark Mode</span>
                <span className="text-[11px] text-text-secondary">
                  Toggle application wide high-contrast dark theme
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const toggled = !draft.isDarkMode
                  setDraft((prev) => ({ ...prev, isDarkMode: toggled }))
                  updateSettings({ isDarkMode: toggled })
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  draft.isDarkMode ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    draft.isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </Card>

          {/* Company Details & Logo Upload */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-text-main">Company Profile & Logo</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={draft.companyName}
                onChange={(e) => {
                  setDraft((prev) => ({ ...prev, companyName: e.target.value }))
                  updateSettings({ companyName: e.target.value })
                }}
                required
              />

              <Input
                label="Organization ID"
                value={draft.organizationId}
                onChange={(e) => {
                  setDraft((prev) => ({ ...prev, organizationId: e.target.value }))
                  updateSettings({ organizationId: e.target.value })
                }}
                required
              />

              <Input
                label="Company Tagline"
                value={draft.tagline}
                onChange={(e) => setDraft((prev) => ({ ...prev, tagline: e.target.value }))}
              />

              <Input
                label="Support Contact Email"
                value={draft.supportEmail}
                onChange={(e) => setDraft((prev) => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>

            {/* Logo Upload Field */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-text-main block mb-2">
                Company Brand Mark / Logo
              </label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Brand Logo"
                    className="w-12 h-12 rounded-xl object-cover border border-border shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-main hover:bg-surface-hover cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-primary" /> Upload New Logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <p className="text-[10px] text-text-muted mt-1">
                    PNG, SVG, or JPG recommended (minimum 120x120px)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-20 space-y-5 border-2 border-primary/20 shadow-modal">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-text-main text-sm">Real-time Component Preview</h3>
              </div>
              <Badge variant="lavender" size="sm">
                Live
              </Badge>
            </div>

            {/* Preview Brand Header */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle/50 border border-border/80">
              <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-main truncate">
                  {draft.companyName || 'Your Company'}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {draft.tagline || 'Talent Experience'}
                </p>
              </div>
            </div>

            {/* Preview Buttons */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-text-muted uppercase">Button Hierarchy</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="primary">
                  Primary Action
                </Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <Button size="sm" variant="outline">
                  Outline
                </Button>
              </div>
            </div>

            {/* Preview Status Badges */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-text-muted uppercase">Status Accents</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="success" size="sm">
                  Active
                </Badge>
                <Badge variant="warning" size="sm">
                  Under Review
                </Badge>
                <Badge variant="error" size="sm">
                  Urgent
                </Badge>
                <Badge variant="lavender" size="sm">
                  Awarded
                </Badge>
              </div>
            </div>

            {/* Preview Card Mockup */}
            <div className="p-4 rounded-xl border border-border bg-surface space-y-2 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-main">Sample Employee Card</span>
                <span className="text-[10px] text-primary font-semibold">EMP-1042</span>
              </div>
              <p className="text-xs text-text-secondary">
                Cards and layout panels automatically inherit your customized border tokens and primary accent.
              </p>
              <div className="pt-2 flex justify-end">
                <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
                  Learn more →
                </button>
              </div>
            </div>

            <Button className="w-full" variant="primary" onClick={handleSave}>
              Save and Apply to Workspace
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
