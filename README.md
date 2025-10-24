# GymGuard - AI Gym Injury Prevention App

GymGuard is an AI-powered fitness app that uses computer vision to analyze workout form in real-time, helping users prevent injuries and improve their technique.

## Features

- **60+ Exercise Database**: Comprehensive library of common gym exercises with detailed form tips
- **AI Form Analysis**: Real-time pose detection and form analysis using TensorFlow.js MoveNet
- **Visual Feedback**: Pose skeleton overlay with real-time form corrections
- **Progress Tracking**: Track your form improvement over time with detailed analytics
- **Safety First**: Built-in safety tips and warnings for each exercise
- **Modern UI**: Clean, dark-themed interface optimized for mobile use

## Tech Stack

- **React Native** with Expo
- **TensorFlow.js** for AI pose detection
- **Expo Camera** for video capture
- **React Navigation** for screen navigation
- **React Native Chart Kit** for progress visualization
- **Expo Linear Gradient** for modern UI effects

## Installation

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn
   - Expo CLI (`npm install -g @expo/cli`)
   - iOS Simulator or Android Emulator (for testing)

2. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd fitnessapp
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
fitnessapp/
├── App.js                          # Main app component with navigation
├── src/
│   ├── screens/                    # All screen components
│   │   ├── SplashScreen.js         # App loading screen
│   │   ├── WorkoutListScreen.js    # Exercise selection
│   │   ├── WorkoutDetailScreen.js  # Exercise details and tips
│   │   ├── CameraAnalysisScreen.js # Camera and pose detection
│   │   ├── AnalysisResultsScreen.js # Form analysis results
│   │   └── ProgressScreen.js      # Progress tracking
│   ├── context/
│   │   └── WorkoutContext.js       # Global state management
│   ├── data/
│   │   └── workoutDatabase.js      # Exercise database
│   └── utils/
│       └── PoseDetector.js         # AI pose detection logic
├── package.json                    # Dependencies
├── app.json                       # Expo configuration
└── babel.config.js                # Babel configuration
```

## Key Components

### Pose Detection
- Uses TensorFlow.js MoveNet SinglePose Lightning model
- Detects 17 key body points in real-time
- Analyzes joint angles and alignment
- Provides form-specific feedback

### Exercise Database
- 60+ exercises with detailed information
- Difficulty levels (Beginner, Intermediate, Advanced)
- Target muscle groups
- Form tips and common mistakes
- Safety guidelines

### Form Analysis
- Compares user pose to ideal form templates
- Generates scores (0-100) based on technique
- Provides specific, actionable feedback
- Tracks improvement over time

## Usage

1. **Select Exercise**: Browse the exercise library and choose your workout
2. **Review Tips**: Read form tips and watch example videos
3. **Analyze Form**: Use the camera to record your form
4. **Get Feedback**: Receive detailed analysis with specific corrections
5. **Track Progress**: Monitor your improvement over time

## Safety Disclaimer

This app provides general form feedback and is not a replacement for professional training advice. Always consult with a qualified fitness professional before starting any new exercise program. Stop immediately if you experience pain or discomfort.

## Future Enhancements

- Voice feedback during exercises
- Community challenges and leaderboards
- Integration with fitness trackers
- Advanced biomechanical analysis
- Personalized workout recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


