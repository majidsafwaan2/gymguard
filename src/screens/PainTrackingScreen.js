import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const PainTrackingScreen = ({ navigation }) => {
  const { user } = useUser();
  const [painLogs, setPainLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields for new pain log
  const [painLevel, setPainLevel] = useState(5);
  const [location, setLocation] = useState('');
  const [painType, setPainType] = useState('Sharp');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const painTypes = ['Sharp', 'Dull', 'Aching', 'Burning', 'Throbbing', 'Stabbing'];
  const commonLocations = [
    'Lower Back', 'Upper Back', 'Neck', 'Shoulder', 'Elbow', 
    'Wrist', 'Hip', 'Knee', 'Ankle', 'Foot'
  ];

  useEffect(() => {
    fetchPainLogs();
  }, []);

  const fetchPainLogs = async () => {
    try {
      setLoading(true);
      const logsQuery = query(
        collection(db, 'painLogs'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      
      const logsSnapshot = await getDocs(logsQuery);
      const logsData = logsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setPainLogs(logsData);
    } catch (error) {
      console.error('Error fetching pain logs:', error);
      Alert.alert('Error', 'Failed to load pain logs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPainLog = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please specify pain location');
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'painLogs'), {
        userId: user.uid,
        painLevel: painLevel,
        location: location.trim(),
        painType: painType,
        notes: notes.trim(),
        date: new Date().toISOString(),
      });

      Alert.alert('Success', 'Pain log added successfully');
      
      // Reset form
      setPainLevel(5);
      setLocation('');
      setPainType('Sharp');
      setNotes('');
      setShowAddModal(false);
      
      // Refresh logs
      fetchPainLogs();
    } catch (error) {
      console.error('Error adding pain log:', error);
      Alert.alert('Error', 'Failed to add pain log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this pain log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'painLogs', logId));
              fetchPainLogs();
              Alert.alert('Success', 'Pain log deleted');
            } catch (error) {
              console.error('Error deleting log:', error);
              Alert.alert('Error', 'Failed to delete log');
            }
          }
        }
      ]
    );
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAveragePainLevel = () => {
    if (painLogs.length === 0) return 0;
    const sum = painLogs.reduce((acc, log) => acc + log.painLevel, 0);
    return (sum / painLogs.length).toFixed(1);
  };

  const getRecentTrend = () => {
    if (painLogs.length < 2) return 'No trend data';
    const recent = painLogs.slice(0, 3);
    const older = painLogs.slice(3, 6);
    
    if (older.length === 0) return 'Need more data';
    
    const recentAvg = recent.reduce((acc, log) => acc + log.painLevel, 0) / recent.length;
    const olderAvg = older.reduce((acc, log) => acc + log.painLevel, 0) / older.length;
    
    if (recentAvg < olderAvg - 0.5) return '📉 Improving';
    if (recentAvg > olderAvg + 0.5) return '📈 Worsening';
    return '➡️ Stable';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading pain logs...</Text>
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
        <Text style={styles.headerTitle}>Pain Tracker</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Pain</Text>
            <Text style={[styles.statValue, { color: getPainLevelColor(getAveragePainLevel()) }]}>
              {getAveragePainLevel()}/10
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Logs</Text>
            <Text style={styles.statValue}>{painLogs.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Trend</Text>
            <Text style={styles.statTrend}>{getRecentTrend()}</Text>
          </View>
        </View>

        {/* Pain Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pain History</Text>
          {painLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={64} color="#666666" />
              <Text style={styles.emptyStateTitle}>No Pain Logs Yet</Text>
              <Text style={styles.emptyStateText}>
                Start tracking your pain levels to monitor your recovery progress.
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.emptyStateButtonText}>Add First Log</Text>
              </TouchableOpacity>
            </View>
          ) : (
            painLogs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logTitleRow}>
                    <Text style={styles.logLocation}>{log.location}</Text>
                    <View style={[styles.painLevelBadge, { backgroundColor: getPainLevelColor(log.painLevel) }]}>
                      <Text style={styles.painLevelText}>
                        {getPainLevelEmoji(log.painLevel)} {log.painLevel}/10
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteLog(log.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#F44336" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.logDetails}>
                  <View style={styles.logDetail}>
                    <Ionicons name="pulse-outline" size={16} color="#cccccc" />
                    <Text style={styles.logDetailText}>{log.painType}</Text>
                  </View>
                  <View style={styles.logDetail}>
                    <Ionicons name="time-outline" size={16} color="#cccccc" />
                    <Text style={styles.logDetailText}>{formatDate(log.date)}</Text>
                  </View>
                </View>
                
                {log.notes && (
                  <Text style={styles.logNotes}>{log.notes}</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Pain Log Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Pain</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Pain Level Slider */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pain Level: {painLevel}/10</Text>
                <View style={styles.painLevelSelector}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.painLevelButton,
                        painLevel === level && { backgroundColor: getPainLevelColor(level) }
                      ]}
                      onPress={() => setPainLevel(level)}
                    >
                      <Text style={styles.painLevelButtonText}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.painLevelEmoji}>{getPainLevelEmoji(painLevel)}</Text>
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g., Lower Back, Knee, Shoulder"
                  placeholderTextColor="#666666"
                />
                <View style={styles.quickSelectContainer}>
                  {commonLocations.map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={styles.quickSelectButton}
                      onPress={() => setLocation(loc)}
                    >
                      <Text style={styles.quickSelectText}>{loc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Pain Type */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pain Type</Text>
                <View style={styles.painTypeSelector}>
                  {painTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.painTypeButton,
                        painType === type && styles.painTypeButtonActive
                      ]}
                      onPress={() => setPainType(type)}
                    >
                      <Text style={[
                        styles.painTypeText,
                        painType === type && styles.painTypeTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional details..."
                  placeholderTextColor="#666666"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleAddPainLog}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Pain Log</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#00d4ff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statTrend: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
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
  logCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  logLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  painLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  painLevelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  logDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  logDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logDetailText: {
    fontSize: 14,
    color: '#cccccc',
  },
  logNotes: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 25,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  painLevelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  painLevelButton: {
    width: '17%',
    aspectRatio: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  painLevelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  painLevelEmoji: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 15,
  },
  input: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  quickSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  quickSelectButton: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickSelectText: {
    color: '#00d4ff',
    fontSize: 14,
  },
  painTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  painTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  painTypeButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00d4ff',
  },
  painTypeText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  painTypeTextActive: {
    color: '#00d4ff',
  },
  submitButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#666666',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default PainTrackingScreen;

