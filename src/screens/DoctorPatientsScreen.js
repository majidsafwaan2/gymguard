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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DoctorPatientsScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    if (!userProfile?.uid) return;
    
    try {
      setLoading(true);
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

        // Fetch latest pain form
        const painFormsQuery = query(
          collection(db, 'painForms'),
          where('patientId', '==', docSnap.id),
          orderBy('date', 'desc')
        );
        
        const painFormsSnapshot = await getDocs(painFormsQuery);
        if (!painFormsSnapshot.empty) {
          const latestPainForm = painFormsSnapshot.docs[0].data();
          patientData.latestPainLevel = latestPainForm.painLevel;
          patientData.latestPainDate = latestPainForm.date;
        }
        
        patientsData.push(patientData);
      }
      
      // Sort by most recent activity
      patientsData.sort((a, b) => {
        const dateA = new Date(a.latestPainDate || a.latestScoreDate || 0);
        const dateB = new Date(b.latestPainDate || b.latestScoreDate || 0);
        return dateB - dateA;
      });
      
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
      Alert.alert('Error', 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPatients();
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

  const getPainLevelColor = (level) => {
    if (!level) return '#666666';
    if (level <= 3) return '#4CAF50';
    if (level <= 6) return '#FFC107';
    return '#F44336';
  };

  const getFilteredPatients = () => {
    if (!searchQuery.trim()) return patients;
    
    const query = searchQuery.toLowerCase();
    return patients.filter(patient => 
      patient.fullName?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query)
    );
  };

  const filteredPatients = getFilteredPatients();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading patients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Patients</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('DoctorPainForms')}
        >
          <Ionicons name="document-text" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#333333" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#333333" />
          </TouchableOpacity>
        )}
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
        {/* Patients Count */}
        <View style={styles.countBadge}>
          <Ionicons name="people" size={18} color="#00d4ff" />
          <Text style={styles.countText}>
            {filteredPatients.length} Patient{filteredPatients.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={searchQuery ? 'search-outline' : 'people-outline'} size={64} color="#666666" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No Results' : 'No Patients Yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? `No patients found matching "${searchQuery}"`
                : 'Patients who add your email during signup will appear here once you accept their request.'}
            </Text>
          </View>
        ) : (
          filteredPatients.map((patient) => (
            <View key={patient.id} style={styles.patientCard}>
              {/* Patient Header */}
              <View style={styles.patientHeader}>
                <View style={styles.patientAvatar}>
                  <Ionicons name="person" size={28} color="#00d4ff" />
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{patient.fullName}</Text>
                  <Text style={styles.patientEmail}>{patient.email}</Text>
                </View>
              </View>

              {/* Patient Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="fitness" size={18} color="#4CAF50" />
                  </View>
                  <Text style={styles.statLabel}>Form Score</Text>
                  <Text style={styles.statValue}>
                    {patient.latestFormScore !== undefined ? patient.latestFormScore : '--'}
                  </Text>
                  <Text style={styles.statDate}>{formatDate(patient.latestScoreDate)}</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                    <Ionicons name="warning" size={18} color="#FFC107" />
                  </View>
                  <Text style={styles.statLabel}>Pain Level</Text>
                  <Text style={[styles.statValue, { color: getPainLevelColor(patient.latestPainLevel) }]}>
                    {patient.latestPainLevel !== undefined ? `${patient.latestPainLevel}/10` : '--'}
                  </Text>
                  <Text style={styles.statDate}>{formatDate(patient.latestPainDate)}</Text>
                </View>
              </View>

              {/* Last Activity */}
              {(patient.latestScoreDate || patient.latestPainDate) && (
                <View style={styles.activityBanner}>
                  <Ionicons name="time-outline" size={16} color="#666666" />
                  <Text style={styles.activityText}>
                    Last activity: {formatDate(patient.latestPainDate || patient.latestScoreDate)}
                  </Text>
                </View>
              )}

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate('WorkoutAssignment', { patientId: patient.id })}
                >
                  <Ionicons name="add-circle" size={20} color="#00d4ff" />
                  <Text style={styles.quickActionText}>Assign</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate('InjuryTimeline', { patientId: patient.id })}
                >
                  <Ionicons name="trending-up" size={20} color="#00d4ff" />
                  <Text style={styles.quickActionText}>Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    // Navigate to a patient detail view (can be implemented)
                    Alert.alert('Coming Soon', 'Patient detail view is in development');
                  }}
                >
                  <Ionicons name="information-circle" size={20} color="#00d4ff" />
                  <Text style={styles.quickActionText}>Details</Text>
                </TouchableOpacity>
              </View>
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
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 14,
    color: '#666666',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statDate: {
    fontSize: 11,
    color: '#666666',
  },
  activityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityText: {
    fontSize: 13,
    color: '#666666',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DoctorPatientsScreen;

