import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WorkoutPlansScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const workoutPlans = [
    {
      id: 1,
      name: "Beginner Full Body",
      duration: "4 weeks",
      difficulty: "Beginner",
      frequency: "3x/week",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      description: "Perfect for those new to strength training. Builds a solid foundation with compound movements.",
      exercises: [
        { name: "Bodyweight Squats", sets: "3", reps: "12-15", rest: "60s" },
        { name: "Push-ups", sets: "3", reps: "8-12", rest: "60s" },
        { name: "Plank", sets: "3", reps: "30-45s", rest: "60s" },
        { name: "Lunges", sets: "3", reps: "10 each leg", rest: "60s" },
        { name: "Glute Bridges", sets: "3", reps: "12-15", rest: "60s" }
      ],
      goals: ["Build strength", "Improve mobility", "Learn proper form"]
    },
    {
      id: 2,
      name: "Upper Body Power",
      duration: "6 weeks",
      difficulty: "Intermediate",
      frequency: "4x/week",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=200&fit=crop",
      description: "Focus on building upper body strength and muscle mass with progressive overload.",
      exercises: [
        { name: "Bench Press", sets: "4", reps: "6-8", rest: "2-3min" },
        { name: "Pull-ups", sets: "4", reps: "6-10", rest: "2-3min" },
        { name: "Overhead Press", sets: "4", reps: "6-8", rest: "2-3min" },
        { name: "Barbell Rows", sets: "4", reps: "8-10", rest: "2-3min" },
        { name: "Dips", sets: "3", reps: "8-12", rest: "90s" },
        { name: "Bicep Curls", sets: "3", reps: "10-12", rest: "60s" }
      ],
      goals: ["Increase bench press", "Build muscle mass", "Improve pulling strength"]
    },
    {
      id: 3,
      name: "HIIT Fat Burner",
      duration: "4 weeks",
      difficulty: "Intermediate",
      frequency: "5x/week",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      description: "High-intensity interval training designed to maximize fat burning and improve cardiovascular fitness.",
      exercises: [
        { name: "Burpees", sets: "4", reps: "30s work", rest: "30s" },
        { name: "Mountain Climbers", sets: "4", reps: "30s work", rest: "30s" },
        { name: "Jump Squats", sets: "4", reps: "30s work", rest: "30s" },
        { name: "High Knees", sets: "4", reps: "30s work", rest: "30s" },
        { name: "Plank Jacks", sets: "4", reps: "30s work", rest: "30s" },
        { name: "Jumping Lunges", sets: "4", reps: "30s work", rest: "30s" }
      ],
      goals: ["Burn fat", "Improve endurance", "Boost metabolism"]
    },
    {
      id: 4,
      name: "Leg Day Destroyer",
      duration: "6 weeks",
      difficulty: "Advanced",
      frequency: "2x/week",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&h=200&fit=crop",
      description: "Intense lower body training for serious strength and muscle development.",
      exercises: [
        { name: "Back Squats", sets: "5", reps: "5", rest: "3-4min" },
        { name: "Romanian Deadlifts", sets: "4", reps: "8-10", rest: "2-3min" },
        { name: "Bulgarian Split Squats", sets: "3", reps: "10 each leg", rest: "90s" },
        { name: "Leg Press", sets: "4", reps: "12-15", rest: "90s" },
        { name: "Walking Lunges", sets: "3", reps: "20 steps", rest: "90s" },
        { name: "Calf Raises", sets: "4", reps: "15-20", rest: "60s" }
      ],
      goals: ["Build leg strength", "Increase squat max", "Develop power"]
    },
    {
      id: 5,
      name: "Core & Stability",
      duration: "4 weeks",
      difficulty: "Beginner",
      frequency: "4x/week",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      description: "Strengthen your core and improve stability for better performance in all activities.",
      exercises: [
        { name: "Dead Bug", sets: "3", reps: "10 each side", rest: "60s" },
        { name: "Bird Dog", sets: "3", reps: "10 each side", rest: "60s" },
        { name: "Side Plank", sets: "3", reps: "30s each side", rest: "60s" },
        { name: "Pallof Press", sets: "3", reps: "10 each side", rest: "60s" },
        { name: "Russian Twists", sets: "3", reps: "20", rest: "60s" },
        { name: "Hollow Body Hold", sets: "3", reps: "30s", rest: "60s" }
      ],
      goals: ["Strengthen core", "Improve stability", "Prevent injury"]
    },
    {
      id: 6,
      name: "Push/Pull Split",
      duration: "8 weeks",
      difficulty: "Advanced",
      frequency: "6x/week",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=200&fit=crop",
      description: "Advanced training split focusing on pushing and pulling movements for maximum muscle development.",
      exercises: [
        { name: "Push Day: Bench Press", sets: "4", reps: "6-8", rest: "3min" },
        { name: "Push Day: Overhead Press", sets: "4", reps: "6-8", rest: "3min" },
        { name: "Push Day: Dips", sets: "3", reps: "8-12", rest: "2min" },
        { name: "Pull Day: Deadlifts", sets: "4", reps: "5", rest: "4min" },
        { name: "Pull Day: Pull-ups", sets: "4", reps: "6-10", rest: "3min" },
        { name: "Pull Day: Barbell Rows", sets: "4", reps: "8-10", rest: "2min" }
      ],
      goals: ["Maximize muscle growth", "Improve strength", "Advanced training"]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666666';
    }
  };

  const startWorkoutPlan = (plan) => {
    Alert.alert(
      "Start Workout Plan",
      `Are you ready to begin "${plan.name}"? This plan is ${plan.duration} long and requires ${plan.frequency} commitment.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Start Plan", onPress: () => {
          // In a real app, this would save the plan to user's active plans
          Alert.alert("Success!", "Workout plan started! Check your workout schedule.");
        }}
      ]
    );
  };

  const renderWorkoutPlan = (plan) => (
    <TouchableOpacity
      key={plan.id}
      style={styles.planCard}
      onPress={() => {
        setSelectedPlan(plan);
        setShowPlanDetails(true);
      }}
    >
      <Image source={{ uri: plan.image }} style={styles.planImage} />
      <View style={styles.planOverlay}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
          <View style={styles.planDetails}>
            <View style={styles.planDetail}>
              <Ionicons name="time-outline" size={16} color="#ffffff" />
              <Text style={styles.planDetailText}>{plan.duration}</Text>
            </View>
            <View style={styles.planDetail}>
              <Ionicons name="calendar-outline" size={16} color="#ffffff" />
              <Text style={styles.planDetailText}>{plan.frequency}</Text>
            </View>
            <View style={styles.planDetail}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
                <Text style={styles.difficultyText}>{plan.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Plans</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="filter-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Plans</Text>
          <Text style={styles.sectionSubtitle}>Choose a plan that matches your goals</Text>
        </View>

        {workoutPlans.map(renderWorkoutPlan)}

        <View style={styles.customPlanCard}>
          <Ionicons name="add-circle-outline" size={48} color="#667eea" />
          <Text style={styles.customPlanTitle}>Create Custom Plan</Text>
          <Text style={styles.customPlanSubtitle}>Build your own workout routine</Text>
          <TouchableOpacity style={styles.customPlanButton}>
            <Text style={styles.customPlanButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Plan Details Modal */}
      <Modal
        visible={showPlanDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPlanDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPlan && (
              <>
                <View style={styles.modalHeader}>
                  <Image source={{ uri: selectedPlan.image }} style={styles.modalImage} />
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalTitle}>{selectedPlan.name}</Text>
                    <Text style={styles.modalDescription}>{selectedPlan.description}</Text>
                    <View style={styles.modalDetails}>
                      <View style={styles.modalDetail}>
                        <Ionicons name="time-outline" size={16} color="#666666" />
                        <Text style={styles.modalDetailText}>{selectedPlan.duration}</Text>
                      </View>
                      <View style={styles.modalDetail}>
                        <Ionicons name="calendar-outline" size={16} color="#666666" />
                        <Text style={styles.modalDetailText}>{selectedPlan.frequency}</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedPlan.difficulty) }]}>
                        <Text style={styles.difficultyText}>{selectedPlan.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.goalsSection}>
                    <Text style={styles.goalsTitle}>Goals</Text>
                    {selectedPlan.goals.map((goal, index) => (
                      <View key={index} style={styles.goalItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.goalText}>{goal}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.exercisesSection}>
                    <Text style={styles.exercisesTitle}>Exercises</Text>
                    {selectedPlan.exercises.map((exercise, index) => (
                      <View key={index} style={styles.exerciseItem}>
                        <View style={styles.exerciseInfo}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDetails}>
                            {exercise.sets} sets • {exercise.reps} reps • {exercise.rest} rest
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.exerciseButton}>
                          <Ionicons name="play-circle-outline" size={24} color="#667eea" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setShowPlanDetails(false)}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.startPlanButton}
                    onPress={() => {
                      setShowPlanDetails(false);
                      startWorkoutPlan(selectedPlan);
                    }}
                  >
                    <Text style={styles.startPlanButtonText}>Start This Plan</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  planCard: {
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  planImage: {
    width: '100%',
    height: '100%',
  },
  planOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  planDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planDetailText: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  customPlanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  customPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 5,
  },
  customPlanSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  customPlanButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  customPlanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  modalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  modalDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalDetailText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 5,
  },
  modalBody: {
    maxHeight: 400,
    padding: 20,
  },
  goalsSection: {
    marginBottom: 20,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
  },
  exercisesSection: {
    marginBottom: 20,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666666',
  },
  exerciseButton: {
    padding: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 15,
  },
  closeModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  startPlanButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  startPlanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default WorkoutPlansScreen;
