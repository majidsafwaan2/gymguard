import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { workoutDatabase } from '../data/workoutDatabase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const WorkoutAssignmentScreen = ({ navigation, route }) => {
  const { patientId } = route.params;
  const { userProfile } = useUser();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [comments, setComments] = useState({});
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatientInfo();
  }, [patientId]);

  const fetchPatientInfo = async () => {
    try {
      const patientDoc = await getDoc(doc(db, 'users', patientId));
      if (patientDoc.exists()) {
        setPatient({ id: patientDoc.id, ...patientDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching patient info:', error);
      Alert.alert('Error', 'Failed to load patient information');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (exerciseId) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        // Remove exercise and its comment
        const newComments = { ...comments };
        delete newComments[exerciseId];
        setComments(newComments);
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const updateComment = (exerciseId, comment) => {
    setComments(prev => ({
      ...prev,
      [exerciseId]: comment,
    }));
  };

  const handleAssignWorkouts = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please select at least one exercise');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create workout assignment
      const assignedExercises = selectedExercises.map(exerciseId => {
        const exercise = workoutDatabase.find(ex => ex.id === exerciseId);
        return {
          exerciseId,
          exerciseName: exercise.name,
          comment: comments[exerciseId] || '',
        };
      });

      await addDoc(collection(db, 'workoutAssignments'), {
        doctorId: userProfile.uid,
        doctorName: userProfile.fullName,
        patientId: patientId,
        patientName: patient.fullName,
        exercises: assignedExercises,
        assignedAt: new Date().toISOString(),
        status: 'active',
      });

      // Create a notification/community post for the patient
      await addDoc(collection(db, 'posts'), {
        userId: userProfile.uid,
        user: {
          name: `Dr. ${userProfile.fullName}`,
          avatar: userProfile.profilePicture || null,
        },
        content: `New workout plan assigned with ${selectedExercises.length} exercises. Check your workout list!`,
        type: 'doctor_assignment',
        visibility: 'private',
        visibleTo: [patientId],
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        likedBy: [],
      });

      Alert.alert('Success', 'Workout plan assigned successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        }
      ]);
    } catch (error) {
      console.error('Error assigning workouts:', error);
      Alert.alert('Error', 'Failed to assign workout plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExercises = workoutDatabase.filter(exercise => {
    if (filter === 'all') return true;
    if (filter === 'pt') return exercise.category === 'Physical Therapy';
    if (filter === 'strength') return exercise.category === 'Strength Training';
    return true;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Assign Workouts</Text>
          <Text style={styles.headerSubtitle}>Patient: {patient?.fullName}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Selection Summary */}
      <View style={styles.selectionSummary}>
        <Text style={styles.summaryText}>
          {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity
          style={[styles.assignButton, selectedExercises.length === 0 && styles.assignButtonDisabled]}
          onPress={handleAssignWorkouts}
          disabled={selectedExercises.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
              <Text style={styles.assignButtonText}>Assign</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pt' && styles.filterButtonActive]}
          onPress={() => setFilter('pt')}
        >
          <Text style={[styles.filterText, filter === 'pt' && styles.filterTextActive]}>
            PT Exercises
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'strength' && styles.filterButtonActive]}
          onPress={() => setFilter('strength')}
        >
          <Text style={[styles.filterText, filter === 'strength' && styles.filterTextActive]}>
            Strength
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredExercises.map((exercise) => {
          const isSelected = selectedExercises.includes(exercise.id);
          return (
            <View key={exercise.id} style={styles.exerciseCard}>
              <TouchableOpacity
                style={styles.exerciseHeader}
                onPress={() => toggleExercise(exercise.id)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseThumbnail}>{exercise.thumbnail}</Text>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                  </View>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={18} color="#ffffff" />}
                </View>
              </TouchableOpacity>

              {isSelected && (
                <View style={styles.commentSection}>
                  <Text style={styles.commentLabel}>Instructions for Patient:</Text>
                  <TextInput
                    style={styles.commentInput}
                    value={comments[exercise.id] || ''}
                    onChangeText={(text) => updateComment(exercise.id, text)}
                    placeholder="e.g., Do 3 sets of 10 reps, twice daily"
                    placeholderTextColor="#666666"
                    multiline
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#cccccc',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 2,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00d4ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  assignButtonDisabled: {
    backgroundColor: '#666666',
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00d4ff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  filterTextActive: {
    color: '#00d4ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseThumbnail: {
    fontSize: 32,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  exerciseCategory: {
    fontSize: 12,
    color: '#00d4ff',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  commentSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#ffffff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default WorkoutAssignmentScreen;

