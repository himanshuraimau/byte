# Folder Structure - Daily Timeline App

This document provides a detailed breakdown of the folder structure and file organization for the Daily Timeline App.

---

## Root Directory

```
byte/
├── app/                    # Expo Router routes (file-based routing)
├── src/                    # Source code (all app logic)
├── assets/                 # Static assets (images, fonts, icons)
├── docs/                   # Documentation files
├── .expo/                  # Expo build cache (gitignored)
├── node_modules/           # Dependencies (gitignored)
├── .gitignore
├── app.json                # Expo configuration
├── package.json
├── tsconfig.json
├── babel.config.js
└── README.md
```

---

## `/app` - Expo Router Routes

Expo Router uses file-based routing. Files in `/app` become routes.

```
app/
├── _layout.tsx             # Root layout (providers, theme setup)
├── (tabs)/                 # Tab navigation group
│   ├── _layout.tsx         # Tabs layout configuration
│   ├── index.tsx           # Timeline screen (default route)
│   └── timer.tsx           # Timer screen
└── modal.tsx                # Calendar modal (if using modal route)
```

**Purpose:** Define navigation structure and route components.

---

## `/src` - Source Code

All application logic, components, and utilities live here.

### `/src/components` - UI Components

```
src/components/
├── ui/                     # Base UI components (reusable)
│   ├── Card.tsx            # Base card component
│   ├── Button.tsx          # Button variants (primary, secondary, destructive)
│   ├── Input.tsx           # Text input component
│   ├── Textarea.tsx        # Multi-line text input
│   ├── ProgressBar.tsx     # Progress bar component
│   ├── Checkbox.tsx        # Checkbox component
│   ├── SegmentedControl.tsx  # YESTERDAY/TODAY/TOMORROW selector
│   ├── Modal.tsx           # Base modal component
│   ├── Sheet.tsx           # Bottom sheet component
│   └── index.ts            # Barrel exports
│
├── timeline/               # Timeline-specific components
│   ├── DateHeader.tsx      # Date header with metadata
│   ├── TemporalSelector.tsx  # YESTERDAY/TODAY/TOMORROW control
│   ├── AddActionBar.tsx    # [+ TASK] [+ NOTE] [+ SESSION] bar
│   ├── TaskCard.tsx        # Task entry card
│   ├── NoteCard.tsx        # Note entry card
│   ├── SessionCard.tsx     # Session log card
│   ├── TimelineList.tsx    # Chronological entries list
│   ├── EmptyState.tsx      # Empty timeline state
│   └── index.ts
│
├── timer/                  # Timer-specific components
│   ├── TimerDisplay.tsx    # Large timer countdown display
│   ├── TimerForm.tsx       # Timer start form
│   ├── DurationPresets.tsx # Duration preset chips (60, 90, 120)
│   ├── ProgressIndicator.tsx  # Circular/linear progress
│   ├── TimerActions.tsx    # Complete/Cancel buttons
│   └── index.ts
│
├── calendar/               # Calendar components
│   ├── CalendarModal.tsx   # Calendar overlay modal
│   ├── CalendarGrid.tsx    # Month grid layout
│   ├── CalendarDay.tsx     # Individual day cell
│   └── index.ts
│
└── modals/                 # Modal/sheet components
    ├── TaskModal.tsx       # Task create/edit modal
    ├── NoteModal.tsx       # Note create/edit modal
    ├── ConfirmDialog.tsx   # Confirmation dialog
    └── index.ts
```

**Purpose:** All reusable UI components organized by feature area.

---

### `/src/screens` - Screen Components

```
src/screens/
├── TimelineScreen.tsx       # Main timeline screen logic
└── TimerScreen.tsx          # Timer screen logic
```

**Purpose:** Complex screen logic separated from route files. Route files (`app/`) can import and use these.

---

### `/src/database` - Database Layer

```
src/database/
├── db.ts                    # Database initialization and connection
├── migrations/              # Schema migrations
│   ├── 001_initial.sql      # Initial schema
│   └── index.ts             # Migration runner
│
├── models/                  # TypeScript interfaces/types
│   ├── Day.ts               # Day model interface
│   ├── Task.ts              # Task model interface
│   ├── Note.ts              # Note model interface
│   ├── Session.ts           # Session model interface
│   └── index.ts
│
└── repositories/            # Data access layer (CRUD)
    ├── DayRepository.ts      # Day CRUD operations
    ├── TaskRepository.ts     # Task CRUD operations
    ├── NoteRepository.ts     # Note CRUD operations
    ├── SessionRepository.ts  # Session CRUD operations
    └── index.ts
```

**Purpose:** All database-related code: schema, models, and data access.

---

### `/src/services` - Business Logic

```
src/services/
├── TimelineService.ts       # Timeline assembly and sorting logic
├── TimerService.ts          # Timer countdown and background execution
├── DateService.ts           # Date manipulation and formatting
└── index.ts
```

**Purpose:** Business logic that doesn't belong in components or repositories.

---

### `/src/hooks` - Custom React Hooks

```
src/hooks/
├── useTimeline.ts           # Timeline data fetching hook
├── useTimer.ts             # Timer logic hook
├── useDate.ts              # Date selection and manipulation hook
├── useDatabase.ts          # Database connection hook
├── useTask.ts              # Task operations hook
├── useNote.ts              # Note operations hook
├── useSession.ts           # Session operations hook
└── index.ts
```

**Purpose:** Reusable logic extracted into custom hooks.

---

### `/src/context` - React Context Providers

```
src/context/
├── DateContext.tsx          # Global date selection state
├── TimerContext.tsx        # Global timer state
├── TimelineContext.tsx     # Global timeline data state
└── index.ts
```

**Purpose:** Global state management using React Context.

---

### `/src/utils` - Utility Functions

```
src/utils/
├── date.ts                 # Date formatting, manipulation (using date-fns)
├── format.ts               # Text formatting utilities
├── validation.ts           # Input validation functions
└── index.ts
```

**Purpose:** Pure utility functions with no side effects.

---

### `/src/constants` - App Constants

```
src/constants/
├── theme.ts                # Design tokens (colors, typography, spacing, shadows)
├── config.ts               # App configuration (app name, version, etc.)
└── types.ts                # Shared TypeScript types
```

**Purpose:** Centralized constants and configuration.

---

### `/src/types` - TypeScript Definitions

```
src/types/
├── database.ts             # Database-related types
├── entities.ts             # Entity type definitions
├── navigation.ts           # Navigation type definitions
└── index.ts
```

**Purpose:** TypeScript type definitions and interfaces.

---

## `/assets` - Static Assets

```
assets/
├── images/                 # Image assets
│   ├── icons/              # App icons (if custom)
│   └── splash/             # Splash screen images
├── fonts/                  # Custom fonts (if any)
│   ├── Inter-Regular.ttf
│   ├── Inter-Medium.ttf
│   ├── IBMPlexMono-Regular.ttf
│   └── ...
└── icons/                  # Icon assets (if not using Expo Icons)
```

**Purpose:** Static assets used in the app.

---

## `/docs` - Documentation

```
docs/
├── plan.md                 # Product specification (original)
├── PHASES.md              # Implementation phases
├── DESIGN.md              # Design system documentation
├── ARCHITECTURE.md        # Technical architecture
└── FOLDER_STRUCTURE.md    # This file
```

**Purpose:** Project documentation and planning.

---

## File Naming Conventions

### Components
- **PascalCase:** `TaskCard.tsx`, `DateHeader.tsx`
- **One component per file**
- **Index files:** `index.ts` for barrel exports

### Utilities & Services
- **camelCase:** `date.ts`, `format.ts`, `TimelineService.ts`
- **Descriptive names:** Clear purpose from filename

### Types & Interfaces
- **PascalCase:** `Task.ts`, `Session.ts`
- **Suffix types:** `TaskType`, `SessionType` (if needed)

### Constants
- **UPPER_SNAKE_CASE:** `MAX_PROGRESS = 100`
- **Grouped in objects:** `Colors.bg0`, `Spacing.lg`

---

## Import Patterns

### Absolute Imports (Recommended)
```typescript
// Using @ alias (configured in tsconfig.json)
import { TaskCard } from '@/components/timeline/TaskCard';
import { useTimer } from '@/hooks/useTimer';
import { Colors } from '@/constants/theme';
```

### Relative Imports (For nearby files)
```typescript
// Within same directory
import { TaskCard } from './TaskCard';
import { TaskCard } from '../timeline/TaskCard';
```

---

## Barrel Exports

Use `index.ts` files for cleaner imports:

```typescript
// src/components/ui/index.ts
export { Card } from './Card';
export { Button } from './Button';
export { Input } from './Input';

// Usage
import { Card, Button, Input } from '@/components/ui';
```

---

## Gitignore Patterns

```
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
*.log
```

---

## Key Principles

1. **Separation of Concerns:** Logic, UI, and data access are separated
2. **Feature-Based Organization:** Components grouped by feature area
3. **Reusability:** Shared components in `/ui`, feature-specific in feature folders
4. **Type Safety:** TypeScript types defined and used throughout
5. **Scalability:** Structure supports growth without refactoring

---

**Last Updated:** [Current Date]
**Version:** 1.0
