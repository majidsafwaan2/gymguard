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
  Dimensions,
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

const { width } = Dimensions.get('window');

const DoctorDashboardScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const [patients, setPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [painForms, setPainForms] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPatients(), 
        fetchPendingRequests(),
        fetchPainForms(),
        fetchRecentActivity()
      ]);
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

  const fetchPainForms = async () => {
    if (!userProfile?.uid) return;
    
    try {
      const formsQuery = query(
        collection(db, 'painForms'),
        where('doctorId', '==', userProfile.uid),
        where('status', '==', 'unread'),
        orderBy('date', 'desc')
      );
      
      const formsSnapshot = await getDocs(formsQuery);
      const formsData = formsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setPainForms(formsData);
    } catch (error) {
      console.error('Error fetching pain forms:', error);
    }
  };

  const fetchRecentActivity = async () => {
    if (!userProfile?.uid) return;
    
    try {
      const activities = [];
      
      // Fetch recent injury pictures
      const picturesQuery = query(
        collection(db, 'injuryPictures'),
        where('doctorId', '==', userProfile.uid),
        orderBy('uploadedAt', 'desc')
      );
      
      const picturesSnapshot = await getDocs(picturesQuery);
      picturesSnapshot.docs.slice(0, 5).forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'picture',
          patientName: data.patientName,
          date: data.uploadedAt,
          icon: 'images',
          color: '#00d4ff',
        });
      });

      // Fetch recent pain forms
      const recentFormsQuery = query(
        collection(db, 'painForms'),
        where('doctorId', '==', userProfile.uid),
        orderBy('date', 'desc')
      );
      
      const recentFormsSnapshot = await getDocs(recentFormsQuery);
      recentFormsSnapshot.docs.slice(0, 5).forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'pain_form',
          patientName: data.patientName,
          date: data.date,
          painLevel: data.painLevel,
          icon: 'warning',
          color: data.painLevel >= 7 ? '#F44336' : '#FFC107',
        });
      });

      // Sort by date and limit to 8 most recent
      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentActivity(activities.slice(0, 8));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
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
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  const getHighPainCount = () => {
    return painForms.filter(form => form.painLevel >= 7).length;
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
        <View>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerTitle}>Dr. {userProfile?.fullName?.split(' ')[0] || 'Doctor'}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('ViewRecords')}
          >
            <Ionicons name="shield-checkmark" size={22} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('DoctorInbox')}
          >
            <Ionicons name="mail-outline" size={22} color="#333333" />
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statCardLarge, { backgroundColor: '#00d4ff' }]}
            onPress={() => navigation.navigate('Patients')}
          >
            <View style={styles.statCardLargeContent}>
              <Ionicons name="people" size={32} color="#ffffff" />
              <View style={styles.statCardLargeInfo}>
                <Text style={styles.statCardLargeValue}>{patients.length}</Text>
                <Text style={styles.statCardLargeLabel}>Active Patients</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={[styles.statCardSmall, { backgroundColor: '#FFC107' }]}
              onPress={() => navigation.navigate('DoctorInbox')}
            >
              <Ionicons name="mail" size={24} color="#ffffff" />
              <Text style={styles.statCardSmallValue}>{pendingRequests.length}</Text>
              <Text style={styles.statCardSmallLabel}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCardSmall, { backgroundColor: '#F44336' }]}
              onPress={() => navigation.navigate('DoctorPainForms')}
            >
              <Ionicons name="warning" size={24} color="#ffffff" />
              <Text style={styles.statCardSmallValue}>{getHighPainCount()}</Text>
              <Text style={styles.statCardSmallLabel}>High Pain</Text>
            </TouchableOpacity>
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Patients')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(0, 212, 255, 0.1)' }]}>
                <Ionicons name="people" size={24} color="#00d4ff" />
              </View>
              <Text style={styles.quickActionText}>View All Patients</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('DoctorPainForms')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                <Ionicons name="document-text" size={24} color="#FFC107" />
              </View>
              <Text style={styles.quickActionText}>Pain Forms</Text>
              {painForms.length > 0 && (
                <View style={styles.quickActionBadge}>
                  <Text style={styles.quickActionBadgeText}>{painForms.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('ViewRecords')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Records</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorInbox')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity.length === 0 ? (
            <View style={styles.emptyActivityState}>
              <Ionicons name="pulse-outline" size={40} color="#666666" />
              <Text style={styles.emptyActivityText}>No recent activity</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                    <Ionicons name={activity.icon} size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {activity.type === 'picture' ? 'New Progress Photo' : 'Pain Form Submitted'}
                    </Text>
                    <Text style={styles.activitySubtitle}>
                      {activity.patientName}
                      {activity.painLevel && ` • Pain: ${activity.painLevel}/10`}
                    </Text>
                  </View>
                  <Text style={styles.activityTime}>{formatDate(activity.date)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: '#ffffff',
  },
  headerGreeting: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerIconButton: {
    position: 'relative',
    width: 44,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
  statsGrid: {
    marginTop: 25,
    marginBottom: 25,
  },
  statCardLarge: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardLargeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statCardLargeInfo: {
    gap: 4,
  },
  statCardLargeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statCardLargeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statCardSmall: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statCardSmallValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statCardSmallLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '600',
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333333',
    marginBottom: 4,
  },
  requestEmail: {
    fontSize: 14,
    color: '#666666',
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
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333333',
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 14,
    color: '#666666',
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
    color: '#333333',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
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
    position: 'relative',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  quickActionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  quickActionBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#999999',
  },
  activityTime: {
    fontSize: 12,
    color: '#666666',
  },
  emptyActivityState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyActivityText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 10,
  },
});

export default DoctorDashboardScreen;

