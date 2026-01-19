# Technical Architecture - Daily Timeline App

This document outlines the technical architecture, folder structure, data flow, and implementation patterns for the Daily Timeline App.

---

## Tech Stack

### Core Framework

- **Expo SDK:** ~54.0.31
- **React Native:** 0.81.5
- **React:** 19.1.0
- **TypeScript:** ~5.9.2

### Navigation

- **Expo Router:** ~6.0.21 (File-based routing)
- **React Navigation:** ~7.1.8 (Underlying navigation)

### Database

- **expo-sqlite:** Local SQLite database
- **SQLite3:** Native SQLite implementation

### State Management

- **React Context API:** Global state (date, timer)
- **React Hooks:** useState, useReducer, useEffect
- **Custom Hooks:** Data fetching, timer logic

### Styling

- **React Native StyleSheet:** Component styling
- **Design Tokens:** Centralized constants
- **No external UI library:** Custom components

### Utilities

- **expo-haptics:** Haptic feedback
- **expo-status-bar:** Status bar control
- **date-fns:** Date manipulation and formatting

---

## Folder Structure

```
byte/
├── app/                          # Expo Router routes (file-based routing)
│   ├── _layout.tsx              # Root layout (providers, theme)
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tabs layout (Timeline | Timer)
│   │   ├── index.tsx           # Timeline screen (default)
│   │   └── timer.tsx           # Timer screen
│   └── modal.tsx                # Calendar modal (if needed)
│
├── src/
│   ├── components/              # Shared UI components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── SegmentedControl.tsx
│   │   │
│   │   ├── timeline/           # Timeline-specific components
│   │   │   ├── DateHeader.tsx
│   │   │   ├── AddActionBar.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── SessionCard.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── timer/              # Timer-specific components
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── TimerForm.tsx
│   │   │   ├── DurationPresets.tsx
│   │   │   └── ProgressIndicator.tsx
│   │   │
│   │   ├── calendar/           # Calendar components
│   │   │   ├── CalendarModal.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   └── CalendarDay.tsx
│   │   │
│   │   └── modals/             # Modal components
│   │       ├── TaskModal.tsx
│   │       ├── NoteModal.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── screens/                # Screen components (if complex)
│   │   ├── TimelineScreen.tsx
│   │   └── TimerScreen.tsx
│   │
│   ├── database/               # Database layer
│   │   ├── db.ts              # Database initialization
│   │   ├── migrations/        # Schema migrations
│   │   │   └── 001_initial.sql
│   │   ├── models/            # Data models/types
│   │   │   ├── Day.ts
│   │   │   ├── Task.ts
│   │   │   ├── Note.ts
│   │   │   └── Session.ts
│   │   └── repositories/      # Data access layer
│   │       ├── DayRepository.ts
│   │       ├── TaskRepository.ts
│   │       ├── NoteRepository.ts
│   │       └── SessionRepository.ts
│   │
│   ├── services/               # Business logic services
│   │   ├── TimelineService.ts
│   │   ├── TimerService.ts
│   │   └── DateService.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTimeline.ts
│   │   ├── useTimer.ts
│   │   ├── useDate.ts
│   │   └── useDatabase.ts
│   │
│   ├── context/                # React Context providers
│   │   ├── DateContext.tsx
│   │   ├── TimerContext.tsx
│   │   └── TimelineContext.tsx
│   │
│   ├── utils/                  # Utility functions
│   │   ├── date.ts            # Date formatting, manipulation
│   │   ├── format.ts          # Text formatting
│   │   └── validation.ts     # Input validation
│   │
│   ├── constants/              # App constants
│   │   ├── theme.ts           # Design tokens (colors, typography, spacing)
│   │   ├── config.ts          # App configuration
│   │   └── types.ts           # TypeScript type definitions
│   │
│   └── types/                  # TypeScript interfaces
│       ├── database.ts        # Database types
│       ├── entities.ts        # Entity types
│       └── navigation.ts      # Navigation types
│
├── assets/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── docs/                       # Documentation
│   ├── plan.md
│   ├── PHASES.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   └── FOLDER_STRUCTURE.md
│
├── app.json                    # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## Data Flow

### 1. Database Layer

```
SQLite Database
    ↓
Repositories (CRUD operations)
    ↓
Services (Business logic)
    ↓
Hooks (React integration)
    ↓
Components/Screens
```

### 2. State Management Flow

```
Global State (Context)
    ↓
DateContext → Current date selection
TimerContext → Active timer state
TimelineContext → Timeline data
    ↓
Components consume via hooks
    ↓
User actions → Update context → Refresh UI
```

### 3. Timer Flow

```
TimerScreen
    ↓
useTimer hook
    ↓
TimerService (background execution)
    ↓
SessionRepository (save to DB)
    ↓
TimelineContext (refresh timeline)
```

---

## Database Schema

### Tables

**days**

```sql
CREATE TABLE days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,  -- ISO 8601: YYYY-MM-DD
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
```

**tasks**

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  completed INTEGER NOT NULL DEFAULT 0,  -- Boolean: 0 or 1
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
);
```

**notes**

```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
);
```

**sessions**

```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  task_id INTEGER,  -- Nullable: standalone sessions allowed
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,  -- Nullable until completed
  completed INTEGER NOT NULL DEFAULT 0,  -- Boolean: 0 or 1
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);
```

### Indexes

```sql
CREATE INDEX idx_tasks_day_id ON tasks(day_id);
CREATE INDEX idx_notes_day_id ON notes(day_id);
CREATE INDEX idx_sessions_day_id ON sessions(day_id);
CREATE INDEX idx_sessions_task_id ON sessions(task_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
```

---

## Component Architecture

### Component Hierarchy

```
App (_layout.tsx)
├── ThemeProvider
├── DateContext.Provider
├── TimerContext.Provider
└── NavigationContainer
    └── Tabs Navigator
        ├── TimelineScreen (index.tsx)
        │   ├── DateHeader
        │   ├── TemporalSelector (YESTERDAY/TODAY/TOMORROW)
        │   ├── AddActionBar
        │   └── TimelineEntries
        │       ├── TaskCard
        │       ├── NoteCard
        │       └── SessionCard
        └── TimerScreen (timer.tsx)
            ├── TimerDisplay (if active)
            └── TimerForm (if inactive)
```

### Component Patterns

**1. Container/Presentational Pattern**

- Screens: Container components (logic, data fetching)
- Components: Presentational components (UI only)

**2. Compound Components**

- Card components with sub-components (Card.Header, Card.Body, Card.Footer)

**3. Custom Hooks**

- Extract logic from components
- Reusable across components

---

## State Management Strategy

### Global State (Context)

**DateContext**

```typescript
{
  selectedDate: Date,
  setSelectedDate: (date: Date) => void,
  temporalMode: 'yesterday' | 'today' | 'tomorrow',
  setTemporalMode: (mode) => void
}
```

**TimerContext**

```typescript
{
  activeSession: Session | null,
  isRunning: boolean,
  remainingSeconds: number,
  startTimer: (session: Session) => void,
  stopTimer: () => void,
  completeTimer: () => void,
  cancelTimer: () => void
}
```

**TimelineContext**

```typescript
{
  entries: TimelineEntry[],
  loading: boolean,
  error: Error | null,
  refreshTimeline: () => Promise<void>
}
```

### Local State

- Form inputs (useState)
- Modal visibility (useState)
- UI interactions (useState)

---

## API/Service Layer

### Repository Pattern

Each entity has a repository handling CRUD operations:

```typescript
interface Repository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(dayId: number): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
```

### Service Layer

Business logic services:

**TimelineService**

- Assembles timeline entries (tasks, notes, sessions)
- Sorts chronologically
- Formats data for display

**TimerService**

- Manages timer countdown
- Background execution
- Session completion logic

**DateService**

- Date manipulation
- ISO 8601 formatting
- Temporal mode calculations

---

## Error Handling

### Strategy

1. **Database Errors:** Catch and log, show user-friendly message
2. **Validation Errors:** Show inline errors in forms
3. **Network Errors:** N/A (local-first, no network)
4. **Runtime Errors:** Error boundaries, fallback UI

### Error Boundaries

- Wrap main screens in error boundaries
- Show fallback UI on crash
- Log errors for debugging

---

## Performance Optimization

### Strategies

1. **Memoization:** React.memo for expensive components
2. **Virtualization:** FlatList for long timelines
3. **Lazy Loading:** Load entries on demand
4. **Database Indexing:** Index frequently queried columns
5. **Debouncing:** Debounce search/filter inputs

### Optimization Targets

- Initial load: < 1 second
- Navigation: < 200ms
- Database queries: < 100ms
- Timer accuracy: ±1 second

---

## Testing Strategy

### Unit Tests

- Utility functions
- Date formatting
- Data validation

### Integration Tests

- Repository operations
- Service layer logic
- Database queries

### Component Tests

- Key components (TaskCard, TimerDisplay)
- User interactions
- State changes

### E2E Tests (Future)

- Complete user flows
- Timer execution
- Data persistence

---

## Security Considerations

### Data Privacy

- All data stored locally (SQLite)
- No cloud sync (V1)
- No user authentication needed (personal app)

### Input Validation

- Sanitize user inputs
- Validate data types
- Prevent SQL injection (parameterized queries)

---

## Build & Deployment

### Development

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

### Production Build

```bash
eas build --platform android
eas build --platform ios
```

### Environment Variables

- No sensitive data (local-first app)
- Configuration in `app.json` and `constants/config.ts`

---

## Future Considerations

### Scalability

- Pagination for long timelines
- Database optimization for large datasets
- Code splitting if app grows

### Features (Post-V1)

- Cloud sync (SQLite → cloud backup)
- Export functionality
- Search/filter
- Analytics

### Architecture Evolution

- Consider state management library (Zustand, Redux) if complexity grows
- Consider UI library if custom components become burdensome
- Consider backend if cloud sync needed

---

**Last Updated:** [Current Date]
**Version:** 1.0
