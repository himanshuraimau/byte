# Byte Mobile App

A React Native mobile application for productivity tracking, featuring TaskSet management (habit tracking), Daily Journal (Notes), and Sessions tracking. Built with Expo and integrated with the Next.js API backend.

## Features

### 🎯 TaskSets & Habits
- Create weekly or monthly task sets
- Track daily completion with visual grid
- Streak tracking for consistency
- Dashboard view of all active task sets

### 📝 Daily Journal
- Dedicated journal page (not a modal)
- Create, edit, and delete journal entries
- Date-based filtering and organization
- Full-screen writing experience

### ⏱️ Sessions
- Track focused work sessions
- Log duration, start/end times
- Session status management

### 📊 Timeline
- Unified chronological view of all entries
- Filter by date
- Quick actions to add tasks, notes, or sessions
- Visual cards for each entry type

### 🎨 Design
- Matches web app theme and fonts
- Industrial Minimalist aesthetic
- Dark/light theme support
- Consistent UI/UX with web version

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router
- **Backend**: Next.js API (`byte-web`)
- **Styling**: React Native Styles (matching web CSS variables)
- **Font**: GeistMono (closest match to Geist Pixel Square)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Running Next.js backend (`byte-web`)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Project Structure

```
byte/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Timeline
│   │   ├── habits.tsx     # TaskSets
│   │   ├── journal.tsx    # Journal
│   │   └── timer.tsx      # Timer
│   ├── notes/             # Journal pages
│   └── tasksets/          # TaskSet management pages
├── src/
│   ├── components/        # React components
│   │   ├── ui/            # Base UI components
│   │   ├── timeline/       # Timeline components
│   │   ├── tasksets/      # TaskSet components
│   │   └── timer/         # Timer components
│   ├── services/          # API services
│   │   ├── ApiClient.ts   # Base API client
│   │   ├── TaskSetService.ts
│   │   └── TimelineService.ts
│   ├── hooks/             # Custom React hooks
│   ├── constants/         # Theme and config
│   ├── context/           # React Context providers
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── constants/             # Theme constants
```

## Key Features

### API Integration

- **TaskSetService**: Manages TaskSets and DailyStates
- **TimelineService**: Manages entries (tasks, notes, sessions)
- **ApiClient**: Base client with authentication handling

### Components

- **TaskSetCard**: Display TaskSet with grid and streak
- **TaskGrid**: Visual grid for task completion
- **TaskCheckbox**: Individual task checkbox
- **StreakIndicator**: Streak display
- **NoteCard**: Journal entry card
- **TaskCard**: Task entry card
- **SessionCard**: Session entry card

### Theme

- Matches web app colors exactly
- Uses CSS variable equivalents
- GeistMono font (closest to Geist Pixel Square)
- Dark/light theme support

## API Integration

The mobile app uses the Next.js API backend (`byte-web`). Ensure the backend is running before using the mobile app.

### Endpoints Used

- `/api/auth/login` - User authentication
- `/api/tasksets` - TaskSet CRUD operations
- `/api/daily-state/[tasksetId]/[date]` - Daily state updates
- `/api/entries` - Entry CRUD operations

## Development

### Code Organization

- Feature-based component organization
- Shared services for API calls
- Consistent styling with web app
- Type-safe with TypeScript

### Adding New Features

1. Create components in appropriate feature folder
2. Add API calls to services
3. Use shared UI components
4. Follow existing patterns for consistency
5. Match web app design and flow

## Build & Deploy

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Design Consistency

The mobile app maintains feature parity and design consistency with the web app:

- ✅ Same theme colors
- ✅ Same fonts (GeistMono)
- ✅ Same UI patterns
- ✅ Same user flows
- ✅ Same API endpoints

## License

Private project
