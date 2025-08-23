import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:go_router/go_router.dart';

import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/exercise_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'services/auth_service.dart';
import 'services/pose_detection_service.dart';
import 'services/exercise_service.dart';
import 'utils/theme.dart';
import 'utils/constants.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  
  runApp(const TeenFitnessApp());
}

class TeenFitnessApp extends StatelessWidget {
  const TeenFitnessApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => PoseDetectionService()),
        ChangeNotifierProvider(create: (_) => ExerciseService()),
      ],
      child: MaterialApp.router(
        title: 'Teen Fitness App',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: _router,
        localizationsDelegates: AppConstants.localizationsDelegates,
        supportedLocales: AppConstants.supportedLocales,
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/exercise/:id',
      builder: (context, state) {
        final exerciseId = state.pathParameters['id']!;
        return ExerciseScreen(exerciseId: exerciseId);
      },
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
  ],
  redirect: (context, state) {
    final authService = Provider.of<AuthService>(context, listen: false);
    final isLoggedIn = authService.isLoggedIn;
    final isOnAuthPage = state.matchedLocation == '/login' || 
                        state.matchedLocation == '/register';
    
    if (!isLoggedIn && !isOnAuthPage) {
      return '/login';
    }
    
    if (isLoggedIn && isOnAuthPage) {
      return '/home';
    }
    
    return null;
  },
);
