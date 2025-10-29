# GymGuard Flutter - Real PoseNet Tracking 🎯

A **working Flutter app** with **ACTUAL** pose detection using Google ML Kit MediaPipe.

## ✅ What Works
- **Real-time pose tracking** that follows your actual movements
- Tracks **33 key body points** (head, shoulders, elbows, wrists, hips, knees, ankles, fingers)
- Draws cyan skeleton overlay on camera feed
- Works on both **iOS and Android**

## 🚀 Run It Now

```bash
cd gymguard_flutter
flutter run
```

## 📱 What You'll See
1. Camera opens (front-facing)
2. You see yourself
3. **Cyan skeleton follows your every movement** in real-time
4. Keypoints: head, shoulders, elbows, wrists, hips, knees, ankles

## 🔧 How It Works
- Uses **Google ML Kit Pose Detection**
- BlazePose model (lightweight & fast)
- Processes camera frames at 30fps
- Draws skeleton with custom `CustomPaint`

## 📋 Requirements
- Flutter SDK 3.9+
- iOS 13+ or Android API 21+
- Physical device with camera

## 🎯 Why Flutter?
Flutter has **excellent ML support**:
- `google_mlkit_pose_detection` package
- Native performance
- Cross-platform (iOS + Android)
- Easy to integrate

## 📝 Files Created
- `lib/main.dart` - Full pose detection app
- Camera + MediaPipe integration
- Real-time skeleton rendering

## 🎬 Next Steps
1. Run `flutter run`
2. Grant camera permissions
3. **See real pose tracking!**

