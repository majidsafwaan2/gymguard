import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Platform, ActivityIndicator, LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Disable specific error/warning messages
LogBox.ignoreLogs([
  'PoseAnalyzer',
  'Property \'PoseAnalyzer\' doesn\'t exist',
  'Error initializing pose analyzer',
]);

// Optionally ignore all LogBox warnings (not recommended for debugging)
// LogBox.ignoreAllLogs();

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
import PTBuddyScreen from './src/screens/PTBuddyScreen';
import PainTrackingScreen from './src/screens/PainTrackingScreen';
import WorkoutPlansScreen from './src/screens/WorkoutPlansScreen';
import SocialScreen from './src/screens/SocialScreen';
import WorkoutTimerScreen from './src/screens/WorkoutTimerScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import DoctorDashboardScreen from './src/screens/DoctorDashboardScreen';
import DoctorPatientsScreen from './src/screens/DoctorPatientsScreen';
import DoctorInboxScreen from './src/screens/DoctorInboxScreen';
import DoctorPainFormsScreen from './src/screens/DoctorPainFormsScreen';
import SendPainFormScreen from './src/screens/SendPainFormScreen';
import WorkoutAssignmentScreen from './src/screens/WorkoutAssignmentScreen';
import DoctorProgressScreen from './src/screens/DoctorProgressScreen';
import DoctorAssignedWorkoutsScreen from './src/screens/DoctorAssignedWorkoutsScreen';
import AssignedWorkoutTrackingScreen from './src/screens/AssignedWorkoutTrackingScreen';
import ViewRecordsScreen from './src/screens/ViewRecordsScreen';
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
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#333333',
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
        name="PTBuddy" 
        component={PTBuddyScreen}
        options={{ title: 'Dr. Recovery' }}
      />
      <Stack.Screen 
        name="PainTracking" 
        component={PainTrackingScreen}
        options={{ title: 'Pain Tracker' }}
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

// Patient Tabs
function PatientTabs() {
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
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
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
      />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Community" component={SocialScreen} />
    </Tab.Navigator>
  );
}

// Doctor Tabs
function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          paddingTop: Platform.OS === 'ios' ? 5 : 3,
          paddingBottom: Platform.OS === 'ios' ? 5 : 3,
          height: Platform.OS === 'ios' ? 60 : 50,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DoctorDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Patients" 
        component={DoctorPatientsScreen}
        options={{ title: 'Patients' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator with Profile Screen
function MainApp() {
  const { userProfile } = useUser();
  const isDoctor = userProfile?.userType === 'doctor';
  
  // Debug logging
  console.log('MainApp rendering - userType:', userProfile?.userType, 'isDoctor:', isDoctor);
  
  // If userProfile is not loaded yet, show loading
  if (!userProfile || !userProfile.userType) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      key={userProfile.userType} // Force remount when userType changes
    >
      <Stack.Screen 
        name="MainTabs" 
        component={isDoctor ? DoctorTabs : PatientTabs} 
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="DoctorInbox" 
        component={DoctorInboxScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="DoctorPainForms" 
        component={DoctorPainFormsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="SendPainForm" 
        component={SendPainFormScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="WorkoutAssignment" 
        component={WorkoutAssignmentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="DoctorProgress" 
        component={DoctorProgressScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="DoctorAssignedWorkouts" 
        component={DoctorAssignedWorkoutsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="AssignedWorkoutTracking" 
        component={AssignedWorkoutTrackingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ViewRecords" 
        component={ViewRecordsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="WorkoutTimer" 
        component={WorkoutTimerScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Component to conditionally show chatbot only when logged in
function ConditionalChatbot() {
  const { user } = useUser();
  
  // Only show chatbot if user is logged in
  if (!user) {
    return null;
  }
  
  return <FloatingChatbot />;
}

function AppNavigator() {
  const { user, userProfile, loading } = useUser();

  // Debug logging
  console.log('AppNavigator - loading:', loading, 'user:', !!user, 'userProfile:', userProfile?.userType, 'surveyCompleted:', userProfile?.surveyCompleted);

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

  // If user is authenticated but hasn't completed survey, show survey (both patients and doctors)
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
              <StatusBar style="dark" backgroundColor="#ffffff" />
              <AppNavigator />
              <ConditionalChatbot />
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
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333333',
    fontSize: 16,
    marginTop: 10,
  },
});