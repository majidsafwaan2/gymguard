import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
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
import FloatingChatbot from './src/components/FloatingChatbot';

// Import context
import { WorkoutProvider } from './src/context/WorkoutContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
    </Stack.Navigator>
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
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutStack} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
    </Tab.Navigator>
  );
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
    <WorkoutProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1a1a1a" />
        <MainTabs />
        <FloatingChatbot />
      </NavigationContainer>
    </WorkoutProvider>
  );
}