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

export default function AnalysisResultsScreen({ navigation, route }) {
  const { selectedWorkout, addAnalysisResult } = useWorkoutContext();
  const { result } = route.params || {};

  React.useEffect(() => {
    if (result) {
      addAnalysisResult(result);
    }
  }, [result]);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No analysis results available</Text>
      </View>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Great job! Your form is excellent.';
    if (score >= 60) return 'Good form overall with room for improvement.';
    if (score >= 40) return 'Focus on the feedback below to improve your form.';
    return 'Please review the feedback and consider reducing weight.';
  };

  const handleTryAgain = () => {
    navigation.navigate('CameraAnalysis');
  };

  const handleWatchExample = () => {
    if (selectedWorkout?.videoUrl) {
      Linking.openURL(selectedWorkout.videoUrl);
    }
  };

  const handleViewProgress = () => {
    navigation.navigate('Progress');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.exerciseName}>{selectedWorkout?.name}</Text>
          <Text style={styles.analysisTitle}>Form Analysis Results</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCircle, { borderColor: getScoreColor(result.score) }]}>
              <Text style={[styles.scoreText, { color: getScoreColor(result.score) }]}>
                {result.score}
              </Text>
            </View>
            <Text style={styles.scoreLabel}>{getScoreLabel(result.score)}</Text>
            <Text style={styles.scoreMessage}>{getScoreMessage(result.score)}</Text>
          </View>
        </View>

        {/* Detailed Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>🤖 AI Form Analysis</Text>
          <Text style={styles.aiSubtitle}>
            Powered by {result.aiModel || 'Llama 3.2 Vision'} 
            {result.confidence && ` • Confidence: ${Math.round(result.confidence * 100)}%`}
            {result.processingTime && ` • Processed in ${result.processingTime}s`}
          </Text>
          {result.feedback.map((item, index) => (
            <View key={index} style={[styles.feedbackItem, styles[`feedbackItem${item.severity}`]]}>
              <View style={styles.feedbackHeader}>
                <View style={styles.feedbackIcon}>
                  <Ionicons
                    name={
                      item.type === 'excellent' ? 'checkmark-circle' :
                      item.type === 'good' ? 'checkmark-circle-outline' :
                      item.type === 'warning' ? 'warning' : 
                      item.type === 'improvement' ? 'arrow-up-circle' : 'close-circle'
                    }
                    size={20}
                    color={
                      item.type === 'excellent' ? '#4CAF50' :
                      item.type === 'good' ? '#4CAF50' :
                      item.type === 'warning' ? '#FF9800' : 
                      item.type === 'improvement' ? '#00d4ff' : '#F44336'
                    }
                  />
                </View>
                <View style={styles.feedbackContent}>
                  <Text style={styles.feedbackBodyPart}>{item.bodyPart}</Text>
                  <Text style={styles.feedbackMessage}>{item.message}</Text>
                  {item.correction && (
                    <View style={styles.correctionBox}>
                      <Text style={styles.correctionLabel}>💡 Correction:</Text>
                      <Text style={styles.correctionText}>{item.correction}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recommendations Section */}
        {result.recommendations && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>📋 Personalized Recommendations</Text>
            {result.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationNumber}>{index + 1}</Text>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Key Points Overlay */}
        {result.keypoints && (
          <View style={styles.keypointsSection}>
            <Text style={styles.sectionTitle}>Pose Detection</Text>
            <View style={styles.keypointsContainer}>
              <Text style={styles.keypointsText}>
                Detected {result.keypoints.filter(kp => kp.score > 0.5).length} keypoints
              </Text>
              <Text style={styles.keypointsSubtext}>
                Pose detection confidence: {Math.round(result.keypoints.reduce((sum, kp) => sum + kp.score, 0) / result.keypoints.length * 100)}%
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTryAgain}
          >
            <LinearGradient
              colors={['#00d4ff', '#0099cc']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleWatchExample}
          >
            <LinearGradient
              colors={['#666666', '#444444']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="play-circle" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Watch Example</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewProgress}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="trending-up" size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>View Progress</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>General Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Ionicons name="bulb" size={16} color="#FFD700" />
              <Text style={styles.tipText}>
                Focus on controlled movement throughout the entire range of motion
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>
                Always prioritize form over weight - safety comes first
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="repeat" size={16} color="#00d4ff" />
              <Text style={styles.tipText}>
                Practice regularly to build muscle memory and improve consistency
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  analysisTitle: {
    fontSize: 16,
    color: '#cccccc',
  },
  content: {
    padding: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  aiSubtitle: {
    fontSize: 14,
    color: '#00d4ff',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  feedbackItem: {
    marginBottom: 15,
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  feedbackItemgood: {
    borderLeftColor: '#4CAF50',
  },
  feedbackItemmoderate: {
    borderLeftColor: '#FF9800',
  },
  feedbackItemminor: {
    borderLeftColor: '#00d4ff',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  feedbackIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackBodyPart: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  feedbackMessage: {
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 22,
    marginBottom: 8,
  },
  correctionBox: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  correctionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 3,
  },
  correctionText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  recommendationsSection: {
    marginBottom: 25,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 12,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00d4ff',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 22,
  },
  keypointsSection: {
    marginBottom: 25,
  },
  keypointsContainer: {
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 12,
  },
  keypointsText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 5,
  },
  keypointsSubtext: {
    fontSize: 13,
    color: '#cccccc',
  },
  actionSection: {
    marginBottom: 25,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  tipsSection: {
    marginBottom: 25,
  },
  tipsContainer: {
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#cccccc',
    marginLeft: 10,
    lineHeight: 20,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
