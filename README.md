# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
# GoBooks - Ebook Reader App

A modern ebook reader app built with React Native, Expo Router, and Supabase.

## Features

- 📚 Browse and read ebooks
- 🔍 Search functionality
- 📊 Reading progress tracking
- 🎨 AI-enhanced book versions
- 👤 User authentication
- 📱 Cross-platform (iOS, Android, Web)

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage for book files and covers
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gobooks
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the Supabase database:
   - Copy the SQL schema from `services/supabaseClient.ts`
   - Run it in your Supabase SQL editor
   - Enable Row Level Security (RLS) policies

6. Start the development server:
```bash
npx expo start
```

## Project Structure

```
gobooks/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   └── explore.tsx    # Library screen
│   ├── book-details.tsx   # Book details screen
│   ├── reader.tsx         # Reading screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── services/              # API and backend services
├── constants/             # App constants
├── hooks/                 # Custom hooks
└── assets/               # Images and other assets
```

## Database Schema

The app uses three main tables:

1. **profiles** - User profile information
2. **books** - Book metadata and file URLs
3. **user_books** - Reading progress and user-book relationships

## Assets Required

Add these image assets to `assets/images/`:

- `placeholder-book.png` - Default book cover placeholder
- `icon.png` - App icon
- `splash.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon

### Book Cover Images

For the dummy books, add these cover images:
- `one_dark_window_cover.jpg`
- `day_of_fallen_night_cover.jpg`
- `book_of_night_cover.jpg`
- `wolf_den_cover.jpg`

### PDF Files

Add sample PDF files:
- `one_dark_window.pdf`
- `day_of_fallen_night.pdf`
- `book_of_night.pdf`
- `wolf_den.pdf`

## Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `services/supabaseClient.ts`
3. Upload book covers to Supabase Storage
4. Upload PDF files to Supabase Storage
5. Update the `books` table with correct file URLs

## Features to Implement

- [ ] User authentication (Login/Signup)
- [ ] PDF reading functionality
- [ ] Offline reading
- [ ] Bookmarks and annotations
- [ ] Search within books
- [ ] Reading statistics
- [ ] Book recommendations
- [ ] Social features (reviews, ratings)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.