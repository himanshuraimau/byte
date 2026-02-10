# Byte Mobile App

A React Native mobile application for productivity tracking, featuring TaskSet management (habit tracking), Daily Journal (Notes), and Sessions tracking. Built with Expo and integrated with the Next.js API backend.

## Quick Start

```bash
# Install dependencies
bun install

# Configure API endpoint
echo "EXPO_PUBLIC_API_URL=http://localhost:3000" > .env

# Build Android APK
npx expo prebuild
cd android && ./gradlew assembleDebug

# Install on device
adb install app/build/outputs/apk/debug/app-debug.apk
```

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
### Prerequisites

- Node.js 18+
- Bun or npm package manager
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Running Next.js backend (`byte-web`)
- For Android builds: Android Studio with SDK tools
- For Android builds: JDK 17+

### Installation

1. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```
   ⚠️ **Important**: Update this URL to point to your backend server

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
│   │   ├── notes.tsx      # Journal
│   │   ├── profile.tsx    # Profile
│   │   └── timer.tsx      # Timer
│   ├── notes/             # Journal pages
│   │   ├── new.tsx        # Create journal entry
│   │   └── [id].tsx       # View/edit entry
│   └── tasksets/          # TaskSet management pages
│       ├── new.tsx        # Create task set
│       └── [id]/edit.tsx  # Edit task set
├── src/
│   ├── components/        # React components
│   │   ├── ui/            # Base UI components
│   │   ├── timeline/      # Timeline components
│   │   ├── tasksets/      # TaskSet components
│   │   ├── calendar/      # Calendar components
│   │   ├── modals/        # Modal components
│   │   └── timer/         # Timer components
│   ├── services/          # API services
│   │   └── api.ts         # API client (auth, entries, tasksets, dailyState)
│   ├── database/          # Data layer
│   │   ├── db.ts          # Database utilities
│   │   └── repositories/  # Repository classes (User, Note, Task, Session, Day)
│   ├── hooks/             # Custom React hooks
│   ├── constants/         # Theme and config
│   ├── context/           # React Context providers
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── constants/             # Theme constants
└── android/               # Native Android code (generated)
```

## Key Features

### API Integration

The app uses a clean repository pattern with API client:

- **API Client** (`/src/services/api.ts`): Central HTTP client
  - `authAPI`: Login, register, logout, get user
  - `entriesAPI`: CRUD for notes, tasks, sessions
  - `taskSetsAPI`: Manage task sets
  - `dailyStateAPI`: Track daily completions
  
- **Repositories** (`/src/database/repositories/`):
  - `UserRepository`: User authentication and profile
  - `NoteRepository`: Journal entries via API
  - `TaskRepository`: Task entries via API
  - `SessionRepository`: Session tracking via API
  - `DayRepository`: Virtual day management

### Components

- **TaskSetCard**: Display TaskSet with grid and streak
- **TaskGrid**: Visual grid for task completion
- **TaskCheckbox**: Individual task checkbox
- **StreakIndicator**: Streak display
- **NoteCard**: Journal entry card
- **TaskCard**: Task entry card
- **SessionCard**: Session entry card
- **CalendarGrid**: Date picker and navigation
- **Timeline**: Unified entry view

### Theme

- Matches web app colors exactly
- Uses CSS variable equivalents
- GeistMono font (closest to Geist Pixel Square)
- Dark/light theme support

## API Integration

The mobile app uses the Next.js API backend (`byte-web`) for all data operations. **Firebase has been removed** - all database operations go through HTTP requests to the backend.

### Backend Architecture

- **Authentication**: Session-based using Base64 encoded credentials
- **Database**: MongoDB via Next.js API
- **API Client**: `/src/services/api.ts` handles all HTTP requests

### Endpoints Used

#### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Entries (Notes, Tasks, Sessions)
- `GET /api/entries?date={date}&type={type}` - List entries
- `POST /api/entries` - Create entry
- `GET /api/entries/[id]` - Get single entry
- `PATCH /api/entries/[id]` - Update entry
- `DELETE /api/entries/[id]` - Delete entry

#### Task Sets
- `GET /api/tasksets` - List all task sets
- `POST /api/tasksets` - Create task set
- `GET /api/tasksets/[id]` - Get single task set
- `PUT /api/tasksets/[id]` - Update task set

#### Daily State
- `GET /api/daily-state/[tasksetId]/[date]` - Get daily state
- `POST /api/daily-state/[tasksetId]/[date]` - Update task completion
- `GET /api/daily-state/[tasksetId]/streak` - Get streak info

### Repository Layer

All database operations are routed through repository classes that use the API client:

- **UserRepository** → Uses `/api/auth/*`
- **NoteRepository** → Uses `/api/entries?type=NOTE`
- **TaskRepository** → Uses `/api/entries?type=TASK`
- **SessionRepository** → Uses `/api/entries?type=SESSION`
- **DayRepository** → Virtual (days implicit from entries)

### Session Management

Authentication is handled via session cookies:
1. Login/Register returns a session token
2. Token is stored and sent with subsequent requests
3. Backend validates token on protected routes

See [API_INTEGRATION.md](../API_INTEGRATION.md) for complete API documentation.

### Architecture Changes

**Previous Architecture (Removed):**
- ❌ Firebase Firestore for database
- ❌ Direct Firebase SDK calls
- ❌ Client-side data storage

**Current Architecture:**
- ✅ Next.js backend API
- ✅ MongoDB database (via backend)
- ✅ RESTful HTTP requests
- ✅ Repository pattern for data access
- ✅ Centralized API client with session management
- ✅ Type-safe TypeScript throughout

This change provides better control, security, and consistency with the web application.

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

### Local Android Build

#### Prerequisites
- Android Studio installed with SDK tools
- Java Development Kit (JDK) 17 or higher
- Android SDK Build-Tools 36.0.0
- Android NDK 27.1.12297006

#### Build Steps

1. **Install Dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   # or your backend server URL
   ```

3. **Clean Prebuild** (generates native Android/iOS directories)
   ```bash
   # Remove existing native directories
   rm -rf android ios
   
   # Run Expo prebuild to generate fresh native code
   npx expo prebuild
   ```

4. **Build Android APK**
   
   **Debug Build:**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   Output: `android/app/build/outputs/apk/debug/app-debug.apk`
   
   **Release Build:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   Output: `android/app/build/outputs/apk/release/app-release.apk`
   
   **Clean Build:**
   ```bash
   cd android
   ./gradlew clean build
   ```

5. **Install APK on Device/Emulator**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Troubleshooting Build Issues

**If you encounter build errors:**

1. **Clean everything and rebuild**
   ```bash
   # From project root
   rm -rf android ios node_modules
   bun install
   npx expo prebuild
   cd android && ./gradlew clean assembleDebug
   ```

2. **Check Gradle daemon status**
   ```bash
   cd android
   ./gradlew --status
   ```

3. **Stop all Gradle daemons**
   ```bash
   cd android
   ./gradlew --stop
   ```

4. **Verify Android SDK paths**
   Make sure `local.properties` exists in the `android/` directory with correct SDK path

### EAS Build (Cloud Build)

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Build Configuration

- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 36
- **Compile SDK**: 36
- **Build Tools**: 36.0.0
- **NDK**: 27.1.12297006
- **Kotlin**: 2.1.20
- **React Native**: 0.81.5

### Included Expo Modules

- expo-constants (18.0.13)
- expo-modules-core (3.0.29)
- expo-asset (12.0.12)
- expo-blur (15.0.8)
- expo-file-system (19.0.21)
- expo-font (14.0.10)
- expo-haptics (15.0.8)
- expo-image (3.0.11)
- expo-keep-awake (15.0.8)
- expo-linear-gradient (15.0.8)
- expo-linking (8.0.11)
- expo-secure-store (15.0.8)
- expo-splash-screen (31.0.13)
- expo-system-ui (6.0.9)
- expo-web-browser (15.0.10)

## Design Consistency

The mobile app maintains feature parity and design consistency with the web app:

- ✅ Same theme colors
- ✅ Same fonts (GeistMono)
- ✅ Same UI patterns
- ✅ Same user flows
- ✅ Same API endpoints

## License

Private project
