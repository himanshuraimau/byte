# Design System - Daily Timeline App

**Design Philosophy:** High-Precision Industrial Minimalism

This document defines the complete design system for the Daily Timeline App, following a clinical, computational aesthetic with grid-based precision.

---

## Design Principles

1. **Clinical Neutrality** - Clean, unemotional interface
2. **Computational Character** - Data-first presentation
3. **Grid-Based Layouts** - Visible construction logic
4. **Instrumental Aesthetic** - Every element is a reading/display
5. **High Readability** - Low visual noise, clear hierarchy
6. **Geometric Precision** - Sharp, defined shapes and spacing

---

## Color Palette

### Background Colors
```typescript
bg-0: '#FFFFFF'        // Cards, main backgrounds
bg-1: '#F7F7F7'        // Subtle fills, secondary backgrounds
bg-2: '#EEEEEE'        // Dividers, borders (rare)
```

### Text Colors
```typescript
text-0: '#111111'      // Primary text, headings
text-1: '#444444'      // Secondary text, body content
text-2: '#888888'      // Metadata, timestamps, muted text
text-3: '#BBBBBB'      // Placeholder text, disabled states
```

### Accent Colors
```typescript
accent-0: '#2BB673'    // Primary accent (green), progress bars, active states
accent-1: 'rgba(43, 182, 115, 0.12)'  // Subtle accent backgrounds
accent-2: 'rgba(43, 182, 115, 0.06)'  // Very subtle fills
```

### State Colors
```typescript
destructive: '#DC2626'  // Delete, cancel, errors
warning: '#F59E0B'      // Warnings (future use)
success: '#2BB673'       // Success states (same as accent)
```

### Border Colors
```typescript
border-0: 'rgba(0, 0, 0, 0.06)'   // Subtle borders (rare use)
border-1: 'rgba(0, 0, 0, 0.12)'   // Medium borders
```

---

## Typography

### Font Families

**Sans-Serif (Human Content):**
- Primary: `Inter` or `DM Sans`
- Fallback: System default sans-serif
- Usage: All human-readable content (titles, notes, body text)

**Monospace (System Data):**
- Primary: `IBM Plex Mono` or `JetBrains Mono`
- Fallback: System monospace
- Usage: Timestamps, durations, percentages, metadata, labels

### Type Scale

#### Sans-Serif Scale
```typescript
display: {
  fontSize: 40,
  fontWeight: '500',      // Medium
  lineHeight: 48,
  fontFamily: 'sans-serif'
}

h1: {
  fontSize: 32,
  fontWeight: '500',      // Medium
  lineHeight: 40,
  fontFamily: 'sans-serif'
}

h2: {
  fontSize: 20,
  fontWeight: '500',      // Medium
  lineHeight: 28,
  fontFamily: 'sans-serif'
}

body: {
  fontSize: 15,
  fontWeight: '400',      // Regular
  lineHeight: 22.5,       // 1.5x
  fontFamily: 'sans-serif'
}

small: {
  fontSize: 13,
  fontWeight: '400',      // Regular
  lineHeight: 19.5,
  fontFamily: 'sans-serif'
}
```

#### Monospace Scale
```typescript
mono-lg: {
  fontSize: 56,           // Timer display
  fontWeight: '400',      // Regular
  lineHeight: 67.2,      // 1.2x (tight)
  fontFamily: 'monospace'
}

mono-md: {
  fontSize: 14,           // Timestamps
  fontWeight: '400',      // Regular
  lineHeight: 18.2,      // 1.3x
  fontFamily: 'monospace'
}

mono-sm: {
  fontSize: 12,           // Labels, metadata
  fontWeight: '400',      // Regular
  lineHeight: 15.6,      // 1.3x
  fontFamily: 'monospace'
}

mono-xs: {
  fontSize: 11,           // System labels, status
  fontWeight: '400',      // Regular
  lineHeight: 14.3,      // 1.3x
  fontFamily: 'monospace'
}
```

### Typography Usage

| Element | Type | Size | Weight | Color |
|---------|------|------|--------|-------|
| Date Header | Sans | display (40px) | Medium | text-0 |
| Card Title | Sans | h2 (20px) | Medium | text-0 |
| Body Text | Sans | body (15px) | Regular | text-1 |
| Timestamp | Mono | mono-md (14px) | Regular | text-2 |
| Metadata Label | Mono | mono-sm (12px) | Regular | text-2 |
| Status Label | Mono | mono-xs (11px) | Regular | text-2 |
| Timer Display | Mono | mono-lg (56px) | Regular | text-0 |
| Percentage | Mono | mono-sm (12px) | Regular | accent-0 |

---

## Spacing System

**Base Unit:** 4px (micro-grid)

### Spacing Scale
```typescript
spacing: {
  xs: 4,      // 1 unit
  sm: 8,      // 2 units
  md: 12,     // 3 units
  base: 16,   // 4 units
  lg: 24,     // 6 units
  xl: 32,     // 8 units
  '2xl': 48,  // 12 units
  '3xl': 64,  // 16 units
  '4xl': 96,  // 24 units
  '5xl': 144  // 36 units
}
```

### Spacing Usage

| Element | Spacing |
|---------|---------|
| Card padding | 24px (lg) |
| Card gap (vertical) | 16px (base) |
| Section margins | 64-96px (3xl-4xl) |
| Button height | 48px (2xl) |
| Input height | 48px (2xl) |
| Icon size | 24px (lg) |
| Touch targets | Minimum 44px |
| Date header top margin | 48px (2xl) |
| Action bar padding | 24px (lg) |
| Modal padding | 32px (xl) |

---

## Shadow System

Depth is created through soft shadows, not borders.

### Shadow Tokens
```typescript
shadows: {
  z1: {                    // Cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,          // Android
    // CSS: 0px 1px 3px rgba(0,0,0,0.04), 0px 3px 12px rgba(0,0,0,0.05)
  },
  
  z2: {                    // Floating action bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
    // CSS: 0px 2px 6px rgba(0,0,0,0.05), 0px 6px 24px rgba(0,0,0,0.06)
  },
  
  z3: {                    // Modals, sheets
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
    // CSS: 0px 4px 10px rgba(0,0,0,0.06), 0px 10px 32px rgba(0,0,0,0.08)
  },
  
  z4: {                    // Calendar overlay
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
    // CSS: 0px 6px 14px rgba(0,0,0,0.08), 0px 14px 48px rgba(0,0,0,0.10)
  }
}
```

### Shadow Usage

| Element | Shadow |
|---------|--------|
| Entry cards (Task, Note, Session) | z1 |
| Add action bar | z2 |
| Modals, sheets | z3 |
| Calendar overlay | z4 |

---

## Border Radius

Minimal use of rounded corners, geometric precision.

```typescript
radius: {
  sm: 8,      // Chips, small buttons
  md: 12,     // Inputs, controls
  lg: 16      // Cards, modals
}
```

### Radius Usage

| Element | Radius |
|---------|--------|
| Chips (duration presets) | 8px (sm) |
| Inputs, buttons | 12px (md) |
| Cards, modals | 16px (lg) |

---

## Component Specifications

### Card Component
```typescript
{
  backgroundColor: bg-0,
  borderRadius: 16,
  padding: 24,
  marginBottom: 16,
  ...shadows.z1,
  borderWidth: 0  // No borders
}
```

### Button Styles

**Primary Button:**
```typescript
{
  backgroundColor: accent-0,
  color: bg-0,
  height: 48,
  borderRadius: 12,
  paddingHorizontal: 24,
  fontSize: 15,
  fontWeight: '500',
  fontFamily: 'sans-serif'
}
```

**Secondary Button (Outline):**
```typescript
{
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: border-0,
  color: text-0,
  height: 48,
  borderRadius: 12,
  paddingHorizontal: 24
}
```

**Destructive Button:**
```typescript
{
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: destructive,
  color: destructive,
  height: 48,
  borderRadius: 12
}
```

### Input Styles

**Text Input:**
```typescript
{
  height: 48,
  fontSize: 16,
  fontFamily: 'sans-serif',
  color: text-0,
  borderBottomWidth: 1,
  borderBottomColor: border-0,
  paddingVertical: 12,
  paddingHorizontal: 0
}
```

**Textarea:**
```typescript
{
  minHeight: 48,
  fontSize: 15,
  fontFamily: 'sans-serif',
  color: text-0,
  lineHeight: 22.5,
  paddingVertical: 12,
  paddingHorizontal: 0,
  borderBottomWidth: 1,
  borderBottomColor: border-0
}
```

### Progress Bar
```typescript
{
  height: 4,
  backgroundColor: bg-2,  // Track
  borderRadius: 2,
  overflow: 'hidden',
  
  fill: {
    height: '100%',
    backgroundColor: accent-0,
    borderRadius: 2
  }
}
```

### Checkbox
```typescript
{
  width: 20,
  height: 20,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: border-0,
  
  checked: {
    backgroundColor: accent-0,
    borderColor: accent-0
  }
}
```

---

## Layout Patterns

### Timeline Layout
```
┌─────────────────────────────────┐
│ [Date Header]                   │  ← 48px top margin
│                                 │
│ [Add Action Bar]                │  ← z2 shadow, 16px radius
│                                 │
│ [Entry Card]                    │  ← z1 shadow, 16px radius
│ [Entry Card]                    │  ← 16px gap
│ [Entry Card]                    │
│                                 │
│ [Empty State]                   │  ← If no entries
└─────────────────────────────────┘
```

### Card Layout
```
┌─────────────────────────────────┐
│ [TYPE] Timestamp                │  ← Mono, 12px, muted
│                                 │  ← 8px gap
│ Title or Content                │  ← Sans, 16px bold or 15px regular
│                                 │
│ [Progress bar or metadata]      │  ← If applicable
│                                 │
│ [Status or actions]             │  ← Bottom section
└─────────────────────────────────┘
```

---

## Animation & Transitions

### Transition Timing
```typescript
transitions: {
  fast: 150,      // Quick feedback
  base: 200,      // Standard transitions
  slow: 300       // Complex animations
}
```

### Easing Functions
```typescript
easing: {
  ease: 'ease',           // Standard
  easeIn: 'ease-in',     // Enter
  easeOut: 'ease-out',   // Exit
  easeInOut: 'ease-in-out'  // Complex
}
```

### Common Animations

**Card Entry:**
- Fade in + slight slide up
- Duration: 200ms
- Easing: ease-out

**Modal Open:**
- Fade in backdrop + scale up modal
- Duration: 300ms
- Easing: ease-out

**Button Press:**
- Slight scale down (0.98)
- Duration: 100ms
- Easing: ease-in-out

**Tab Switch:**
- Fade transition
- Duration: 200ms
- Easing: ease

---

## Iconography

**Style:** Geometric, low-weight line icons

**Size:** 24px (standard), 20px (small), 28px (large)

**Weight:** Thin to regular (1-2px stroke)

**Library:** Expo Icons (Ionicons or Material Icons)

### Icon Usage

| Context | Icon | Size |
|---------|------|------|
| Timeline tab | Home/House | 24px |
| Timer tab | Clock | 24px |
| Calendar | Calendar | 24px |
| Add Task | Plus/Add | 20px |
| Add Note | Document/Note | 20px |
| Add Session | Timer/Clock | 20px |
| Complete | Checkmark | 20px |
| Delete | Trash | 20px |
| Cancel | Close/X | 20px |

---

## Accessibility

### Contrast Ratios
- Text on bg-0: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- Interactive elements: Clear visual feedback

### Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)

### Screen Reader Support
- Semantic labels for all interactive elements
- Descriptive text for icons
- Status announcements for timer and actions

---

## Dark Mode (Future)

Dark mode will invert the color palette:

```typescript
dark: {
  bg-0: '#151718',      // Dark background
  bg-1: '#1F2122',      // Slightly lighter
  text-0: '#ECEDEE',    // Light text
  text-1: '#9BA1A6',   // Muted light
  accent-0: '#2BB673',  // Same accent
  // ... etc
}
```

---

## Design Checklist

Every component should follow:
- [ ] Grid-based alignment (4px increments)
- [ ] Monospaced type for system data
- [ ] Sans-serif for human content
- [ ] Neutral color palette
- [ ] Soft shadows (no borders)
- [ ] Geometric precision
- [ ] Adequate spacing (exaggerated vertical)
- [ ] High readability
- [ ] Minimal decoration

---

**Last Updated:** [Current Date]
**Version:** 1.0
