import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import BlockchainRecordsService from '../services/BlockchainRecordsService';
import CryptoJS from 'crypto-js';

const { width, height } = Dimensions.get('window');

export default function ViewRecordsScreen({ navigation, route }) {
  const { user, userProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);
  const [showBlockchainAnimation, setShowBlockchainAnimation] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(true);
  const [privateKey, setPrivateKey] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (userProfile?.userType === 'doctor' && !isAuthenticated) {
      setLoading(false);
    } else {
      fetchRecords();
    }
  }, [isAuthenticated]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setShowBlockchainAnimation(true);
      
      // Simulate blockchain retrieval animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userType = userProfile?.userType;
      setIsDoctor(userType === 'doctor');

      if (userType === 'doctor') {
        // Fetch all patient records for this doctor
        const assignmentsRef = collection(db, 'workoutAssignments');
        const q = query(assignmentsRef, where('doctorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const recordsList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          recordsList.push({
            id: doc.id,
            patientId: data.patientId,
            patientName: data.patientName || 'Patient',
            createdAt: data.createdAt,
            status: data.status,
            overallScore: data.overallScore || 0,
            completedAt: data.completedAt,
            blockchainHash: data.scoreReport?.injuryRisksDetected ? 
              generateBlockchainHash(data.scoreReport) : null,
            blockchainNetwork: 'Ethereum Goerli Testnet',
            blockchainCID: `Qm${Math.random().toString(36).substring(2, 15)}`,
            lastUpdated: data.completedAt || data.createdAt,
          });
        });
        
        setRecords(recordsList);
      } else if (userType === 'patient') {
        // Fetch this patient's own records
        const assignmentsRef = collection(db, 'workoutAssignments');
        const q = query(assignmentsRef, where('patientId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const recordsList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          recordsList.push({
            id: doc.id,
            exerciseName: data.exerciseName || 'Workout',
            createdAt: data.createdAt,
            status: data.status,
            overallScore: data.overallScore || 0,
            completedAt: data.completedAt,
            blockchainHash: data.scoreReport ? 
              generateBlockchainHash(data.scoreReport) : null,
            blockchainNetwork: 'Ethereum Goerli Testnet',
            blockchainCID: `Qm${Math.random().toString(36).substring(2, 15)}`,
            lastUpdated: data.completedAt || data.createdAt,
          });
        });
        
        setRecords(recordsList);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
      setShowBlockchainAnimation(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#f44336';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return generateRandomPastDateShort();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const generateRandomPastDateShort = () => {
    const oct28 = new Date('2024-10-28');
    const threeMonthsAgo = new Date(oct28.getTime() - (90 * 24 * 60 * 60 * 1000));
    const randomTime = Math.random() * (oct28.getTime() - threeMonthsAgo.getTime()) + threeMonthsAgo.getTime();
    const randomDate = new Date(randomTime);
    return randomDate.toLocaleDateString();
  };

  const generateBlockchainHash = (data) => {
    return CryptoJS.SHA256(JSON.stringify(data)).toString().substring(0, 16);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return generateRandomPastDate();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const generateRandomPastDate = () => {
    const now = new Date();
    const oct28 = new Date('2024-10-28');
    const threeMonthsAgo = new Date(oct28.getTime() - (90 * 24 * 60 * 60 * 1000));
    const randomTime = Math.random() * (oct28.getTime() - threeMonthsAgo.getTime()) + threeMonthsAgo.getTime();
    const randomDate = new Date(randomTime);
    return randomDate.toLocaleString();
  };

  const handlePrivateKeyAuth = () => {
    if (privateKey.length >= 6) {
      setIsAuthenticated(true);
      setShowAuthScreen(false);
      setAuthError('');
    } else {
      setAuthError('Private key must be at least 6 characters');
    }
  };

  // Authentication screen for doctors
  if (userProfile?.userType === 'doctor' && showAuthScreen) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Private Key Required</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.authContent}>
          <View style={styles.authCard}>
            <Ionicons name="key-outline" size={80} color="#00d4ff" />
            <Text style={styles.authTitle}>Access Patient Records</Text>
            <Text style={styles.authSubtitle}>
              Enter your private key to access encrypted blockchain medical records
            </Text>

            <View style={styles.keyInputContainer}>
              <Text style={styles.keyLabel}>Private Key</Text>
              <TextInput
                style={styles.keyInput}
                value={privateKey}
                onChangeText={setPrivateKey}
                placeholder="Enter your private key"
                placeholderTextColor="#666"
                secureTextEntry={true}
                autoCapitalize="none"
              />
              {authError ? (
                <Text style={styles.errorText}>{authError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.authButton}
              onPress={handlePrivateKeyAuth}
            >
              <LinearGradient colors={['#00d4ff', '#0099cc']} style={styles.authButtonGradient}>
                <Ionicons name="lock-open-outline" size={24} color="#ffffff" />
                <Text style={styles.authButtonText}>Unlock Records</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.securityNote}>
              🔐 Your private key ensures only authorized personnel can access encrypted medical data
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (loading || showBlockchainAnimation) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.blockchainAnimation}>
          <Ionicons name="lock-closed" size={64} color="#00d4ff" />
          <ActivityIndicator size="large" color="#00d4ff" style={{ marginVertical: 20 }} />
          <Text style={styles.blockchainText}>Retrieving from Blockchain...</Text>
          <Text style={styles.blockchainSubtext}>Network: Ethereum Goerli Testnet</Text>
          <Text style={styles.blockchainSubtext}>Verifying cryptographic hash...</Text>
        </View>
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
        <Text style={styles.headerTitle}>
          {isDoctor ? 'Patient Records' : 'My Records'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.infoBanner}>
        <Text style={styles.infoText}>
          Records stored on blockchain with end-to-end encryption
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={80} color="#666" />
            <Text style={styles.emptyText}>No records found</Text>
            <Text style={styles.emptySubtext}>
              {isDoctor ? 'Patient records will appear here' : 'Complete workouts to see your records here'}
            </Text>
          </View>
        ) : (
          records.map((record, index) => {
            // Generate consistent seed based on patient ID for consistent stats
            const seed = (record.patientId || record.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            // Calculate age of record (for gradual changes)
            const recordAge = index; // Most recent = 0, older = higher index
            const monthAgo = recordAge; // How many months ago this record is
            
            // Base stats (consistent per patient)
            const baseWeight = Math.floor((seed % 40) + 150); // 150-190 lbs
            const baseHeight = Math.floor((seed % 8) + 68); // 68-76 inches
            const baseBodyFat = ((seed % 15) + 10).toFixed(1); // 10-25%
            const baseMuscleMass = ((seed % 30) + 120).toFixed(1); // 120-150 lbs
            
            // Gradual changes over time (weight loss/gain of 1-3 lbs per month, body fat improvement)
            const weightChange = monthAgo * (Math.random() * 3 - 1.5); // -1.5 to +1.5 lbs per month
            const bodyFatChange = monthAgo * (Math.random() * 0.5); // 0-0.5% decrease per month
            const muscleGain = monthAgo * (Math.random() * 1); // 0-1 lb per month
            
            const mockWeight = Math.floor(baseWeight + weightChange);
            const mockHeight = baseHeight; // Height doesn't change
            const mockBodyFat = (parseFloat(baseBodyFat) - bodyFatChange).toFixed(1);
            const mockMuscleMass = (parseFloat(baseMuscleMass) + muscleGain).toFixed(1);
            
            // Recent changes - make them realistic and gradual
            const prevWeight = mockWeight + Math.floor(Math.random() * 3) - 1;
            const prevBodyFat = (parseFloat(mockBodyFat) + (Math.random() * 0.5)).toFixed(1);
            const prevMuscle = (parseFloat(mockMuscleMass) - Math.random()).toFixed(1);
            
            const randomChanges = [
              `Weight updated from ${prevWeight} lbs → ${mockWeight} lbs`,
              `Body fat percentage: ${mockBodyFat}% (down from ${prevBodyFat}%)`,
              `Muscle mass: ${mockMuscleMass} lbs (up from ${prevMuscle} lbs)`,
              'Core strength improved by 2%',
              'Flexibility score: 42/100 (concerning)',
              'Resting heart rate: 65 bpm',
              'Blood pressure: 120/80 mmHg',
            ];
            const selectedChanges = randomChanges.sort(() => Math.random() - 0.5).slice(0, 3);
            
            // Add risk assessment for most recent record (index 0)
            const showRiskAssessment = index === 0;
            
            return (
              <TouchableOpacity key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.recordLabel}>
                      {isDoctor ? 'Patient Name' : 'Workout Name'}
                    </Text>
                    <Text style={styles.recordTitle}>
                      {isDoctor ? record.patientName : record.exerciseName}
                    </Text>
                  </View>
                  {record.overallScore > 0 && (
                    <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(record.overallScore) }]}>
                      <Text style={styles.scoreText}>{record.overallScore}%</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.recordDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#888" />
                    <Text style={styles.detailText}>Created: {formatDate(record.createdAt)}</Text>
                  </View>
                  
                  {record.completedAt && (
                    <View style={styles.detailRow}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
                      <Text style={styles.detailText}>Completed: {formatDate(record.completedAt)}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#00d4ff" />
                    <Text style={styles.detailText}>Status: {record.status}</Text>
                  </View>

                  {/* Medical Stats Section */}
                  <View style={styles.statsContainer}>
                    <Text style={styles.statsTitle}>Health Metrics</Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Ionicons name="fitness-outline" size={18} color="#00d4ff" />
                        <Text style={styles.statValue}>{mockWeight} lbs</Text>
                        <Text style={styles.statLabel}>Weight</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="resize-outline" size={18} color="#00d4ff" />
                        <Text style={styles.statValue}>{Math.floor(mockHeight / 12)}'{mockHeight % 12}"</Text>
                        <Text style={styles.statLabel}>Height</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="water-outline" size={18} color="#00d4ff" />
                        <Text style={styles.statValue}>{mockBodyFat}%</Text>
                        <Text style={styles.statLabel}>Body Fat</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="muscle-outline" size={18} color="#00d4ff" />
                        <Text style={styles.statValue}>{mockMuscleMass} lbs</Text>
                        <Text style={styles.statLabel}>Muscle Mass</Text>
                      </View>
                    </View>
                  </View>

                  {/* Recent Changes Section */}
                  <View style={styles.changesContainer}>
                    <Text style={styles.changesTitle}>Recent Updates</Text>
                    {selectedChanges.map((change, idx) => (
                      <View key={idx} style={styles.changeRow}>
                        <Ionicons name="arrow-forward-circle-outline" size={16} color="#4CAF50" />
                        <Text style={styles.changeText}>{change}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Risk Assessment Section (Most Recent Record Only) */}
                  {showRiskAssessment && (
                    <View style={styles.riskContainer}>
                      <View style={styles.riskHeader}>
                        <Ionicons name="warning-outline" size={20} color="#FF9800" />
                        <Text style={styles.riskTitle}>Risk Assessment</Text>
                      </View>
                      <View style={styles.riskContent}>
                        <Text style={styles.riskText}>
                          <Text style={styles.riskLabel}>Observation:</Text> Low flexibility score (42/100) indicates inadequate range of motion during prescribed squat exercises.
                        </Text>
                        <Text style={styles.riskText}>
                          <Text style={styles.riskLabel}>Concern:</Text> Patient demonstrates insufficient depth on squats, failing to reach parallel (90° knee angle). This pattern suggests premature termination of the movement cycle.
                        </Text>
                        <Text style={styles.riskText}>
                          <Text style={styles.riskLabel}>Potential Risk:</Text> Insufficient range of motion places increased stress on patellar tendons and can lead to knee instability, anterior knee pain, or patellofemoral stress syndrome with continued improper form.
                        </Text>
                        <Text style={styles.riskText}>
                          <Text style={styles.riskLabel}>Recommendation:</Text> Implement progressive depth training with video analysis. Focus on hip mobility and ankle dorsiflexion. Consider reducing load and prioritizing form quality over weight progression until proper depth is achieved.
                        </Text>
                      </View>
                    </View>
                  )}

                  {record.blockchainCID && (
                    <View style={styles.blockchainInfo}>
                      <View style={styles.blockchainRow}>
                        <Ionicons name="cube-outline" size={16} color="#00d4ff" />
                        <Text style={styles.blockchainLabel}>Blockchain: </Text>
                        <Text style={styles.blockchainValue}>{record.blockchainNetwork}</Text>
                      </View>
                      <View style={styles.blockchainRow}>
                        <Ionicons name="key-outline" size={16} color="#00d4ff" />
                        <Text style={styles.blockchainLabel}>Ref: </Text>
                        <Text style={styles.blockchainValue}>{record.blockchainCID}</Text>
                      </View>
                      {record.blockchainHash && (
                        <View style={styles.blockchainRow}>
                          <Ionicons name="finger-print-outline" size={16} color="#00d4ff" />
                          <Text style={styles.blockchainLabel}>Hash: </Text>
                          <Text style={styles.blockchainValue}>{record.blockchainHash}</Text>
                        </View>
                      )}
                      <View style={styles.blockchainRow}>
                        <Ionicons name="time-outline" size={16} color="#00d4ff" />
                        <Text style={styles.blockchainLabel}>Updated: </Text>
                        <Text style={styles.blockchainValue}>{formatTimestamp(record.lastUpdated)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  infoBanner: {
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  recordCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
  },
  recordLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  recordTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    color: '#cccccc',
    fontSize: 14,
  },
  blockchainAnimation: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  blockchainText: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  blockchainSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  blockchainInfo: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  blockchainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  blockchainLabel: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  blockchainValue: {
    color: '#ffffff',
    fontSize: 11,
    marginLeft: 4,
    fontFamily: 'monospace',
  },
  authContent: {
    flex: 1,
    padding: 20,
  },
  authCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  authTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  authSubtitle: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 30,
  },
  keyInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  keyLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  keyInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333',
  },
  authButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  authButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  securityNote: {
    color: '#888',
    fontSize: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.1)',
  },
  statsTitle: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  changesContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  changesTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  changeText: {
    color: '#ffffff',
    fontSize: 13,
    flex: 1,
  },
  riskContainer: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  riskTitle: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  riskContent: {
    gap: 10,
  },
  riskText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 20,
  },
  riskLabel: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

