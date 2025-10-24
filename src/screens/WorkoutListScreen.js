import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkoutContext } from '../context/WorkoutContext';
import { workoutDatabase } from '../data/workoutDatabase';

const { width } = Dimensions.get('window');

export default function WorkoutListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const { setSelectedWorkout } = useWorkoutContext();

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];


  const filteredWorkouts = workoutDatabase.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.targetMuscles.some(muscle => 
                           muscle.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesDifficulty = selectedDifficulty === 'All' || workout.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666666';
    }
  };

  const renderWorkoutCard = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => {
        setSelectedWorkout(item);
        navigation.navigate('WorkoutDetail');
      }}
    >
      <LinearGradient
        colors={['#2d2d2d', '#1a1a1a']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.workoutEmoji}>{item.thumbnail}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
        
        <Text style={styles.workoutName}>{item.name}</Text>
        
        <View style={styles.muscleGroupContainer}>
          {item.targetMuscles.slice(0, 3).map((muscle, index) => (
            <View key={index} style={styles.muscleTag}>
              <Text style={styles.muscleText}>{muscle}</Text>
            </View>
          ))}
          {item.targetMuscles.length > 3 && (
            <Text style={styles.moreMusclesText}>+{item.targetMuscles.length - 3} more</Text>
          )}
        </View>
        
        <View style={styles.cardFooter}>
          <Ionicons name="chevron-forward" size={20} color="#00d4ff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty && styles.filterButtonActive
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedDifficulty === difficulty && styles.filterButtonTextActive
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutsSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <FlatList
            data={filteredWorkouts}
            renderItem={renderWorkoutCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  workoutsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#ffffff',
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#00d4ff',
  },
  filterButtonText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  workoutCard: {
    width: (width - 45) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 15,
    minHeight: 180,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutEmoji: {
    fontSize: 24,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  muscleGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  muscleTag: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  muscleText: {
    color: '#00d4ff',
    fontSize: 11,
    fontWeight: '500',
  },
  moreMusclesText: {
    color: '#666666',
    fontSize: 11,
    alignSelf: 'center',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
});
