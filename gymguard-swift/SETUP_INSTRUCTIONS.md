# Swift PoseNet Setup - READ THIS FIRST

## ✅ What You Get
A **REAL** pose tracker that follows your actual movements using Apple's Vision framework.

## 📋 Quick Setup (5 minutes)

### Step 1: Create Xcode Project
1. Open **Xcode**
2. File → New → Project
3. Choose **iOS** → **App**
4. Name: `GymGuardSwift`
5. Interface: **Storyboard** (or SwiftUI if preferred)
6. Language: **Swift**
7. Click **Next** and save

### Step 2: Add Camera Permission
1. Open `Info.plist`
2. Add this key:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access for pose tracking</string>
```

### Step 3: Copy Swift Code
1. Replace your default `ViewController.swift` with the provided `CameraViewController.swift`
2. Or create new file and copy the code

### Step 4: Setup Storyboard
1. Open `Main.storyboard`
2. Drag a **UIView** to fill the screen (camera preview)
3. Drag another **UIView** on top (pose overlay)
4. Set View Controller class to `CameraViewController`

### Step 5: Connect Outlets
1. Open **Assistant Editor** (split view)
2. Control-drag from `cameraView` to the camera preview
3. Control-drag from `poseOverlayView` to the overlay view

### Step 6: Run!
- Select your iPhone
- Build & Run
- Grant camera permissions
- **You now have REAL pose tracking!**

## 🎯 What It Does
- Uses **Vision framework** (Apple's native ML)
- Tracks **17 body keypoints** in real-time
- Shows skeleton overlay over camera feed
- Works on **any iPhone with A12 chip or later** (iPhone XS+)

## 📱 Requirements
- iOS 14.0+
- Xcode 12+
- Physical iPhone (pose detection needs real camera)

## 🔄 Keep Using React Native?
Your current Expo Go app can stay for all other features. Use the Swift app **just for pose tracking**, then integrate results back into your React Native app if needed.

