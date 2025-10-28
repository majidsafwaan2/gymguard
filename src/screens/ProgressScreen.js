import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const { userProfile, updateUserProfile, user } = useUser();
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showBodyFatModal, setShowBodyFatModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newNeck, setNewNeck] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newHip, setNewHip] = useState('');
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Get body measurements and targets from user profile
  const currentWeight = userProfile?.weight || 0;
  const targetWeight = userProfile?.targetWeight || 0;
  const currentBodyFat = userProfile?.bodyFat || 0;
  const targetBodyFat = userProfile?.targetBodyFat || 0;
  
  // Calculate Fat Mass and Lean Mass
  // FM = BF × Weight (where BF is body fat as decimal)
  // LM = Weight - FM
  const fatMass = currentWeight && currentBodyFat ? (currentBodyFat / 100) * currentWeight : 0;
  const leanMass = currentWeight && fatMass ? currentWeight - fatMass : 0;
  
  // Calculate percentages towards goals
  const getProgressPercentage = (current, goal, isWeight) => {
    if (!goal || !current) return 0;
    // For weight loss: goal is less, for weight gain: goal is more
    // We'll assume weight loss for simplicity
    if (isWeight) {
      const diff = current - goal;
      const totalDiff = current - goal;
      // If losing weight, calculate % towards goal (0-100%)
      if (current > goal) {
        return Math.min(100, (diff / Math.abs(current - goal)) * 100);
      }
      return 0;
    } else {
      // For body fat, lower is better
      const diff = current - goal;
      return Math.min(100, Math.max(0, ((current - goal) / current) * 100));
    }
  };

  // Calculate Body Fat Percentage using U.S. Navy Method
  const calculateBodyFatPercentage = (weight) => {
    const height = userProfile?.height;
    const neck = userProfile?.neck;
    const waist = userProfile?.waist;
    const hip = userProfile?.hip;
    const gender = userProfile?.gender;
    
    const heightNum = parseFloat(height);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    
    // Validate required measurements
    if (!heightNum || !neckNum || !waistNum || !gender || !weight) {
      return null;
    }
    
    // For females, hip measurement is required
    if (gender === 'female' && !hipNum) {
      return null;
    }
    
    let bodyFat;
    
    if (gender === 'male') {
      // U.S. Navy Method for Males (USC Units - inches)
      // BFP = 86.010×log₁₀(abdomen-neck) - 70.041×log₁₀(height) + 36.76
      const abdomenMinusNeck = waistNum - neckNum;
      
      if (abdomenMinusNeck <= 0) {
        return null; // Invalid measurement
      }
      
      bodyFat = 86.010 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(heightNum) + 36.76;
    } else if (gender === 'female') {
      // U.S. Navy Method for Females (USC Units - inches)
      // BFP = 163.205×log₁₀(waist+hip-neck) - 97.684×log₁₀(height) - 78.387
      const waistPlusHipMinusNeck = waistNum + hipNum - neckNum;
      
      if (waistPlusHipMinusNeck <= 0) {
        return null; // Invalid measurement
      }
      
      bodyFat = 163.205 * Math.log10(waistPlusHipMinusNeck) - 97.684 * Math.log10(heightNum) - 78.387;
    } else {
      // For 'other' gender, use male formula as default
      const abdomenMinusNeck = waistNum - neckNum;
      
      if (abdomenMinusNeck <= 0) {
        return null;
      }
      
      bodyFat = 86.010 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(heightNum) + 36.76;
    }
    
    // Ensure the result is between 5% and 50%
    const clampedBFP = Math.max(5, Math.min(50, bodyFat));
    
    return Math.round(clampedBFP * 10) / 10; // Round to 1 decimal place
  };

  const handleRecordWeight = async () => {
    const weightNum = parseFloat(newWeight);
    
    if (!weightNum || weightNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid weight.');
      return;
    }

    if (!measurementDate) {
      Alert.alert('Invalid Date', 'Please select a date.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Calculate new body fat percentage
      const newBodyFat = calculateBodyFatPercentage(weightNum);
      
      // Get existing weight entries or initialize empty array
      const existingEntries = userProfile?.weightEntries || [];
      
      // Add new entry with date and weight
      const newEntry = {
        date: measurementDate,
        weight: weightNum,
        bodyFat: newBodyFat
      };
      
      // Add to existing entries and sort by date
      const updatedEntries = [...existingEntries, newEntry].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      // Keep only last 30 entries
      const recentEntries = updatedEntries.slice(-30);
      
      const updates = { 
        weight: weightNum,
        weightEntries: recentEntries
      };
      
      if (newBodyFat !== null) {
        updates.bodyFat = newBodyFat;
        console.log('Recalculated body fat percentage:', newBodyFat + '%');
      }
      
      await updateUserProfile(updates);
      
      setShowRecordModal(false);
      setNewWeight('');
      setMeasurementDate(new Date().toISOString().split('T')[0]);
      Alert.alert('Success', 'Your measurements have been updated!');
    } catch (error) {
      console.error('Error recording weight:', error);
      Alert.alert('Error', 'Failed to update measurements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBodyFatMeasurements = async () => {
    const weightNum = parseFloat(newWeight);
    const neckNum = parseFloat(newNeck);
    const waistNum = parseFloat(newWaist);
    const hipNum = parseFloat(newHip);
    const gender = userProfile?.gender;
    
    // Validate required inputs
    if (!weightNum || weightNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid weight.');
      return;
    }
    
    if (!neckNum || neckNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid neck circumference.');
      return;
    }
    
    if (!waistNum || waistNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid waist circumference.');
      return;
    }
    
    // For females, hip is required
    if (gender === 'female' && (!hipNum || hipNum <= 0)) {
      Alert.alert('Invalid Input', 'Please enter a valid hip circumference.');
      return;
    }

    if (!measurementDate) {
      Alert.alert('Invalid Date', 'Please select a date.');
      return;
    }

    try {
      setIsLoading(true);
      
      const updates = {
        weight: weightNum,
        neck: neckNum,
        waist: waistNum
      };
      
      if (gender === 'female') {
        updates.hip = hipNum;
      }
      
      // Calculate new body fat percentage with updated measurements using U.S. Navy Method
      const height = userProfile?.height;
      const heightNum = parseFloat(height);
      
      let newBodyFat = null;
      
      if (heightNum && neckNum && waistNum) {
        let bodyFat;
        
        if (gender === 'male') {
          const abdomenMinusNeck = waistNum - neckNum;
          if (abdomenMinusNeck > 0) {
            bodyFat = 86.010 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(heightNum) + 36.76;
          }
        } else if (gender === 'female' && hipNum) {
          const waistPlusHipMinusNeck = waistNum + hipNum - neckNum;
          if (waistPlusHipMinusNeck > 0) {
            bodyFat = 163.205 * Math.log10(waistPlusHipMinusNeck) - 97.684 * Math.log10(heightNum) - 78.387;
          }
        } else {
          // For 'other' gender, use male formula
          const abdomenMinusNeck = waistNum - neckNum;
          if (abdomenMinusNeck > 0) {
            bodyFat = 86.010 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(heightNum) + 36.76;
          }
        }
        
        if (bodyFat !== undefined) {
          const clampedBFP = Math.max(5, Math.min(50, bodyFat));
          newBodyFat = Math.round(clampedBFP * 10) / 10;
        }
      }
      
      if (newBodyFat !== null) {
        updates.bodyFat = newBodyFat;
        console.log('Recalculated body fat percentage:', newBodyFat + '%');
      }
      
      // Get existing weight entries or initialize empty array
      const existingEntries = userProfile?.weightEntries || [];
      
      // Add new entry with date and measurements
      const newEntry = {
        date: measurementDate,
        weight: weightNum,
        bodyFat: newBodyFat
      };
      
      // Add to existing entries and sort by date
      const updatedEntries = [...existingEntries, newEntry].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      // Keep only last 30 entries
      const recentEntries = updatedEntries.slice(-30);
      updates.weightEntries = recentEntries;
      
      await updateUserProfile(updates);
      
      setShowBodyFatModal(false);
      setNewWeight('');
      setNewNeck('');
      setNewWaist('');
      setNewHip('');
      setMeasurementDate(new Date().toISOString().split('T')[0]);
      Alert.alert('Success', 'Your body measurements have been updated!');
    } catch (error) {
      console.error('Error updating measurements:', error);
      Alert.alert('Error', 'Failed to update measurements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get weight entries from profile
  const weightEntries = userProfile?.weightEntries || [];
  
  // Prepare chart data from actual weight entries
  const prepareWeightHistory = () => {
    if (weightEntries.length === 0) {
      // Return empty data if no entries
      return {
        labels: ['No data'],
        values: [0],
        month: null
      };
    }
    
    // Get last 7 entries or all if less than 7
    const recentEntries = weightEntries.slice(-7);
    
    // Helper function to parse date string and get local date (avoid timezone issues)
    const parseDate = (dateString) => {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      return new Date(dateString);
    };
    
    // Get the month name from the most recent entry
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    let month = null;
    if (recentEntries.length > 0) {
      const mostRecentDate = parseDate(recentEntries[recentEntries.length - 1].date);
      month = monthNames[mostRecentDate.getMonth()];
    }
    
    // Format dates as day numbers (e.g., 14, 17, 21)
    const labels = recentEntries.map(entry => {
      const date = parseDate(entry.date);
      return date.getDate().toString(); // Returns day of month (1-31)
    });
    
    const values = recentEntries.map(entry => parseFloat(entry.weight));
    
    return { labels, values, month };
  };
  
  const chartData = prepareWeightHistory();

  const chartConfig = {
    backgroundColor: '#2d2d2d',
    backgroundGradientFrom: '#2d2d2d',
    backgroundGradientTo: '#2d2d2d',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#00d4ff'
    }
  };

  const prepareChartData = () => {
    if (chartData.values.length === 0 || chartData.values[0] === 0) {
      return {
        labels: ['No data available'],
        datasets: [{
          data: [currentWeight || 0]
        }]
      };
    }
    
    return {
      labels: chartData.labels,
      datasets: [{
        data: chartData.values,
        color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const weightProgress = getProgressPercentage(currentWeight, targetWeight, true);
  const bodyFatProgress = getProgressPercentage(currentBodyFat, targetBodyFat, false);

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
        {/* Progress Chart */}
        <View style={styles.chartCard}>
          {chartData.month && (
            <Text style={styles.chartMonthTitle}>{chartData.month}</Text>
          )}
          <Text style={styles.chartTitle}>Weight Progress</Text>
          {weightEntries.length > 0 ? (
            <LineChart
              data={prepareChartData()}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons name="bar-chart-outline" size={64} color="#666666" />
              <Text style={styles.emptyChartText}>Record your weight to see your progress!</Text>
            </View>
          )}
        </View>

        {/* Weight and Body Fat Cards */}
        <View style={styles.metricsContainer}>
          {/* Weight Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Weight</Text>
              <View style={[styles.metricColorDot, { backgroundColor: '#FF5722' }]} />
            </View>
            <Text style={styles.metricValue}>{currentWeight ? parseFloat(currentWeight).toFixed(1) : 0} lbs</Text>
            <Text style={styles.metricGoal}>Goal: {targetWeight ? targetWeight.toFixed(1) : 'N/A'} lbs</Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, weightProgress)}%`,
                  backgroundColor: '#FF5722'
                }
              ]} />
            </View>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() => setShowRecordModal(true)}
            >
              <Ionicons name="add-circle" size={16} color="#ffffff" />
              <Text style={styles.recordButtonText}>Record Weight</Text>
            </TouchableOpacity>
          </View>

          {/* Body Fat Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Body Fat %</Text>
              <View style={[styles.metricColorDot, { backgroundColor: '#2196F3' }]} />
            </View>
            <Text style={styles.metricValue}>{currentBodyFat ? currentBodyFat.toFixed(1) : 0}%</Text>
            <Text style={styles.metricGoal}>Goal: {targetBodyFat ? targetBodyFat.toFixed(1) : 'N/A'}%</Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, bodyFatProgress)}%`,
                  backgroundColor: '#2196F3'
                }
              ]} />
            </View>
            
            {/* Fat Mass and Lean Mass */}
            <View style={styles.massBreakdown}>
              <View style={styles.massItem}>
                <Text style={styles.massLabel}>Fat Mass</Text>
                <Text style={styles.massValue}>{fatMass ? fatMass.toFixed(1) : 0} lbs</Text>
              </View>
              <View style={styles.massDivider} />
              <View style={styles.massItem}>
                <Text style={styles.massLabel}>Lean Mass</Text>
                <Text style={styles.massValue}>{leanMass ? leanMass.toFixed(1) : 0} lbs</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() => {
                // Pre-fill with current values
                setNewWeight(currentWeight.toString());
                setNewNeck((userProfile?.neck || '').toString());
                setNewWaist((userProfile?.waist || '').toString());
                setNewHip((userProfile?.hip || '').toString());
                setShowBodyFatModal(true);
              }}
            >
              <Ionicons name="calculator" size={16} color="#ffffff" />
              <Text style={styles.recordButtonText}>Update Measurements</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="fitness-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>320m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={24} color="#667eea" />
              <Text style={styles.statValue}>1200</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDescription}>Completed your first workout</Text>
              <Text style={styles.achievementDate}>Earned on 1/15/2024</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>💪</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDescription}>Worked out 4 times in a week</Text>
              <Text style={styles.achievementDate}>Earned on 1/20/2024</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
        </View>
      </ScrollView>

      {/* Record Weight Modal */}
      <Modal
        visible={showRecordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRecordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record New Weight</Text>
              <TouchableOpacity onPress={() => setShowRecordModal(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Enter your current weight (lb)</Text>
            <TextInput
              style={styles.modalInput}
              value={newWeight}
              onChangeText={setNewWeight}
              keyboardType="numeric"
              placeholder="e.g. 165"
              placeholderTextColor="#666666"
              autoFocus
            />
            <Text style={styles.modalLabel}>Select measurement date</Text>
            <TextInput
              style={styles.modalInput}
              value={measurementDate}
              onChangeText={setMeasurementDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowRecordModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleRecordWeight}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Body Fat Measurements Modal */}
      <Modal
        visible={showBodyFatModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBodyFatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Body Measurements</Text>
                <TouchableOpacity onPress={() => setShowBodyFatModal(false)}>
                  <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalDescription}>
                Enter your current measurements to calculate body fat percentage using the U.S. Navy Method
              </Text>
              
              <Text style={styles.modalLabel}>Weight (lb)</Text>
              <TextInput
                style={styles.modalInput}
                value={newWeight}
                onChangeText={setNewWeight}
                keyboardType="numeric"
                placeholder="e.g. 165"
                placeholderTextColor="#666666"
              />
              
              <Text style={styles.modalLabel}>Neck Circumference (in)</Text>
              <TextInput
                style={styles.modalInput}
                value={newNeck}
                onChangeText={setNewNeck}
                keyboardType="numeric"
                placeholder="e.g. 15"
                placeholderTextColor="#666666"
              />
              
              <Text style={styles.modalLabel}>Waist Circumference (in)</Text>
              <TextInput
                style={styles.modalInput}
                value={newWaist}
                onChangeText={setNewWaist}
                keyboardType="numeric"
                placeholder="e.g. 32"
                placeholderTextColor="#666666"
              />
              
              {userProfile?.gender === 'female' && (
                <>
                  <Text style={styles.modalLabel}>Hip Circumference (in)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={newHip}
                    onChangeText={setNewHip}
                    keyboardType="numeric"
                    placeholder="e.g. 38"
                    placeholderTextColor="#666666"
                  />
                </>
              )}
              
              <Text style={styles.modalLabel}>Measurement Date</Text>
              <TextInput
                style={styles.modalInput}
                value={measurementDate}
                onChangeText={setMeasurementDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666666"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowBodyFatModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleUpdateBodyFatMeasurements}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.modalSaveText}>Calculate & Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  chartCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    paddingBottom: 20,
    marginBottom: 20,
  },
  chartMonthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 5,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    marginLeft: -15,
    borderRadius: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    minHeight: 200,
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
    fontSize: 28,
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
    backgroundColor: '#333333',
    borderRadius: 3,
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00d4ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  recordButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  massBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  massItem: {
    flex: 1,
    alignItems: 'center',
  },
  massDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333333',
    marginHorizontal: 10,
  },
  massLabel: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 5,
  },
  massValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
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
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
    borderBottomColor: '#333333',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 25,
    width: width - 60,
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#00d4ff',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666666',
  },
  modalCancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#00d4ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: '#999999',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ProgressScreen;
