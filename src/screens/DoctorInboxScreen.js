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
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DoctorInboxScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'patient_requests'

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notificationsData = [];

      // Fetch patient requests
      const requestsQuery = query(
        collection(db, 'patientRequests'),
        where('doctorId', '==', userProfile.uid),
        orderBy('createdAt', 'desc')
      );
      
      const requestsSnapshot = await getDocs(requestsQuery);
      requestsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          type: 'patient_request',
          status: data.status,
          title: 'New Patient Request',
          message: `${data.patientName} would like to add you as their physical therapist.`,
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          date: data.createdAt,
          read: data.read || false,
          data: data,
        });
      });

      // Fetch injury picture submissions
      const picturesQuery = query(
        collection(db, 'injuryPictures'),
        where('doctorId', '==', userProfile.uid),
        orderBy('uploadedAt', 'desc')
      );
      
      const picturesSnapshot = await getDocs(picturesQuery);
      picturesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          type: 'injury_picture',
          title: 'New Progress Picture',
          message: `${data.patientName} uploaded a new progress picture.`,
          date: data.uploadedAt,
          read: data.read || false,
          data: data,
        });
      });

      // Sort all notifications by date
      notificationsData.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Apply filter
      let filteredNotifications = notificationsData;
      if (filter === 'unread') {
        filteredNotifications = notificationsData.filter(n => !n.read);
      } else if (filter === 'patient_requests') {
        filteredNotifications = notificationsData.filter(n => n.type === 'patient_request' && n.status === 'pending');
      }

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId, type) => {
    try {
      const collectionName = type === 'patient_request' ? 'patientRequests' : 'injuryPictures';
      await updateDoc(doc(db, collectionName, notificationId), {
        read: true,
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id, notification.type);
    }

    if (notification.type === 'patient_request' && notification.status === 'pending') {
      navigation.navigate('DoctorDashboard');
    } else if (notification.type === 'injury_picture') {
      navigation.navigate('InjuryTimeline', { 
        patientId: notification.data.patientId 
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type, status) => {
    if (type === 'patient_request') {
      if (status === 'accepted') return { name: 'checkmark-circle', color: '#4CAF50' };
      if (status === 'rejected') return { name: 'close-circle', color: '#F44336' };
      return { name: 'person-add', color: '#FFC107' };
    }
    if (type === 'injury_picture') {
      return { name: 'images', color: '#00d4ff' };
    }
    return { name: 'notifications', color: '#666666' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', color: '#FFC107' },
      accepted: { text: 'Accepted', color: '#4CAF50' },
      rejected: { text: 'Rejected', color: '#F44336' },
    };
    return badges[status] || null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'patient_requests' && styles.filterButtonActive]}
          onPress={() => setFilter('patient_requests')}
        >
          <Text style={[styles.filterText, filter === 'patient_requests' && styles.filterTextActive]}>
            Requests
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
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#666666" />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'unread' 
                ? "You're all caught up!" 
                : "You'll see notifications here when patients request to connect or upload progress pictures."}
            </Text>
          </View>
        ) : (
          notifications.map((notification) => {
            const icon = getNotificationIcon(notification.type, notification.status);
            const statusBadge = getStatusBadge(notification.status);

            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => handleNotificationPress(notification)}
              >
                <View style={[styles.notificationIcon, { backgroundColor: `${icon.color}20` }]}>
                  <Ionicons name={icon.name} size={24} color={icon.color} />
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  <View style={styles.notificationFooter}>
                    <Text style={styles.notificationDate}>{formatDate(notification.date)}</Text>
                    {statusBadge && (
                      <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
                        <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#333333" />
              </TouchableOpacity>
            );
          })
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'transparent',
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
    fontSize: 14,
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
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4ff',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
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
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DoctorInboxScreen;

