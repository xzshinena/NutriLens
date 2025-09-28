# NutriLens

A kid-friendly React Native app that scans grocery product barcodes and highlights ingredients that conflict with dietary settings.

## Features

- **Barcode Scanning**: Use device camera to scan product barcodes
- **Dietary Analysis**: AI-powered ingredient analysis with color-coded results
- **Kid-Friendly UI**: Simple, accessible design with owl mascot
- **Dietary Settings**: Customizable food restrictions (dairy, gluten, meat, nuts, soy)
- **Product History**: Save and review previously scanned products
- **Search**: Find products by name or brand

## Design System

### Colors (5-color limit)
- **Primary Green**: `#36C090` (safe ingredients)
- **Warning Yellow**: `#F5C746` (caution ingredients)  
- **Alert Red**: `#F35B5B` (avoid ingredients)
- **Neutral Background**: `#F7F7FA` (background)
- **Accent Blue**: `#5B8CFF` (links/mascot accents)

### Typography
- **Font**: Nunito (rounded sans serif)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on device/simulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

### Permissions
- **Camera**: Required for barcode scanning
- **Storage**: Used for saving user settings and scan history

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── OwlMascot.tsx    # Animated owl mascot with moods
│   ├── VerdictBadge.tsx # Product safety status badge
│   ├── IngredientChip.tsx # Color-coded ingredient chips
│   └── ...
├── screens/             # Main app screens
│   ├── HomeScreen.tsx   # Product details and verdict
│   ├── SearchScreen.tsx # Product search
│   ├── ScanScreen.tsx   # Barcode scanning
│   ├── HistoryScreen.tsx # Scan history
│   └── SettingsScreen.tsx # Dietary preferences
├── context/             # React Context for state management
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and business logic
│   ├── colors.ts        # Design system colors
│   ├── typography.ts    # Font system
│   ├── verdict.ts       # Ingredient analysis engine
│   └── mockData.ts      # Sample product data
└── types/               # TypeScript type definitions
```

## Key Components

### OwlMascot
Animated owl character that changes mood based on product verdict:
- **Happy**: Green verdict (safe)
- **Concerned**: Yellow verdict (caution)
- **Warning**: Red verdict (avoid)

### Verdict Engine
Analyzes product ingredients against user dietary settings:
- **Safe**: No conflicting ingredients
- **Caution**: Potential allergens or unclear ingredients
- **Avoid**: Contains restricted ingredients

### Mock Data
Includes 12 realistic sample products with various dietary restrictions for testing.

## Development Notes

- Uses React Navigation for bottom tab navigation
- AsyncStorage for data persistence
- Expo Barcode Scanner for camera functionality
- TypeScript for type safety
- Accessible design with proper contrast and touch targets

## Testing

The app includes mock product data for testing. Try scanning these barcodes:
- `1234567890123` - Organic Whole Milk (contains dairy)
- `2345678901234` - Gluten-Free Bread (safe)
- `3456789012345` - Chocolate Chip Cookies (contains gluten, dairy)

## License

MIT License