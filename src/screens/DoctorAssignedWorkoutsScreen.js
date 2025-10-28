import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useWorkoutContext } from '../context/WorkoutContext';
import { workoutDatabase } from '../data/workoutDatabase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DoctorAssignedWorkoutsScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const { setSelectedWorkout } = useWorkoutContext();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  useEffect(() => {
    if (userProfile?.uid) {
      fetchAssignments();
    }
  }, [userProfile]);

  const fetchAssignments = async () => {
    try {
      const assignmentsQuery = query(
        collection(db, 'workoutAssignments'),
        where('patientId', '==', userProfile.uid),
        orderBy('assignedAt', 'desc')
      );

      const querySnapshot = await getDocs(assignmentsQuery);
      const assignmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const getExerciseDetails = (exerciseId) => {
    return workoutDatabase.find(ex => ex.id === exerciseId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading your workout plans...</Text>
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
        <Text style={styles.headerTitle}>My Assigned Workouts</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00d4ff"
          />
        }
      >
        {assignments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={64} color="#666666" />
            <Text style={styles.emptyTitle}>No Assigned Workouts Yet</Text>
            <Text style={styles.emptyText}>
              Your doctor will assign personalized workout plans for you here.
            </Text>
          </View>
        ) : (
          assignments.map((assignment) => (
            <View key={assignment.id} style={styles.assignmentCard}>
              <TouchableOpacity
                style={styles.assignmentHeader}
                onPress={() => toggleAssignment(assignment.id)}
              >
                <View style={styles.assignmentInfo}>
                  <View style={styles.doctorInfo}>
                    <Ionicons name="medical" size={20} color="#00d4ff" />
                    <Text style={styles.doctorName}>{assignment.doctorName}</Text>
                  </View>
                  <Text style={styles.assignmentDate}>
                    Assigned on {formatDate(assignment.assignedAt)}
                  </Text>
                  <View style={styles.exerciseCount}>
                    <Ionicons name="barbell-outline" size={16} color="#cccccc" />
                    <Text style={styles.exerciseCountText}>
                      {assignment.exercises.length} exercise{assignment.exercises.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name={expandedAssignment === assignment.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#cccccc" 
                />
              </TouchableOpacity>

              {expandedAssignment === assignment.id && (
                <View style={styles.exercisesContainer}>
                  {assignment.exercises.map((assignedExercise, index) => {
                    const exerciseDetails = getExerciseDetails(assignedExercise.exerciseId);
                    
                    return (
                      <View key={index} style={styles.exerciseItem}>
                        <View style={styles.exerciseHeader}>
                          <Text style={styles.exerciseThumbnail}>
                            {exerciseDetails?.thumbnail || '🏋️'}
                          </Text>
                          <View style={styles.exerciseDetails}>
                            <Text style={styles.exerciseName}>
                              {assignedExercise.exerciseName}
                            </Text>
                            {exerciseDetails && (
                              <>
                                <Text style={styles.exerciseCategory}>
                                  {exerciseDetails.category}
                                </Text>
                                <View style={styles.muscleTagsContainer}>
                                  {exerciseDetails.targetMuscles.slice(0, 2).map((muscle, i) => (
                                    <View key={i} style={styles.muscleTag}>
                                      <Text style={styles.muscleTagText}>{muscle}</Text>
                                    </View>
                                  ))}
                                </View>
                              </>
                            )}
                          </View>
                          <TouchableOpacity
                            style={styles.viewDetailsButton}
                            onPress={() => {
                              if (exerciseDetails) {
                                setSelectedWorkout(exerciseDetails);
                                navigation.navigate('WorkoutDetail');
                              }
                            }}
                          >
                            <Ionicons name="information-circle-outline" size={24} color="#00d4ff" />
                          </TouchableOpacity>
                        </View>

                        {assignedExercise.comment && (
                          <View style={styles.commentSection}>
                            <View style={styles.commentHeader}>
                              <Ionicons name="chatbox-ellipses-outline" size={16} color="#00d4ff" />
                              <Text style={styles.commentLabel}>Doctor's Instructions:</Text>
                            </View>
                            <Text style={styles.commentText}>{assignedExercise.comment}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}

                  <TouchableOpacity 
                    style={styles.startWorkoutButton}
                    onPress={() => {
                      // Navigate to workout timer or tracking
                      navigation.navigate('WorkoutTimer', { 
                        exercises: assignment.exercises 
                      });
                    }}
                  >
                    <Ionicons name="play-circle" size={24} color="#ffffff" />
                    <Text style={styles.startWorkoutButtonText}>Start This Workout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  assignmentCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  assignmentInfo: {
    flex: 1,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  assignmentDate: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseCountText: {
    fontSize: 14,
    color: '#cccccc',
    marginLeft: 6,
  },
  exercisesContainer: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  exerciseItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseThumbnail: {
    fontSize: 32,
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 12,
    color: '#00d4ff',
    marginBottom: 6,
  },
  muscleTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleTag: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginTop: 2,
  },
  muscleTagText: {
    fontSize: 10,
    color: '#00d4ff',
  },
  viewDetailsButton: {
    padding: 8,
  },
  commentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d2d2d',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
    marginLeft: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default DoctorAssignedWorkoutsScreen;

