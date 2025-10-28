import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DoctorDashboardScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const [patients, setPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPatients(), fetchPendingRequests()]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    if (!userProfile?.uid) return;
    
    try {
      // Query patients where doctorId matches current doctor and status is accepted
      const patientsQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'patient'),
        where('doctorId', '==', userProfile.uid),
        where('doctorStatus', '==', 'accepted')
      );
      
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsData = [];
      
      for (const docSnap of patientsSnapshot.docs) {
        const patientData = { id: docSnap.id, ...docSnap.data() };
        
        // Fetch latest form score for this patient
        const formScoresQuery = query(
          collection(db, 'formScores'),
          where('userId', '==', docSnap.id),
          orderBy('date', 'desc')
        );
        
        const formScoresSnapshot = await getDocs(formScoresQuery);
        if (!formScoresSnapshot.empty) {
          const latestScore = formScoresSnapshot.docs[0].data();
          patientData.latestFormScore = latestScore.score;
          patientData.latestScoreDate = latestScore.date;
        }
        
        patientsData.push(patientData);
      }
      
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchPendingRequests = async () => {
    if (!userProfile?.uid) return;
    
    try {
      const requestsQuery = query(
        collection(db, 'patientRequests'),
        where('doctorId', '==', userProfile.uid),
        where('status', '==', 'pending')
      );
      
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsData = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setPendingRequests(requestsData);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleAcceptRequest = async (request) => {
    try {
      // Update patient request status
      await updateDoc(doc(db, 'patientRequests', request.id), {
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
      });
      
      // Update patient's doctor status
      await updateDoc(doc(db, 'users', request.patientId), {
        doctorStatus: 'accepted',
      });
      
      // Add patient to doctor's patients array
      await updateDoc(doc(db, 'users', userProfile.uid), {
        patients: arrayUnion(request.patientId),
      });
      
      Alert.alert('Success', `${request.patientName} has been added to your patients.`);
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept patient request');
    }
  };

  const handleRejectRequest = async (request) => {
    Alert.alert(
      'Reject Patient Request',
      `Are you sure you want to reject ${request.patientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update patient request status
              await updateDoc(doc(db, 'patientRequests', request.id), {
                status: 'rejected',
                rejectedAt: new Date().toISOString(),
              });
              
              // Update patient's doctor status
              await updateDoc(doc(db, 'users', request.patientId), {
                doctorStatus: 'rejected',
                doctorId: null,
              });
              
              Alert.alert('Request Rejected', 'The patient request has been rejected.');
              
              // Refresh data
              fetchDashboardData();
            } catch (error) {
              console.error('Error rejecting request:', error);
              Alert.alert('Error', 'Failed to reject patient request');
            }
          }
        }
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctor Dashboard</Text>
        <TouchableOpacity 
          style={styles.inboxButton}
          onPress={() => navigation.navigate('DoctorInbox')}
        >
          <Ionicons name="mail-outline" size={24} color="#ffffff" />
          {pendingRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00d4ff"
            colors={["#00d4ff"]}
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#00d4ff" />
            <Text style={styles.statValue}>{patients.length}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="notifications" size={24} color="#FFC107" />
            <Text style={styles.statValue}>{pendingRequests.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestInfo}>
                  <View style={styles.requestHeader}>
                    <Ionicons name="person-circle-outline" size={40} color="#00d4ff" />
                    <View style={styles.requestDetails}>
                      <Text style={styles.requestName}>{request.patientName}</Text>
                      <Text style={styles.requestEmail}>{request.patientEmail}</Text>
                      <Text style={styles.requestDate}>
                        Requested {formatDate(request.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAcceptRequest(request)}
                  >
                    <Ionicons name="checkmark" size={20} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectRequest(request)}
                  >
                    <Ionicons name="close" size={20} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Patients List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Patients</Text>
          {patients.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#666666" />
              <Text style={styles.emptyStateTitle}>No Patients Yet</Text>
              <Text style={styles.emptyStateText}>
                Patients who add your email during signup will appear here once you accept their request.
              </Text>
            </View>
          ) : (
            patients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                onPress={() => navigation.navigate('PatientDetails', { patientId: patient.id })}
              >
                <View style={styles.patientHeader}>
                  <Ionicons name="person-circle" size={50} color="#00d4ff" />
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.fullName}</Text>
                    <Text style={styles.patientEmail}>{patient.email}</Text>
                  </View>
                  {patient.latestFormScore !== undefined && (
                    <View style={[styles.scoreChip, { backgroundColor: getScoreColor(patient.latestFormScore) }]}>
                      <Text style={styles.scoreText}>{patient.latestFormScore}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.patientStats}>
                  <View style={styles.patientStat}>
                    <Ionicons name="fitness-outline" size={16} color="#cccccc" />
                    <Text style={styles.patientStatText}>
                      Last activity: {formatDate(patient.latestScoreDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.patientActions}>
                  <TouchableOpacity 
                    style={styles.patientActionButton}
                    onPress={() => navigation.navigate('WorkoutAssignment', { patientId: patient.id })}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#00d4ff" />
                    <Text style={styles.patientActionText}>Assign Workout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.patientActionButton}
                    onPress={() => navigation.navigate('InjuryTimeline', { patientId: patient.id })}
                  >
                    <Ionicons name="images-outline" size={18} color="#00d4ff" />
                    <Text style={styles.patientActionText}>View Progress</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  inboxButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  requestCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  requestInfo: {
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestDetails: {
    flex: 1,
    marginLeft: 15,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  requestEmail: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#999999',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  patientCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientInfo: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 14,
    color: '#cccccc',
  },
  scoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientStats: {
    marginBottom: 15,
  },
  patientStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientStatText: {
    fontSize: 14,
    color: '#cccccc',
  },
  patientActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  patientActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    gap: 6,
  },
  patientActionText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DoctorDashboardScreen;

