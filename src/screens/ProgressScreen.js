import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { BarChart } from 'react-native-chart-kit';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const { user, userProfile } = useUser();
  const [formScores, setFormScores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState('all');

  useEffect(() => {
    fetchFormScores();
  }, [user?.uid]);

  const fetchFormScores = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const scoresQuery = query(
        collection(db, 'formScores'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const scoresSnapshot = await getDocs(scoresQuery);
      const scoresData = scoresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setFormScores(scoresData);
    } catch (error) {
      console.error('Error fetching form scores:', error);
      Alert.alert('Error', 'Failed to load form scores');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFormScores();
    setRefreshing(false);
  };

  // Get unique exercise types
  const getUniqueExercises = () => {
    const exercises = new Set(formScores.map(score => score.exerciseType).filter(Boolean));
    return ['all', ...Array.from(exercises)];
  };

  const uniqueExercises = getUniqueExercises();

  // Filter scores by selected exercise
  const getFilteredScores = () => {
    if (selectedExercise === 'all') {
      return formScores;
    }
    return formScores.filter(score => score.exerciseType === selectedExercise);
  };

  const filteredScores = getFilteredScores();

  // Prepare bar chart data showing individual sessions
  const prepareScoresByExercise = () => {
    if (formScores.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{
          data: [0]
        }]
      };
    }

    // Get filtered scores based on selected exercise
    const scoresToDisplay = selectedExercise === 'all' 
      ? formScores 
      : formScores.filter(score => score.exerciseType === selectedExercise);

    // Show last 10 sessions (most recent first, but reversed for chronological order in chart)
    const recentScores = scoresToDisplay.slice(0, 10).reverse();

    const labels = [];
    const data = [];
    
    recentScores.forEach((score, index) => {
      // Create label: Session # or Date
      const date = new Date(score.createdAt || score.date);
      const shortDate = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(shortDate);
      data.push(parseFloat(score.score.toFixed(1)));
    });

    return {
      labels,
      datasets: [{
        data
      }]
    };
  };

  const chartData = prepareScoresByExercise();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16,
      paddingRight: 0, // Reduces right padding to shift chart left
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: '#e0e0e0',
      strokeWidth: 1,
    },
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOverallStats = () => {
    if (formScores.length === 0) return { avg: 0, best: 0, total: 0 };
    
    const scores = formScores.map(s => s.score);
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const best = Math.max(...scores);
    
    return {
      avg: avg.toFixed(1),
      best: best.toFixed(1),
      total: formScores.length
    };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading progress...</Text>
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
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Form Progress</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('WorkoutList')}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00d4ff"
            colors={["#00d4ff"]}
          />
        }
      >
        {formScores.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={80} color="#666666" />
            <Text style={styles.emptyStateTitle}>No Form Scores Yet</Text>
            <Text style={styles.emptyStateText}>
              Complete a workout with form analysis to start tracking your progress!
            </Text>
            <TouchableOpacity 
              style={styles.startWorkoutButton}
              onPress={() => navigation.navigate('WorkoutList')}
            >
              <Ionicons name="fitness" size={20} color="#ffffff" />
              <Text style={styles.startWorkoutButtonText}>Start a Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Overall Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="analytics" size={28} color="#00d4ff" />
                <Text style={styles.statValue}>{stats.avg}</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={28} color="#4CAF50" />
                <Text style={styles.statValue}>{stats.best}</Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={28} color="#FFC107" />
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Analyses</Text>
              </View>
            </View>

            {/* Bar Chart - Average Scores by Exercise */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartTitle}>Recent Sessions</Text>
                  <Text style={styles.chartSubtitle}>Form quality scores over time (0-100 scale)</Text>
                </View>
              </View>
              {chartData.labels[0] !== 'No data' ? (
                <BarChart
                  data={chartData}
                  width={width - 70}
                  height={280}
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  style={styles.chart}
                  fromZero
                  showBarTops={false}
                  showValuesOnTopOfBars
                  withInnerLines
                  segments={5}
                />
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={styles.emptyChartText}>No data to display</Text>
                </View>
              )}
            </View>

            {/* Exercise Filter Pills */}
            {uniqueExercises.length > 1 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Filter by Exercise</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  {uniqueExercises.map((exercise) => (
                    <TouchableOpacity
                      key={exercise}
                      style={[
                        styles.filterPill,
                        selectedExercise === exercise && styles.filterPillActive
                      ]}
                      onPress={() => setSelectedExercise(exercise)}
                    >
                      <Text style={[
                        styles.filterPillText,
                        selectedExercise === exercise && styles.filterPillTextActive
                      ]}>
                        {exercise === 'all' ? 'All Exercises' : exercise}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Recent Form Analyses List */}
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>
                Recent Analyses {selectedExercise !== 'all' && `(${selectedExercise})`}
              </Text>
              {filteredScores.length === 0 ? (
                <View style={styles.emptyFilterState}>
                  <Text style={styles.emptyFilterText}>
                    No analyses for this exercise yet
                  </Text>
                </View>
              ) : (
                filteredScores.slice(0, 10).map((score) => (
                  <View key={score.id} style={styles.scoreCard}>
                    <View style={styles.scoreCardHeader}>
                      <View style={styles.scoreCardLeft}>
                        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(score.score) }]}>
                          <Text style={styles.scoreBadgeText}>{score.score}</Text>
                        </View>
                        <View style={styles.scoreCardInfo}>
                          <Text style={styles.scoreExercise}>{score.workoutName || score.exerciseType}</Text>
                          <Text style={styles.scoreDate}>{formatDate(score.createdAt)}</Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#666666" />
                    </View>
                    {score.feedback && (
                      <Text style={styles.scoreFeedback} numberOfLines={2}>
                        {typeof score.feedback === 'string' 
                          ? score.feedback 
                          : Array.isArray(score.feedback)
                            ? score.feedback.map(item => 
                                typeof item === 'object' && item.message 
                                  ? `${item.bodyPart || ''}: ${item.message}` 
                                  : String(item)
                              ).join(' • ')
                            : typeof score.feedback === 'object' && score.feedback.message
                              ? score.feedback.message
                              : 'Feedback available'}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </View>

            {/* Call to Action */}
            <View style={styles.ctaCard}>
              <Ionicons name="trending-up" size={32} color="#00d4ff" />
              <Text style={styles.ctaTitle}>Keep Improving!</Text>
              <Text style={styles.ctaText}>
                Complete more workouts with form analysis to track your progress
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => navigation.navigate('WorkoutList')}
              >
                <Text style={styles.ctaButtonText}>Start New Workout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 25,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: '#999999',
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  filterPillTextActive: {
    color: '#4CAF50',
  },
  historySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  emptyFilterState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyFilterText: {
    fontSize: 14,
    color: '#999999',
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  scoreBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreCardInfo: {
    flex: 1,
  },
  scoreExercise: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  scoreDate: {
    fontSize: 13,
    color: '#999999',
  },
  scoreFeedback: {
    fontSize: 13,
    color: '#666666',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    lineHeight: 18,
  },
  ctaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ProgressScreen;
