# React Native Development Setup Guide

## Prerequisites for Mobile Development

### 1. Install Android Studio (for Android development)
- Download from: https://developer.android.com/studio
- Install Android SDK and emulator
- Add to PATH: Android SDK platform-tools

### 2. Install React Native CLI
```bash
npm install -g @react-native-community/cli
```

### 3. Setup Android Environment Variables
Add to your Windows Environment Variables:
- ANDROID_HOME: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
- Add to PATH: %ANDROID_HOME%\platform-tools
- Add to PATH: %ANDROID_HOME%\tools

### 4. For iOS Development (requires macOS)
- Install Xcode from Mac App Store
- Install CocoaPods: `sudo gem install cocoapods`

## Running the Mobile App

### Android:
```bash
cd mobile-app
npm start
# In another terminal:
npx react-native run-android
```

### iOS (macOS only):
```bash
cd mobile-app
cd ios && pod install && cd ..
npx react-native run-ios
```
