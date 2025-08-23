import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class AppConstants {
  // App information
  static const String appName = 'Teen Fitness App';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'Safe exercise with AI-powered form analysis';
  
  // Localization
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = [
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ];
  
  static const List<Locale> supportedLocales = [
    Locale('en', 'US'), // English
    Locale('es', 'ES'), // Spanish
    Locale('fr', 'FR'), // French
    Locale('de', 'DE'), // German
    Locale('pt', 'BR'), // Portuguese
    Locale('it', 'IT'), // Italian
    Locale('ja', 'JP'), // Japanese
    Locale('ko', 'KR'), // Korean
    Locale('zh', 'CN'), // Chinese Simplified
    Locale('ar', 'SA'), // Arabic
  ];
  
  // Default locale
  static const Locale defaultLocale = Locale('en', 'US');
  
  // API endpoints
  static const String baseUrl = 'https://api.teenfitness.app';
  static const String apiVersion = '/v1';
  static const Duration apiTimeout = Duration(seconds: 30);
  
  // Exercise categories
  static const List<String> exerciseCategories = [
    'Strength',
    'Cardio',
    'Flexibility',
    'Balance',
    'Plyometric',
    'Mobility',
    'Warm Up',
    'Cool Down',
  ];
  
  // Fitness levels
  static const List<String> fitnessLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Athlete',
  ];
  
  // User types
  static const List<String> userTypes = [
    'Teen',
    'Parent',
    'Coach',
    'Guardian',
  ];
  
  // Fitness goals
  static const List<String> fitnessGoals = [
    'Build Strength',
    'Improve Endurance',
    'Increase Flexibility',
    'Better Balance',
    'Weight Loss',
    'Muscle Gain',
    'Sports Performance',
    'General Fitness',
    'Injury Prevention',
    'Rehabilitation',
  ];
  
  // Equipment types
  static const List<String> equipmentTypes = [
    'Bodyweight',
    'Dumbbells',
    'Resistance Bands',
    'Barbell',
    'Kettlebell',
    'Medicine Ball',
    'Stability Ball',
    'Foam Roller',
    'Pull-up Bar',
    'Bench',
    'None Required',
  ];
  
  // Target muscles
  static const List<String> targetMuscles = [
    'Quadriceps',
    'Hamstrings',
    'Glutes',
    'Calves',
    'Chest',
    'Back',
    'Shoulders',
    'Biceps',
    'Triceps',
    'Core',
    'Neck',
    'Forearms',
  ];
  
  // Exercise types
  static const List<String> exerciseTypes = [
    'Compound',
    'Isolation',
    'Bodyweight',
    'Weighted',
    'Dynamic',
    'Static',
  ];
  
  // Difficulty levels
  static const List<String> difficultyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
  ];
  
  // Form feedback types
  static const List<String> feedbackTypes = [
    'Joint Angle',
    'Alignment',
    'Movement',
    'Safety',
    'General',
  ];
  
  // Feedback severity levels
  static const List<String> feedbackSeverities = [
    'Info',
    'Warning',
    'Critical',
  ];
  
  // Form status levels
  static const List<String> formStatuses = [
    'Analyzing',
    'Good',
    'Needs Improvement',
    'Poor',
    'Dangerous',
  ];
  
  // Workout durations (in minutes)
  static const List<int> workoutDurations = [
    15,
    20,
    30,
    45,
    60,
    75,
    90,
  ];
  
  // Rest periods (in minutes)
  static const List<int> restPeriods = [
    1,
    2,
    3,
    5,
    10,
    15,
  ];
  
  // Rep ranges
  static const List<String> repRanges = [
    '1-3 (Max Strength)',
    '3-5 (Strength)',
    '5-8 (Strength & Hypertrophy)',
    '8-12 (Hypertrophy)',
    '12-15 (Muscle Endurance)',
    '15+ (Endurance)',
  ];
  
  // Set ranges
  static const List<int> setRanges = [
    1,
    2,
    3,
    4,
    5,
    6,
  ];
  
  // Warm-up durations (in minutes)
  static const List<int> warmUpDurations = [
    5,
    10,
    15,
    20,
  ];
  
  // Cool-down durations (in minutes)
  static const List<int> coolDownDurations = [
    5,
    10,
    15,
    20,
  ];
  
  // Achievement types
  static const List<String> achievementTypes = [
    'First Workout',
    'Perfect Form',
    'Consistency',
    'Strength Gain',
    'Endurance',
    'Flexibility',
    'Balance',
    'Social',
    'Safety',
    'Progress',
  ];
  
  // Notification types
  static const List<String> notificationTypes = [
    'Workout Reminder',
    'Form Feedback',
    'Achievement Unlocked',
    'Progress Update',
    'Safety Alert',
    'Rest Day Reminder',
    'Warm-up Reminder',
    'Social',
  ];
  
  // Privacy settings
  static const List<String> privacySettings = [
    'Public',
    'Friends Only',
    'Private',
    'Parents Only',
    'Coaches Only',
  ];
  
  // Data retention periods (in days)
  static const Map<String, int> dataRetentionPeriods = {
    'Workout History': 365,
    'Form Analysis': 90,
    'Progress Photos': 730,
    'Personal Data': 2555, // 7 years for minors
    'Analytics': 90,
  };
  
  // Maximum values
  static const int maxWorkoutsPerDay = 3;
  static const int maxExercisesPerWorkout = 20;
  static const int maxSetsPerExercise = 10;
  static const int maxRepsPerSet = 100;
  static const int maxWorkoutDuration = 180; // minutes
  static const int maxRestPeriod = 60; // minutes
  
  // Minimum values
  static const int minWorkoutDuration = 10; // minutes
  static const int minRestPeriod = 1; // minutes
  static const int minRepsPerSet = 1;
  static const int minSetsPerExercise = 1;
  
  // Default values
  static const int defaultWorkoutDuration = 45; // minutes
  static const int defaultRestPeriod = 2; // minutes
  static const int defaultRepsPerSet = 10;
  static const int defaultSetsPerExercise = 3;
  static const int defaultWarmUpDuration = 10; // minutes
  static const int defaultCoolDownDuration = 10; // minutes
  
  // Thresholds
  static const double minFormScore = 0.6;
  static const double goodFormScore = 0.8;
  static const double excellentFormScore = 0.9;
  static const double criticalFormScore = 0.4;
  
  static const int minAge = 13;
  static const int maxAge = 19;
  
  static const double minWeight = 30.0; // kg
  static const double maxWeight = 200.0; // kg
  
  static const double minHeight = 120.0; // cm
  static const double maxHeight = 220.0; // cm
  
  // Animation durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
  
  // Debounce delays
  static const Duration searchDebounce = Duration(milliseconds: 300);
  static const Duration formSubmissionDebounce = Duration(milliseconds: 500);
  
  // Cache durations
  static const Duration exerciseCacheDuration = Duration(hours: 24);
  static const Duration userProfileCacheDuration = Duration(hours: 1);
  static const Duration workoutHistoryCacheDuration = Duration(hours: 6);
  
  // File size limits
  static const int maxProfileImageSize = 5 * 1024 * 1024; // 5MB
  static const int maxVideoSize = 100 * 1024 * 1024; // 100MB
  
  // Supported image formats
  static const List<String> supportedImageFormats = [
    'jpg',
    'jpeg',
    'png',
    'webp',
  ];
  
  // Supported video formats
  static const List<String> supportedVideoFormats = [
    'mp4',
    'mov',
    'avi',
    'mkv',
  ];
  
  // Error messages
  static const Map<String, String> errorMessages = {
    'network_error': 'Network connection error. Please check your internet connection.',
    'server_error': 'Server error. Please try again later.',
    'auth_error': 'Authentication error. Please log in again.',
    'permission_error': 'Permission denied. Please check your settings.',
    'camera_error': 'Camera error. Please check camera permissions.',
    'storage_error': 'Storage error. Please check available space.',
    'unknown_error': 'An unknown error occurred. Please try again.',
  };
  
  // Success messages
  static const Map<String, String> successMessages = {
    'workout_completed': 'Great job! Workout completed successfully.',
    'form_improved': 'Excellent! Your form is improving.',
    'goal_achieved': 'Congratulations! You achieved your goal.',
    'streak_extended': 'Awesome! You extended your workout streak.',
    'profile_updated': 'Profile updated successfully.',
    'settings_saved': 'Settings saved successfully.',
  };
  
  // Tips and advice
  static const List<String> workoutTips = [
    'Always warm up before exercising',
    'Focus on form over weight',
    'Breathe steadily throughout movements',
    'Stay hydrated during workouts',
    'Listen to your body and rest when needed',
    'Gradually increase intensity over time',
    'Include both strength and cardio exercises',
    'Don\'t skip cool-down stretches',
    'Maintain good posture throughout exercises',
    'Use proper equipment and safety gear',
  ];
  
  // Safety warnings
  static const List<String> safetyWarnings = [
    'Stop immediately if you feel pain',
    'Don\'t exercise if you\'re injured',
    'Consult a doctor before starting new exercises',
    'Use proper form to prevent injuries',
    'Don\'t lift weights that are too heavy',
    'Take breaks between intense workouts',
    'Stay within your fitness level',
    'Don\'t exercise on an empty stomach',
    'Avoid exercising in extreme temperatures',
    'Have a spotter for heavy lifts',
  ];
}
