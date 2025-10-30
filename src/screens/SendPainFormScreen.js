import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const SendPainFormScreen = ({ navigation }) => {
  const { user, userProfile } = useUser();
  const [painLevel, setPainLevel] = useState(5);
  const [location, setLocation] = useState('');
  const [painType, setPainType] = useState('Sharp');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const painTypes = ['Sharp', 'Dull', 'Aching', 'Burning', 'Throbbing', 'Stabbing'];
  const commonLocations = [
    'Lower Back', 'Upper Back', 'Neck', 'Shoulder', 'Elbow', 
    'Wrist', 'Hip', 'Knee', 'Ankle', 'Foot'
  ];

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      if (!userProfile?.doctorId) {
        setLoading(false);
        return;
      }

      const doctorDoc = await getDoc(doc(db, 'users', userProfile.doctorId));
      if (doctorDoc.exists()) {
        setDoctorInfo({ id: doctorDoc.id, ...doctorDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPainForm = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please specify pain location');
      return;
    }

    if (!userProfile?.doctorId) {
      Alert.alert('Error', 'You need to have a doctor assigned to send pain forms');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Add pain form to Firestore
      await addDoc(collection(db, 'painForms'), {
        patientId: user.uid,
        patientName: userProfile.fullName || 'Patient',
        patientEmail: userProfile.email,
        doctorId: userProfile.doctorId,
        painLevel: painLevel,
        location: location.trim(),
        painType: painType,
        notes: notes.trim(),
        date: new Date().toISOString(),
        status: 'unread',
      });

      Alert.alert(
        'Success', 
        `Pain form sent to Dr. ${doctorInfo?.fullName || 'your doctor'}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setPainLevel(5);
              setLocation('');
              setPainType('Sharp');
              setNotes('');
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error sending pain form:', error);
      Alert.alert('Error', 'Failed to send pain form');
    } finally {
      setIsSubmitting(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!userProfile?.doctorId || userProfile?.doctorStatus !== 'accepted') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Pain Form</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.noDoctorContainer}>
          <Ionicons name="medical-outline" size={64} color="#666666" />
          <Text style={styles.noDoctorTitle}>No Doctor Assigned</Text>
          <Text style={styles.noDoctorText}>
            You need to have a physical therapist assigned and accepted to send pain tracking forms.
          </Text>
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
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Pain Form</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Info Card */}
        {doctorInfo && (
          <View style={styles.doctorCard}>
            <View style={styles.doctorCardHeader}>
              <Ionicons name="medical" size={24} color="#00d4ff" />
              <Text style={styles.doctorCardTitle}>Sending to:</Text>
            </View>
            <Text style={styles.doctorName}>{doctorInfo.fullName}</Text>
            <Text style={styles.doctorEmail}>{doctorInfo.email}</Text>
          </View>
        )}

        {/* Pain Level Slider */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>How much does it hurt? {painLevel}/10</Text>
          <Text style={styles.formSubLabel}>Slide to rate your pain level from 1 (minimal) to 10 (severe)</Text>
          
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={painLevel}
              onValueChange={(value) => setPainLevel(Math.round(value))}
              minimumTrackTintColor={getPainLevelColor(painLevel)}
              maximumTrackTintColor="#333333"
              thumbTintColor={getPainLevelColor(painLevel)}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>1</Text>
              <Text style={[styles.sliderLabelValue, { color: getPainLevelColor(painLevel) }]}>
                {painLevel}
              </Text>
              <Text style={styles.sliderLabelText}>10</Text>
            </View>
          </View>
          
          <Text style={styles.painLevelEmoji}>{getPainLevelEmoji(painLevel)}</Text>
          <Text style={styles.painLevelDescription}>
            {painLevel <= 3 && 'Mild pain - Doesn\'t interfere with activities'}
            {painLevel > 3 && painLevel <= 6 && 'Moderate pain - Makes some activities difficult'}
            {painLevel > 6 && painLevel <= 8 && 'Severe pain - Significantly limits activities'}
            {painLevel > 8 && 'Extreme pain - Unable to perform activities'}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Where does it hurt?</Text>
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
                style={[
                  styles.quickSelectButton,
                  location === loc && styles.quickSelectButtonActive
                ]}
                onPress={() => setLocation(loc)}
              >
                <Text style={[
                  styles.quickSelectText,
                  location === loc && styles.quickSelectTextActive
                ]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pain Type */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>What type of pain?</Text>
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
          <Text style={styles.formLabel}>Additional Details (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe any additional symptoms, what activities make it worse, etc."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSendPainForm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Send to Doctor</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#00d4ff" />
          <Text style={styles.infoText}>
            Your doctor will receive this pain assessment and can review your progress over time.
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  doctorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  doctorCardTitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  doctorEmail: {
    fontSize: 14,
    color: '#999999',
  },
  formGroup: {
    marginBottom: 30,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  formSubLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  sliderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    paddingTop: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  sliderLabelText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '600',
  },
  sliderLabelValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  painLevelEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  painLevelDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  quickSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickSelectButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickSelectButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00d4ff',
  },
  quickSelectText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  quickSelectTextActive: {
    color: '#00d4ff',
  },
  painTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  painTypeButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  painTypeButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00d4ff',
  },
  painTypeText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
  },
  painTypeTextActive: {
    color: '#00d4ff',
  },
  submitButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 15,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#666666',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  noDoctorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noDoctorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  noDoctorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SendPainFormScreen;

