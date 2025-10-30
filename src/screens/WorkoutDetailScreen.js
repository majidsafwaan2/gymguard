import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkoutContext } from '../context/WorkoutContext';

const { width } = Dimensions.get('window');

export default function WorkoutDetailScreen({ navigation }) {
  const { selectedWorkout } = useWorkoutContext();

  if (!selectedWorkout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No workout selected</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666666';
    }
  };

  const handleWatchVideo = () => {
    if (selectedWorkout.videoUrl) {
      Linking.openURL(selectedWorkout.videoUrl);
    }
  };

  const handleAnalyzeForm = () => {
    navigation.navigate('CameraAnalysis');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.workoutEmoji}>{selectedWorkout.thumbnail}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.workoutName}>{selectedWorkout.name}</Text>
            <View style={styles.difficultyContainer}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedWorkout.difficulty) }]}>
                <Text style={styles.difficultyText}>{selectedWorkout.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={styles.description}>{selectedWorkout.description}</Text>
        
        <View style={styles.muscleGroupsContainer}>
          <Text style={styles.sectionTitle}>Target Muscles</Text>
          <View style={styles.muscleGroups}>
            {selectedWorkout.targetMuscles.map((muscle, index) => (
              <View key={index} style={styles.muscleGroup}>
                <Text style={styles.muscleGroupText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Tips</Text>
          {selectedWorkout.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Mistakes</Text>
          {selectedWorkout.commonMistakes.map((mistake, index) => (
            <View key={index} style={styles.mistakeItem}>
              <Ionicons name="close-circle" size={16} color="#F44336" />
              <Text style={styles.mistakeText}>{mistake}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.safetyItem}>
            <Ionicons name="shield-checkmark" size={16} color="#00d4ff" />
            <Text style={styles.safetyText}>{selectedWorkout.safetyTips}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.videoButton}
            onPress={handleWatchVideo}
          >
            <View style={styles.buttonGradient}>
              <Ionicons name="play-circle" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Watch Example</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeForm}
          >
            <View style={styles.buttonGradient}>
              <Ionicons name="camera" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Analyze My Form</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  difficultyContainer: {
    alignSelf: 'flex-start',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
  },
  muscleGroupsContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  muscleGroup: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  muscleGroupText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipText: {
    color: '#333333',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mistakeText: {
    color: '#333333',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safetyText: {
    color: '#333333',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  videoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#666666',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#00d4ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorText: {
    color: '#333333',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});


