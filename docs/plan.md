# Daily Timeline App - Product Specification Document

## Core Concept
A temporal note-taking and productivity system that captures your day as a chronological timeline. Built on three pillars: **tasks with progress tracking**, **freeform notes**, and **timed work sessions**. Everything flows into a single timeline view organized by day.

---

## Design Philosophy
Following **high-precision industrial minimalism** design language:
- Clinical neutrality with computational character
- Grid-based layouts with visible construction logic
- Monospaced typography for system data (timestamps, durations, percentages)
- Sans-serif for human-readable content
- Minimal color palette: whites, grays, muted accent green
- Depth through soft shadows, not borders
- Every UI element treated as an instrument reading

---

## Navigation Structure

### Primary Navigation (Top)
**Three-state temporal selector:**
- **YESTERDAY** - Read-only archive of previous day
- **TODAY** - Active workspace (default view)
- **TOMORROW** - Planning space for next day

Visual treatment:
- Horizontal segmented control
- Active state: subtle background fill
- Inactive states: transparent with low-opacity text
- Geometric sans, medium weight, 14-16px
- Transitions: smooth 200ms ease

### Secondary Navigation (Bottom)
**Two primary actions:**
- **Timeline** (Home icon) - Main chronological view
- **Timer** (Clock icon) - Session management interface

Icon style: geometric, low-weight line icons, 24px
Active state: accent color fill
Label: 12px mono uppercase below icon

### Calendar Access
**Floating activation point** - Top-right corner icon
- Opens modal overlay with calendar grid
- Allows jump to any date (past or future)
- Selected date becomes active view
- Calendar closes, loads that day's timeline

Calendar design:
- Grid-based month view
- Days with content: subtle dot indicator below date
- Today: accent border
- Selected: filled background
- Monospaced numerals for dates
- Minimal decoration, high information density

---

## Timeline View (Primary Interface)

### Layout Structure
```
[Date Header]
  ↓
[Add Action Bar]
  ↓
[Chronological Entries]
  - Task cards
  - Note cards
  - Session logs
  ↓
[Empty state / End of day]
```

### Date Header
- Large geometric sans: "TODAY" or "JAN 20, 2026"
- Monospaced metadata: `[TIMELINE_ACTIVE]` `[ENTRIES: 12]`
- Exaggerated vertical spacing: 48px top margin

### Add Action Bar
Horizontal control strip with three addition modes:
- `[+ TASK]`
- `[+ NOTE]`
- `[+ SESSION]` *(links to Timer view)*

Visual treatment:
- Floating card with z1 shadow
- 16px corner radius
- 24px internal padding
- Icons + labels in muted gray
- Hover: slight scale + accent color shift

### Entry Cards

**Shared card properties:**
- 16px corner radius
- z1 shadow (subtle depth)
- 24px padding
- 16px vertical spacing between cards
- White background
- Border: none

**Task Card:**
```
┌─────────────────────────────────┐
│ [TASK] 12:34 PM                 │  ← Mono, 12px, muted
│                                  │
│ Deep study session               │  ← Sans, 16px, bold
│                                  │
│ ▓▓▓▓▓▓▓░░░ 65%                  │  ← Progress bar + percentage
│                                  │
│ [ ] INCOMPLETE                   │  ← Checkbox + status
└─────────────────────────────────┘
```

- Progress bar: 4px height, accent green fill, light gray track
- Percentage: monospaced, right-aligned
- Checkbox: 20px geometric outline
- Status label: mono uppercase 11px

**Note Card:**
```
┌─────────────────────────────────┐
│ [NOTE] 2:15 PM                   │
│                                  │
│ Meeting insights from standup    │  ← First line bold
│ - Need to follow up on API       │  ← Body text regular
│   deployment timeline            │
│ - Design review scheduled Thu    │
└─────────────────────────────────┘
```

- Timestamp: mono, muted
- Content: sans, 15px, 1.5 line height
- First line can be treated as title (auto-bold if short)

**Session Log Card:**
```
┌─────────────────────────────────┐
│ [SESSION_COMPLETE] 4:30 PM       │
│                                  │
│ Writing documentation            │  ← Session name
│                                  │
│ DURATION: 60:00                  │  ← Mono, accent color
│ STARTED: 3:30 PM                 │
│ ENDED: 4:30 PM                   │
└─────────────────────────────────┘
```

- All time data: monospaced
- Duration emphasized: accent color, medium weight
- Session name: sans, 16px bold
- Metadata grid: property-value pairs, 12px mono

---

## Timer Interface (Dedicated View)

### Layout
Single-purpose focused interface for session management.

**Active Timer State:**
```
╔═══════════════════════════════╗
║                               ║
║    45:23                      ║  ← Large mono display
║    REMAINING                  ║
║                               ║
║    Writing documentation      ║  ← Session name
║                               ║
║    [████████░░] 75%           ║  ← Progress arc/bar
║                               ║
║    STARTED: 3:30 PM           ║  ← Metadata
║    TARGET: 60:00              ║
║                               ║
║    [✓ COMPLETE]  [✕ CANCEL]  ║  ← Actions
║                               ║
╚═══════════════════════════════╝
```

Visual specs:
- Timer display: 56-72px monospaced, center-aligned
- Circular progress indicator optional (clean geometric stroke)
- Metadata: 12px mono, low opacity
- Action buttons: full-width, 48px height, 12px radius
- Complete button: accent fill when timer > 0
- Cancel: outline only, destructive red accent

**Inactive/Start State:**
```
┌───────────────────────────────┐
│ SESSION NAME                   │  ← Input field
│ [Enter session name...]        │
│                                │
│ DURATION (MINUTES)             │
│ [60] [90] [120] [Custom]       │  ← Preset chips
│                                │
│ LINK TO TASK (OPTIONAL)        │
│ [Select task...] ▾             │  ← Dropdown
│                                │
│        [START SESSION]         │  ← Primary action
└───────────────────────────────┘
```

Input specs:
- Text input: 16px sans, bottom border only
- Duration chips: 12px mono, 8px radius, tap to select
- Custom opens numeric input
- Start button: accent background, white text, 48px height

### Timer Behavior
- Runs in background when navigating away
- Persistent notification badge on Timer tab icon
- Auto-logs to timeline when completed via checkmark
- Completion triggers haptic feedback
- Cancel discards session (no log created)
- Can create standalone session OR link to existing task
- Linked sessions appear nested under task in timeline

---

## Task Interactions

### Creating Task
Modal/sheet from `[+ TASK]` button:
- Title input field (required)
- Initial progress slider (0-100%, default 0%)
- Optional: link to future session
- `[CREATE]` action button

### Editing Task
Tap card to expand inline or open detail view:
- Edit title
- Adjust progress slider (0-100% in 5% increments)
- Toggle completion checkbox
- Delete task option (destructive, confirmation required)

### Progress Slider
- Horizontal slider component
- Snap to 5% increments
- Current value displays as `65%` in mono
- Track: light gray, fill: accent green
- Large touch target (48px height)

### Completion Logic
- Checkbox can be marked done at ANY percentage
- Done state: visual strikethrough, muted opacity
- Percentage still visible and editable even when done
- Logic: completion ≠ 100% necessarily (user decides)

---

## Note Interactions

### Creating Note
Modal/sheet from `[+ NOTE]` button:
- Multi-line text area
- Auto-expanding height
- Markdown support optional (bold, lists)
- Timestamp auto-generated on save
- `[SAVE]` action

### Editing Note
Tap to open edit mode:
- Full text editable
- Timestamp preserved (original creation time)
- Can add `[EDITED]` label in mono if modified

---

## Calendar Modal

### Trigger
Top-right icon in header (calendar glyph)

### Design
Full-screen modal overlay with:
- Semi-transparent backdrop (40% black)
- Centered calendar card (max-width 400px)
- z4 shadow depth
- Close button top-right

### Calendar Grid
```
     JAN 2026
S  M  T  W  T  F  S
               1  2  3
4  5  6  7  8  9  10
11 12 13 14 15 16 17
18 [19] 20 21 22 23 24  ← 19 = yesterday
25 26 27 28 29 30 31

● = has entries
□ = today (border)
■ = selected (fill)
```

Interaction:
- Tap date → loads that day's timeline
- Modal dismisses automatically
- Smooth transition to selected date view
- Month navigation: `<` `>` arrows flanking month name

---

## Data Model (SQLite Schema Concept)

### Tables

**days**
- id (primary key)
- date (ISO 8601: YYYY-MM-DD, unique)
- created_at (timestamp)

**tasks**
- id (primary key)
- day_id (foreign key → days)
- title (text)
- progress (integer 0-100)
- completed (boolean)
- created_at (timestamp)
- updated_at (timestamp)

**notes**
- id (primary key)
- day_id (foreign key → days)
- content (text)
- created_at (timestamp)
- updated_at (timestamp)

**sessions**
- id (primary key)
- day_id (foreign key → days)
- task_id (foreign key → tasks, nullable)
- name (text)
- duration_minutes (integer, target duration)
- started_at (timestamp)
- ended_at (timestamp, nullable until completed)
- completed (boolean)
- created_at (timestamp)

### Key Relationships
- One day → many tasks, notes, sessions
- One task → many sessions (optional linking)
- Sessions can exist standalone (task_id = null)

---

## Tech Stack

**Framework:** Expo (React Native)
- Cross-platform (iOS/Android/Web capability)
- Fast iteration with hot reload
- Rich component ecosystem

**Database:** SQLite
- Local-first data storage
- No backend required (V1)
- Fast queries for timeline assembly
- Expo SQLite module integration

**State Management:** React Context + Hooks (useState, useReducer)
- No external state library needed initially
- Simple data flow for V1 scope

**Styling:** StyleSheet API + design tokens
- Programmatic style based on design doc tokens
- Shadow specs, spacing scales, typography defined as constants
- No external UI library initially (custom components)

**Future Considerations (Post-V1):**
- Cloud sync (SQLite → cloud backup)
- Export functionality (JSON, CSV)
- Search/filter across timeline
- Analytics/insights on session data

---

## Color Tokens (From Design Doc)

```
Background:
  bg-0: #FFFFFF (cards, main)
  bg-1: #F7F7F7 (subtle fills)

Text:
  text-0: #111111 (primary)
  text-1: #444444 (secondary/muted)
  text-2: #888888 (metadata, timestamps)

Accent:
  accent-0: #2BB673 (progress, active states)
  accent-1: rgba(43, 182, 115, 0.12) (subtle backgrounds)

Borders:
  border-0: rgba(0, 0, 0, 0.06) (rare use)

States:
  destructive: #DC2626 (delete, cancel)
```

---

## Typography Tokens

```
Sans-serif: Inter or DM Sans

Sizes:
  display: 40px / medium (date headers)
  h1: 32px / medium (section titles)
  h2: 20px / medium (card titles)
  body: 15px / regular (content)
  small: 13px / regular (metadata)

Monospace: IBM Plex Mono or JetBrains Mono

Sizes:
  mono-lg: 56px / regular (timer display)
  mono-md: 14px / regular (timestamps)
  mono-sm: 12px / regular (labels, metadata)
  mono-xs: 11px / regular (system labels)

Line heights:
  Mono: 1.2-1.3 (tight)
  Sans: 1.5 (readable)
```

---

## Spacing Tokens

```
Micro-grid: 4px base unit

Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144

Usage:
  Card padding: 24px
  Card gap: 16px
  Section margins: 64-96px
  Button height: 48px
  Input height: 48px
  Icon size: 24px
  Touch targets: minimum 44px
```

---

## Shadow Tokens

```
z1 (cards):
  0px 1px 3px rgba(0,0,0,0.04)
  0px 3px 12px rgba(0,0,0,0.05)

z2 (floating action bar):
  0px 2px 6px rgba(0,0,0,0.05)
  0px 6px 24px rgba(0,0,0,0.06)

z3 (modals/sheets):
  0px 4px 10px rgba(0,0,0,0.06)
  0px 10px 32px rgba(0,0,0,0.08)

z4 (calendar overlay):
  0px 6px 14px rgba(0,0,0,0.08)
  0px 14px 48px rgba(0,0,0,0.10)
```

---

## Radius Tokens

```
radius-sm: 8px (chips, small buttons)
radius-md: 12px (inputs, controls)
radius-lg: 16px (cards, modals)
```

---

## V1 Feature Scope (MVP)

### INCLUDE:
✓ Today/Yesterday/Tomorrow navigation
✓ Calendar modal for date jumping
✓ Add tasks with progress slider
✓ Mark tasks complete (any %)
✓ Add notes (plain text)
✓ Timer interface with presets
✓ Background timer execution
✓ Auto-log sessions to timeline
✓ Link sessions to tasks (optional)
✓ Standalone sessions
✓ Chronological timeline view
✓ Edit/delete tasks and notes
✓ SQLite local storage

### SKIP FOR V1:
✗ Image attachments
✗ Transcription
✗ Search functionality
✗ Cloud sync
✗ Export features
✗ AI integrations
✗ Notifications (beyond active timer)
✗ Multi-device sync
✗ Analytics dashboard

---

## User Flow Examples

### Flow 1: Starting a Day
1. Open app → lands on TODAY
2. See empty timeline or previous entries
3. Tap `[+ TASK]` → create "Deep study session"
4. Set progress to 0%, save
5. Tap `[+ NOTE]` → jot down "Goal: finish chapter 3"
6. Navigate to Timer tab
7. Enter session name, set 60 min, link to "Deep study" task
8. Start timer → returns to timeline (timer badge on tab)
9. Work for 60 minutes
10. Timer completes → tap checkmark
11. Session auto-logs to timeline under task
12. Update task progress slider to 40%

### Flow 2: Planning Tomorrow
1. Navigate to TOMORROW
2. See empty timeline
3. Add task: "Client meeting prep"
4. Add note: "Review Q4 numbers, prepare deck"
5. Navigate back to TODAY
6. Tomorrow tasks visible via navigation, not mixed with today

### Flow 3: Reviewing Yesterday
1. Navigate to YESTERDAY
2. Scroll timeline, see completed tasks
3. Review session logs (how much time spent)
4. Note patterns (e.g., 3 deep work sessions logged)
5. Read-only view (no edits to past)

### Flow 4: Calendar Jump
1. Tap calendar icon (top-right)
2. Modal opens, shows January 2026
3. Days with dots indicate activity
4. Tap Jan 15 → modal closes
5. Timeline loads Jan 15 entries
6. Can navigate back via YESTERDAY/TODAY or use calendar again

---

## Design Consistency Checklist

Every screen/component should embody:
- [ ] Orthogonal grid alignment
- [ ] Monospaced type for system data
- [ ] Sans-serif for human content
- [ ] Neutral color palette (white, grays, single accent)
- [ ] Soft shadows for depth
- [ ] No decorative borders
- [ ] Exaggerated vertical spacing
- [ ] Geometric precision in icons/shapes
- [ ] Instrumental/console aesthetic
- [ ] High readability, low visual noise

---

## Success Metrics (Personal Use)

Since this is built for daily personal use, success = sustained habit formation:
- Daily open rate (do you actually use it every day?)
- Entry diversity (using all three entry types regularly?)
- Session completion rate (starting vs. finishing timers)
- Timeline review frequency (checking yesterday/past days)
- Task progress accuracy (slider reflects reality)

---

## Future Iteration Ideas (Post-V1)

- **Week view** - aggregate timeline across 7 days
- **Habit tracking** - recurring tasks, streak counters
- **Session analytics** - total focus time, productivity patterns
- **Tags/categories** - group related tasks across days
- **Templates** - quick-start task/note bundles
- **Cloud backup** - SQLite export to personal cloud storage
- **Markdown rendering** - rich text in notes
- **Pomodoro mode** - structured 25/5 session cycles
- **Dark mode** - inverted color scheme for night use
- **Widget support** - quick add from home screen

---

**End of Specification**

This document defines the complete V1 scope, design language, and technical foundation. Ready for implementation with Expo + SQLite following the industrial minimalism aesthetic.