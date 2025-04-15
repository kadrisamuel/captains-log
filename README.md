# Captain's Log

A React Native mobile application for creating and viewing timestamped text logs. It should be possible to create the log text by voice.

## Features

- Create text log with timestamp
- Voice to text log creation
- View logs
- Search logs

## Screenshots

[Add screenshots of your app once you have a UI to show]

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development, Mac only)
- Android Studio (for Android development)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/kadrisamuel/captains-log.git
   cd captains-log
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Install iOS dependencies (Mac only)
   ```
   cd ios && pod install && cd ..
   ```

### Running the App

#### iOS (Mac only)
```
npx react-native run-ios
```

#### Android
```
npx react-native run-android
```

## Project Structure

```
captains-log/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/
│   ├── components/   # Reusable components
│   ├── screens/      # Screen components
│   ├── navigation/   # Navigation configurations
│   ├── services/     # API calls and other services
│   ├── utils/        # Utility functions
│   ├── assets/       # Images, fonts, etc.
│   └── App.js        # Entry point
└── [other config files]
```

## Technologies Used

- React Native
- Redux
- Jest

## Roadmap

- [Future feature or enhancement 1]
- [Future feature or enhancement 2]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [LICENSE_NAME] - see the LICENSE file for details.

## Acknowledgments

- [Credit any resources, tutorials, or inspiration]
