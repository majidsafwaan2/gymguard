import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the main application component
registerRootComponent(App);

// Ensure TensorFlow.js is loaded
import '@tensorflow/tfjs-react-native';
import '@tensorflow/tfjs-platform-react-native';

export default App;


