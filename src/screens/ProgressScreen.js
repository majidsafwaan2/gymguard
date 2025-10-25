import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('weight');

  // Mock data - in a real app, this would come from a database
  const [progressData, setProgressData] = useState({
    weight: {
      current: 165,
      goal: 160,
      change: -2.5,
      history: [170, 168, 167, 166, 165.5, 165, 165]
    },
    bodyFat: {
      current: 18.5,
      goal: 15,
      change: -1.2,
      history: [20.2, 19.8, 19.5, 19.0, 18.8, 18.5, 18.5]
    },
    muscleMass: {
      current: 135,
      goal: 140,
      change: 1.8,
      history: [133, 133.5, 134, 134.2, 134.8, 135, 135]
    },
    strength: {
      current: 225,
      goal: 250,
      change: 15,
      history: [200, 205, 210, 215, 220, 225, 225]
    }
  });

  const [workoutStats, setWorkoutStats] = useState({
    thisWeek: {
      workouts: 4,
      totalTime: 320,
      caloriesBurned: 1200,
      exercisesCompleted: 28
    },
    lastWeek: {
      workouts: 3,
      totalTime: 240,
      caloriesBurned: 900,
      exercisesCompleted: 21
    }
  });

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "First Workout",
      description: "Completed your first workout",
      icon: "🏆",
      earned: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Worked out 4 times in a week",
      icon: "💪",
      earned: true,
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Strength Master",
      description: "Increased bench press by 25lbs",
      icon: "🔥",
      earned: false,
      date: null
    },
    {
      id: 4,
      title: "Consistency King",
      description: "Worked out 30 days in a row",
      icon: "👑",
      earned: false,
      date: null
    }
  ]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#667eea'
    }
  };

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' }
  ];

  const metrics = [
    { key: 'weight', label: 'Weight', unit: 'lbs', color: '#FF5722' },
    { key: 'bodyFat', label: 'Body Fat', unit: '%', color: '#2196F3' },
    { key: 'muscleMass', label: 'Muscle', unit: 'lbs', color: '#4CAF50' },
    { key: 'strength', label: 'Strength', unit: 'lbs', color: '#FF9800' }
  ];

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getChangeColor = (change) => {
    if (change > 0) return '#4CAF50';
    if (change < 0) return '#F44336';
    return '#666666';
  };

  const renderMetricCard = (metric) => {
    const data = progressData[metric.key];
    const percentage = getProgressPercentage(data.current, data.goal);
    
    return (
      <TouchableOpacity
        key={metric.key}
        style={[
          styles.metricCard,
          selectedMetric === metric.key && styles.selectedMetricCard
        ]}
        onPress={() => setSelectedMetric(metric.key)}
      >
        <View style={styles.metricHeader}>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          <View style={[styles.metricColorDot, { backgroundColor: metric.color }]} />
        </View>
        <Text style={styles.metricValue}>{data.current}{metric.unit}</Text>
        <Text style={styles.metricGoal}>Goal: {data.goal}{metric.unit}</Text>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: metric.color
            }
          ]} />
        </View>
        <View style={styles.metricChange}>
          <Ionicons 
            name={data.change > 0 ? "trending-up" : "trending-down"} 
            size={16} 
            color={getChangeColor(data.change)} 
          />
          <Text style={[styles.changeText, { color: getChangeColor(data.change) }]}>
            {data.change > 0 ? '+' : ''}{data.change}{metric.unit}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAchievement = (achievement) => (
    <View key={achievement.id} style={[
      styles.achievementCard,
      !achievement.earned && styles.lockedAchievement
    ]}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle,
          !achievement.earned && styles.lockedText
        ]}>
          {achievement.title}
        </Text>
        <Text style={[
          styles.achievementDescription,
          !achievement.earned && styles.lockedText
        ]}>
          {achievement.description}
        </Text>
        {achievement.earned && (
          <Text style={styles.achievementDate}>
            Earned on {new Date(achievement.date).toLocaleDateString()}
          </Text>
        )}
      </View>
      {achievement.earned && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </View>
  );

  const prepareChartData = () => {
    const data = progressData[selectedMetric];
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: data.history,
        color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const prepareWorkoutChartData = () => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [45, 60, 0, 75, 0, 90, 50], // Mock workout duration data
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Tracking</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="analytics-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.selectedPeriodButton
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.selectedPeriodButtonText
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics Overview */}
        <View style={styles.metricsContainer}>
          {metrics.map(renderMetricCard)}
        </View>

        {/* Progress Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{metrics.find(m => m.key === selectedMetric)?.label} Progress</Text>
          <LineChart
            data={prepareChartData()}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Workout Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Workout Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="fitness-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>{workoutStats.thisWeek.workouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>{workoutStats.thisWeek.totalTime}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>{workoutStats.thisWeek.caloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>{workoutStats.thisWeek.exercisesCompleted}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
          </View>
        </View>

        {/* Workout Duration Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Workout Duration</Text>
          <BarChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: [45, 60, 0, 75, 0, 90, 50]
              }]
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          {achievements.map(renderAchievement)}
        </View>

        {/* Body Measurements */}
        <View style={styles.measurementsCard}>
          <Text style={styles.measurementsTitle}>Body Measurements</Text>
          <View style={styles.measurementsGrid}>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Chest</Text>
              <Text style={styles.measurementValue}>42"</Text>
              <Text style={styles.measurementChange}>+0.5"</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Waist</Text>
              <Text style={styles.measurementValue}>32"</Text>
              <Text style={styles.measurementChange}>-1.0"</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Arms</Text>
              <Text style={styles.measurementValue}>15"</Text>
              <Text style={styles.measurementChange}>+0.3"</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Thighs</Text>
              <Text style={styles.measurementValue}>24"</Text>
              <Text style={styles.measurementChange}>+0.2"</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedPeriodButton: {
    backgroundColor: '#ffffff',
  },
  periodButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedPeriodButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 40) / 2,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  selectedMetricCard: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#cccccc',
  },
  metricColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  metricGoal: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  chartCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
  },
  achievementsCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 10,
    color: '#999999',
  },
  lockedText: {
    color: '#999999',
  },
  measurementsCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  measurementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  measurementItem: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 5,
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  measurementChange: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default ProgressScreen;