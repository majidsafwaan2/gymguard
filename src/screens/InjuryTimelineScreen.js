import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const InjuryTimelineScreen = ({ navigation, route }) => {
  const { patientId } = route.params || {};
  const { user, userProfile } = useUser();
  const [patient, setPatient] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const isDoctor = userProfile?.userType === 'doctor';
  const viewingPatientId = patientId || user.uid;

  useEffect(() => {
    fetchPatientInfo();
    fetchPictures();
  }, [viewingPatientId]);

  const fetchPatientInfo = async () => {
    if (!viewingPatientId) return;
    
    try {
      const patientDoc = await getDoc(doc(db, 'users', viewingPatientId));
      if (patientDoc.exists()) {
        setPatient({ id: patientDoc.id, ...patientDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching patient info:', error);
    }
  };

  const fetchPictures = async () => {
    try {
      setLoading(true);
      const picturesQuery = query(
        collection(db, 'injuryPictures'),
        where('patientId', '==', viewingPatientId),
        orderBy('uploadedAt', 'desc')
      );
      
      const picturesSnapshot = await getDocs(picturesQuery);
      const picturesData = picturesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setPictures(picturesData);
    } catch (error) {
      console.error('Error fetching pictures:', error);
      Alert.alert('Error', 'Failed to load injury pictures');
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload pictures.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImagePickerAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);

      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create storage reference
      const filename = `injury_${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `injuryPictures/${filename}`);

      // Upload image
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save to Firestore
      const doctorId = patient?.doctorId;
      await addDoc(collection(db, 'injuryPictures'), {
        patientId: user.uid,
        patientName: userProfile.fullName,
        doctorId: doctorId || null,
        imageUrl: downloadURL,
        uploadedAt: new Date().toISOString(),
        read: false,
      });

      Alert.alert('Success', 'Picture uploaded successfully');
      fetchPictures();
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload picture');
    } finally {
      setUploading(false);
    }
  };

  const groupPicturesByMonth = () => {
    const grouped = {};
    
    pictures.forEach(picture => {
      const date = new Date(picture.uploadedAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(picture);
    });

    return grouped;
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading timeline...</Text>
      </View>
    );
  }

  const groupedPictures = groupPicturesByMonth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Injury Timeline</Text>
          {isDoctor && patient && (
            <Text style={styles.headerSubtitle}>{patient.fullName}</Text>
          )}
        </View>
        {!isDoctor && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={pickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Ionicons name="add" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        )}
        {isDoctor && <View style={{ width: 40 }} />}
      </View>

      {pictures.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={64} color="#666666" />
          <Text style={styles.emptyStateTitle}>No Progress Pictures</Text>
          <Text style={styles.emptyStateText}>
            {isDoctor 
              ? "This patient hasn't uploaded any progress pictures yet."
              : "Upload pictures to track your injury recovery progress over time."}
          </Text>
          {!isDoctor && (
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={pickImage}
              disabled={uploading}
            >
              <Text style={styles.emptyStateButtonText}>Upload First Picture</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {Object.entries(groupedPictures).map(([monthYear, monthPictures]) => (
            <View key={monthYear} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{monthYear}</Text>
              <View style={styles.picturesGrid}>
                {monthPictures.map((picture) => (
                  <TouchableOpacity
                    key={picture.id}
                    style={styles.pictureCard}
                    onPress={() => setSelectedImage(picture)}
                  >
                    <Image 
                      source={{ uri: picture.imageUrl }} 
                      style={styles.pictureImage}
                    />
                    <View style={styles.pictureOverlay}>
                      <Text style={styles.pictureDate}>
                        {formatDate(picture.uploadedAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Image Viewer Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalDate}>
                {selectedImage && formatDate(selectedImage.uploadedAt)}
              </Text>
              <TouchableOpacity onPress={() => setSelectedImage(null)}>
                <Ionicons name="close" size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage.imageUrl }} 
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
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
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 2,
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
  monthSection: {
    marginBottom: 30,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  picturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pictureCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#2d2d2d',
  },
  pictureImage: {
    width: '100%',
    height: '100%',
  },
  pictureOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  pictureDate: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  modalDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  fullImage: {
    flex: 1,
    width: '100%',
  },
});

export default InjuryTimelineScreen;

