import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import FitnessSurveyScreen from './src/screens/FitnessSurveyScreen';
import WorkoutListScreen from './src/screens/WorkoutListScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import CameraAnalysisScreen from './src/screens/CameraAnalysisScreen';
import AnalysisResultsScreen from './src/screens/AnalysisResultsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import GymBuddyScreen from './src/screens/GymBuddyScreen';
import NutritionScreen from './src/screens/NutritionScreen';
import WorkoutPlansScreen from './src/screens/WorkoutPlansScreen';
import SocialScreen from './src/screens/SocialScreen';
import WorkoutTimerScreen from './src/screens/WorkoutTimerScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import FloatingChatbot from './src/components/FloatingChatbot';

// Import context
import { WorkoutProvider } from './src/context/WorkoutContext';
import { UserProvider, useUser } from './src/context/UserContext';
import { CommunityProvider } from './src/context/CommunityContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function WorkoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="WorkoutList" 
        component={WorkoutListScreen}
        options={{ title: 'Select Your Workout' }}
      />
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ title: 'Exercise Details' }}
      />
      <Stack.Screen 
        name="CameraAnalysis" 
        component={CameraAnalysisScreen}
        options={{ title: 'Form Analysis', headerShown: false }}
      />
      <Stack.Screen 
        name="AnalysisResults" 
        component={AnalysisResultsScreen}
        options={{ title: 'Analysis Results' }}
      />
      <Stack.Screen 
        name="GymBuddy" 
        component={GymBuddyScreen}
        options={{ title: 'AI Gym Buddy' }}
      />
      <Stack.Screen 
        name="Nutrition" 
        component={NutritionScreen}
        options={{ title: 'Nutrition Tracker' }}
      />
      <Stack.Screen 
        name="WorkoutPlans" 
        component={WorkoutPlansScreen}
        options={{ title: 'Workout Plans' }}
      />
      <Stack.Screen 
        name="Social" 
        component={SocialScreen}
        options={{ title: 'Community' }}
      />
      <Stack.Screen 
        name="WorkoutTimer" 
        component={WorkoutTimerScreen}
        options={{ title: 'Workout Timer' }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="FitnessSurvey" component={FitnessSurveyScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'nutrition' : 'nutrition-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#666666',
            tabBarStyle: {
              backgroundColor: '#1a1a1a',
              borderTopColor: '#333333',
              paddingTop: Platform.OS === 'ios' ? 5 : 3,
              paddingBottom: Platform.OS === 'ios' ? 5 : 3,
              height: Platform.OS === 'ios' ? 60 : 50,
            },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutStack}
        listeners={{
          tabPress: (e) => {
            // Allow normal navigation for Workouts tab
          }
        }}
      />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator with Profile Screen
function MainApp() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { user, userProfile, loading } = useUser();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user is not authenticated, show auth screens
  if (!user) {
    return <AuthStackNavigator />;
  }

  // If user is authenticated but hasn't completed survey, show survey
  if (user && !userProfile?.surveyCompleted) {
    return <FitnessSurveyScreen />;
  }

  // If user is authenticated and completed survey, show main app
  return <MainApp />;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen duration
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <UserProvider>
      <CommunityProvider>
        <WorkoutProvider>
          <View style={styles.container}>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor="#1a1a1a" />
              <AppNavigator />
              <FloatingChatbot />
            </NavigationContainer>
          </View>
        </WorkoutProvider>
      </CommunityProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
});