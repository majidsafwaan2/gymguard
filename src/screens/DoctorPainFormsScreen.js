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
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DoctorPainFormsScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const [painForms, setPainForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'high_pain'
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    fetchPainForms();
  }, []);

  const fetchPainForms = async () => {
    try {
      setLoading(true);
      const formsQuery = query(
        collection(db, 'painForms'),
        where('doctorId', '==', userProfile.uid),
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
      Alert.alert('Error', 'Failed to load pain forms');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPainForms();
    setRefreshing(false);
  };

  const markAsRead = async (formId) => {
    try {
      await updateDoc(doc(db, 'painForms', formId), {
        status: 'read',
      });
      
      // Update local state
      setPainForms(prev => 
        prev.map(form => form.id === formId ? { ...form, status: 'read' } : form)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteForm = async (formId) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this pain form?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'painForms', formId));
              setPainForms(prev => prev.filter(form => form.id !== formId));
              Alert.alert('Success', 'Pain form deleted');
            } catch (error) {
              console.error('Error deleting form:', error);
              Alert.alert('Error', 'Failed to delete form');
            }
          }
        }
      ]
    );
  };

  const handleFormPress = async (form) => {
    if (form.status === 'unread') {
      await markAsRead(form.id);
    }
    setSelectedForm(form);
  };

  const getPainLevelColor = (level) => {
    if (level <= 3) return '#4CAF50';
    if (level <= 6) return '#FFC107';
    return '#F44336';
  };

  const getPainLevelEmoji = (level) => {
    if (level <= 2) return '😊';
    if (level <= 4) return '🙂';
    if (level <= 6) return '😐';
    if (level <= 8) return '😟';
    return '😣';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredForms = () => {
    let filtered = painForms;
    
    if (filter === 'unread') {
      filtered = painForms.filter(form => form.status === 'unread');
    } else if (filter === 'high_pain') {
      filtered = painForms.filter(form => form.painLevel >= 7);
    }
    
    return filtered;
  };

  const getStats = () => {
    const unreadCount = painForms.filter(f => f.status === 'unread').length;
    const highPainCount = painForms.filter(f => f.painLevel >= 7).length;
    const avgPain = painForms.length > 0
      ? (painForms.reduce((sum, f) => sum + f.painLevel, 0) / painForms.length).toFixed(1)
      : 0;
    
    return { unreadCount, highPainCount, avgPain };
  };

  const filteredForms = getFilteredForms();
  const stats = getStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading pain forms...</Text>
      </View>
    );
  }

  // Detail View Modal
  if (selectedForm) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedForm(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pain Form Details</Text>
          <TouchableOpacity 
            style={styles.deleteIconButton}
            onPress={() => {
              setSelectedForm(null);
              handleDeleteForm(selectedForm.id);
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Patient Info */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Ionicons name="person-circle" size={50} color="#00d4ff" />
              <View style={styles.detailHeaderInfo}>
                <Text style={styles.detailPatientName}>{selectedForm.patientName}</Text>
                <Text style={styles.detailPatientEmail}>{selectedForm.patientEmail}</Text>
                <Text style={styles.detailDate}>{formatDate(selectedForm.date)}</Text>
              </View>
            </View>
          </View>

          {/* Pain Level */}
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Pain Level</Text>
            <View style={styles.painLevelDisplay}>
              <Text style={styles.painLevelEmoji}>{getPainLevelEmoji(selectedForm.painLevel)}</Text>
              <View style={[styles.painLevelBadge, { backgroundColor: getPainLevelColor(selectedForm.painLevel) }]}>
                <Text style={styles.painLevelBadgeText}>{selectedForm.painLevel}/10</Text>
              </View>
            </View>
            <View style={styles.painLevelBar}>
              <View 
                style={[
                  styles.painLevelBarFill, 
                  { 
                    width: `${selectedForm.painLevel * 10}%`,
                    backgroundColor: getPainLevelColor(selectedForm.painLevel)
                  }
                ]} 
              />
            </View>
            <Text style={styles.painLevelDesc}>
              {selectedForm.painLevel <= 3 && 'Mild - Doesn\'t interfere with activities'}
              {selectedForm.painLevel > 3 && selectedForm.painLevel <= 6 && 'Moderate - Makes some activities difficult'}
              {selectedForm.painLevel > 6 && selectedForm.painLevel <= 8 && 'Severe - Significantly limits activities'}
              {selectedForm.painLevel > 8 && 'Extreme - Unable to perform activities'}
            </Text>
          </View>

          {/* Pain Details */}
          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Pain Details</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="location" size={20} color="#00d4ff" />
                <View style={styles.detailItemContent}>
                  <Text style={styles.detailItemLabel}>Location</Text>
                  <Text style={styles.detailItemValue}>{selectedForm.location}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="pulse" size={20} color="#00d4ff" />
                <View style={styles.detailItemContent}>
                  <Text style={styles.detailItemLabel}>Type</Text>
                  <Text style={styles.detailItemValue}>{selectedForm.painType}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Notes */}
          {selectedForm.notes && (
            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Additional Details</Text>
              <Text style={styles.notesText}>{selectedForm.notes}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedForm(null);
                navigation.navigate('DoctorProgress', { patientId: selectedForm.patientId });
              }}
            >
              <Ionicons name="trending-up" size={20} color="#00d4ff" />
              <Text style={styles.actionButtonText}>View Patient Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedForm(null);
                navigation.navigate('WorkoutAssignment', { patientId: selectedForm.patientId });
              }}
            >
              <Ionicons name="fitness" size={20} color="#00d4ff" />
              <Text style={styles.actionButtonText}>Assign Workout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // List View
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pain Forms</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="mail-unread" size={20} color="#FFC107" />
          <Text style={styles.statValue}>{stats.unreadCount}</Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="alert-circle" size={20} color="#F44336" />
          <Text style={styles.statValue}>{stats.highPainCount}</Text>
          <Text style={styles.statLabel}>High Pain</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="analytics" size={20} color="#00d4ff" />
          <Text style={styles.statValue}>{stats.avgPain}</Text>
          <Text style={styles.statLabel}>Avg Pain</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({painForms.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            Unread ({stats.unreadCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'high_pain' && styles.filterButtonActive]}
          onPress={() => setFilter('high_pain')}
        >
          <Text style={[styles.filterText, filter === 'high_pain' && styles.filterTextActive]}>
            High Pain ({stats.highPainCount})
          </Text>
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
        {filteredForms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#666666" />
            <Text style={styles.emptyStateTitle}>No Pain Forms</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all'
                ? 'You haven\'t received any pain tracking forms yet. Your patients can send them from their app.'
                : filter === 'unread'
                ? 'All caught up! No unread pain forms.'
                : 'No high pain level forms at this time.'}
            </Text>
          </View>
        ) : (
          filteredForms.map((form) => (
            <TouchableOpacity
              key={form.id}
              style={[
                styles.formCard,
                form.status === 'unread' && styles.formCardUnread,
                form.painLevel >= 7 && styles.formCardHighPain,
              ]}
              onPress={() => handleFormPress(form)}
            >
              <View style={styles.formCardHeader}>
                <View style={styles.formCardPatient}>
                  <Ionicons name="person-circle" size={40} color="#00d4ff" />
                  <View style={styles.formCardPatientInfo}>
                    <View style={styles.formCardTitleRow}>
                      <Text style={styles.formCardPatientName}>{form.patientName}</Text>
                      {form.status === 'unread' && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.formCardDate}>{formatDate(form.date)}</Text>
                  </View>
                </View>
                <View style={[styles.painChip, { backgroundColor: getPainLevelColor(form.painLevel) }]}>
                  <Text style={styles.painChipEmoji}>{getPainLevelEmoji(form.painLevel)}</Text>
                  <Text style={styles.painChipText}>{form.painLevel}</Text>
                </View>
              </View>

              <View style={styles.formCardDetails}>
                <View style={styles.formCardDetail}>
                  <Ionicons name="location-outline" size={16} color="#666666" />
                  <Text style={styles.formCardDetailText}>{form.location}</Text>
                </View>
                <View style={styles.formCardDetail}>
                  <Ionicons name="pulse-outline" size={16} color="#666666" />
                  <Text style={styles.formCardDetailText}>{form.painType}</Text>
                </View>
              </View>

              {form.notes && (
                <Text style={styles.formCardNotes} numberOfLines={2}>
                  {form.notes}
                </Text>
              )}

              <View style={styles.formCardFooter}>
                <TouchableOpacity
                  style={styles.formCardAction}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteForm(form.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#F44336" />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color="#333333" />
              </View>
            </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  deleteIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00d4ff',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  filterTextActive: {
    color: '#00d4ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formCard: {
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
  formCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  formCardHighPain: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  formCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formCardPatient: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  formCardPatientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  formCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formCardPatientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4ff',
  },
  formCardDate: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  painChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  painChipEmoji: {
    fontSize: 16,
  },
  painChipText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formCardDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  formCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  formCardDetailText: {
    fontSize: 14,
    color: '#cccccc',
  },
  formCardNotes: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 10,
  },
  formCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  formCardAction: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Detail View Styles
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailHeaderInfo: {
    marginLeft: 15,
    flex: 1,
  },
  detailPatientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  detailPatientEmail: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 4,
  },
  detailDate: {
    fontSize: 13,
    color: '#999999',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  painLevelDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  painLevelEmoji: {
    fontSize: 60,
  },
  painLevelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  painLevelBadgeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  painLevelBar: {
    height: 12,
    backgroundColor: '#333333',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  painLevelBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  painLevelDesc: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 15,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailItemContent: {
    flex: 1,
  },
  detailItemLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  detailItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  notesText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    gap: 10,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 15,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
  },
});

export default DoctorPainFormsScreen;

