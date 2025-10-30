import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { verifyDoctorCredentials, US_STATES } from '../data/demoMedicalLicenses';
import { useUser } from '../context/UserContext';

const SignUpScreen = ({ navigation }) => {
  const { refreshUserProfile } = useUser();
  
  // Common fields
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Patient-specific fields
  const [doctorEmail, setDoctorEmail] = useState('');
  
  // Doctor-specific fields
  const [licenseNumber, setLicenseNumber] = useState('');
  const [stateOfIssuance, setStateOfIssuance] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    // Doctor-specific validation
    if (userType === 'doctor') {
      if (!licenseNumber.trim()) {
        Alert.alert('Error', 'Please enter your license number');
        return false;
      }
      if (!stateOfIssuance.trim()) {
        Alert.alert('Error', 'Please select state of issuance');
        return false;
      }
      if (!dateOfBirth.trim()) {
        Alert.alert('Error', 'Please enter your date of birth (YYYY-MM-DD)');
        return false;
      }
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        Alert.alert('Error', 'Date of birth must be in YYYY-MM-DD format');
        return false;
      }
    }
    
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // For doctors, verify credentials first
      if (userType === 'doctor') {
        const verification = verifyDoctorCredentials(
          licenseNumber,
          stateOfIssuance,
          fullName,
          dateOfBirth
        );
        
        if (!verification.verified) {
          Alert.alert('Verification Failed', verification.message);
          setIsLoading(false);
          return;
        }
      }
      
      // For patients with doctor email, check if doctor exists
      let doctorId = null;
      if (userType === 'patient' && doctorEmail.trim()) {
        const doctorsQuery = query(
          collection(db, 'users'),
          where('email', '==', doctorEmail.trim().toLowerCase()),
          where('userType', '==', 'doctor')
        );
        const doctorSnapshot = await getDocs(doctorsQuery);
        
        if (doctorSnapshot.empty) {
          Alert.alert('Doctor Not Found', 'No doctor found with that email address.');
          setIsLoading(false);
          return;
        }
        
        doctorId = doctorSnapshot.docs[0].id;
        const doctorData = doctorSnapshot.docs[0].data();
        console.log('✅ Found doctor with ID (Firestore Doc ID):', doctorId);
        console.log('Doctor data:', doctorData);
        console.log('Doctor UID field from data:', doctorData.uid);
        console.log('These should match: Firestore Doc ID and UID field should both be the same');
      }
      
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      await updateProfile(user, {
        displayName: fullName.trim()
      });
      
      // Create base user document
      const userData = {
        uid: user.uid,
        email: user.email.toLowerCase(),
        fullName: fullName.trim(),
        displayName: fullName.trim(),
        userType: userType,
        createdAt: new Date().toISOString(),
        profilePicture: null,
      };
      
      // Add type-specific fields
      if (userType === 'patient') {
        userData.doctorId = doctorId;
        userData.doctorStatus = doctorId ? 'pending' : null; // pending, accepted, rejected
        userData.surveyCompleted = false;
      } else if (userType === 'doctor') {
        userData.licenseNumber = licenseNumber.trim();
        userData.stateOfIssuance = stateOfIssuance;
        userData.dateOfBirth = dateOfBirth;
        userData.verified = true;
        userData.patients = [];
        userData.surveyCompleted = false;
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // If patient with doctor, create a patient request
      if (userType === 'patient' && doctorId) {
        console.log('Creating patient request for doctorId:', doctorId);
        const patientRequestData = {
          patientId: user.uid,
          patientName: fullName.trim(),
          patientEmail: user.email.toLowerCase(),
          doctorId: doctorId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        console.log('Patient request data:', patientRequestData);
        
        const requestRef = await addDoc(collection(db, 'patientRequests'), patientRequestData);
        console.log('Patient request created with ID:', requestRef.id);
      } else if (userType === 'patient' && !doctorId) {
        console.log('Patient signed up without a doctor');
      }
      
      console.log('Signed up successfully as', userType);
      console.log('User document created in Firestore with userType:', userType);
      
      // Wait a bit longer to ensure Firestore write is propagated
      await new Promise(resolve => setTimeout(resolve, 1500));
      await refreshUserProfile();
      
      console.log('Profile refresh complete, navigation will be handled by App.js');
      // Navigation will be handled by the auth state change in App.js
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Join Theravive</Text>
              <Text style={styles.subtitle}>Your fitness companion</Text>
            </View>

            {/* User Type Selector */}
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[styles.userTypeButton, userType === 'patient' && styles.userTypeButtonActive]}
                onPress={() => setUserType('patient')}
              >
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={userType === 'patient' ? '#00d4ff' : '#666666'} 
                />
                <Text style={[styles.userTypeText, userType === 'patient' && styles.userTypeTextActive]}>
                  Patient
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.userTypeButton, userType === 'doctor' && styles.userTypeButtonActive]}
                onPress={() => setUserType('doctor')}
              >
                <Ionicons 
                  name="medical" 
                  size={24} 
                  color={userType === 'doctor' ? '#00d4ff' : '#666666'} 
                />
                <Text style={[styles.userTypeText, userType === 'doctor' && styles.userTypeTextActive]}>
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Form */}
            <View style={styles.form}>
              {/* Common Fields */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#333333" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#666666"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#333333" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#333333" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#333333" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#666666"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>

              {/* Patient-specific fields */}
              {userType === 'patient' && (
                <View style={styles.inputContainer}>
                  <Ionicons name="medkit-outline" size={20} color="#333333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Doctor's Email (Optional)"
                    placeholderTextColor="#666666"
                    value={doctorEmail}
                    onChangeText={setDoctorEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}

              {/* Doctor-specific fields */}
              {userType === 'doctor' && (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons name="card-outline" size={20} color="#333333" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="License Number"
                      placeholderTextColor="#666666"
                      value={licenseNumber}
                      onChangeText={setLicenseNumber}
                      autoCapitalize="characters"
                      autoCorrect={false}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => setShowStatePicker(true)}
                  >
                    <Ionicons name="location-outline" size={20} color="#333333" style={styles.inputIcon} />
                    <Text style={[styles.input, !stateOfIssuance && styles.placeholderStyle]}>
                      {stateOfIssuance || 'State of Issuance'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#333333" />
                  </TouchableOpacity>

                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#333333" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Date of Birth (YYYY-MM-DD)"
                      placeholderTextColor="#666666"
                      value={dateOfBirth}
                      onChangeText={setDateOfBirth}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </>
              )}

              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* State Picker Modal */}
            <Modal
              visible={showStatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowStatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select State</Text>
                    <TouchableOpacity onPress={() => setShowStatePicker(false)}>
                      <Ionicons name="close" size={24} color="#333333" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.stateList}>
                    {US_STATES.map((state) => (
                      <TouchableOpacity
                        key={state}
                        style={styles.stateItem}
                        onPress={() => {
                          setStateOfIssuance(state);
                          setShowStatePicker(false);
                        }}
                      >
                        <Text style={styles.stateItemText}>{state}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Sign In Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 15,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeButtonActive: {
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  userTypeText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: '#00d4ff',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  placeholderStyle: {
    color: '#999999',
  },
  eyeIcon: {
    padding: 5,
  },
  signUpButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpButtonDisabled: {
    backgroundColor: '#666666',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  stateList: {
    maxHeight: 400,
  },
  stateItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stateItemText: {
    fontSize: 16,
    color: '#333333',
  },
  termsContainer: {
    marginBottom: 30,
  },
  termsText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#00d4ff',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666666',
  },
  signInLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
});

export default SignUpScreen;
