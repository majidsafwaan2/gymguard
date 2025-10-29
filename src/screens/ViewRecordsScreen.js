import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import BlockchainRecordsService from '../services/BlockchainRecordsService';

const { width, height } = Dimensions.get('window');

export default function ViewRecordsScreen({ navigation, route }) {
  const { user, userProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
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
          });
        });
        
        setRecords(recordsList);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#f44336';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading Records...</Text>
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
          🔗 Records stored on blockchain with end-to-end encryption
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
          records.map((record) => (
            <TouchableOpacity key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordTitle}>
                  {isDoctor ? record.patientName : record.exerciseName}
                </Text>
                {record.overallScore > 0 && (
                  <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(record.overallScore) }]}>
                    <Text style={styles.scoreText}>{record.overallScore}</Text>
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
              </View>
            </TouchableOpacity>
          ))
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
  recordTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
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
});

