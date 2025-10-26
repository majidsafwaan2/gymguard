import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const UserProfileScreen = ({ navigation }) => {
  const { user, userProfile, updateUserProfile, signOut } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state with user profile data
  const [measurements, setMeasurements] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    neck: '',
    waist: '',
    hip: '',
    bodyFat: '',
    targetWeight: '',
    targetBodyFat: '',
  });

  // Update measurements when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setMeasurements({
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        neck: userProfile.neck || '',
        waist: userProfile.waist || '',
        hip: userProfile.hip || '',
        bodyFat: userProfile.bodyFat || '',
        targetWeight: userProfile.targetWeight || '',
        targetBodyFat: userProfile.targetBodyFat || '',
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      console.log('Saving measurements:', measurements);
      await updateUserProfile(measurements);
      setIsEditing(false);
      Alert.alert('Success', 'Your measurements have been saved!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', `Failed to save measurements: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => pickImage('camera') },
        { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
        { text: 'Remove Picture', onPress: () => removeProfilePicture() },
      ]
    );
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Camera permission is required to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Gallery permission is required to select photos');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await updateUserProfile({ profilePicture: imageUri });
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const removeProfilePicture = () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateUserProfile({ profilePicture: null });
              Alert.alert('Success', 'Profile picture removed successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove profile picture');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.headerGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleChangeProfilePicture} style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  userProfile?.profilePicture ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              }}
              style={styles.avatar}
            />
            <View style={styles.avatarEditIcon}>
              <Ionicons name="camera" size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userProfile?.username || userProfile?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Body Measurements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Body Measurements</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons
                name={isEditing ? 'close-outline' : 'pencil-outline'}
                size={24}
                color="#00d4ff"
              />
            </TouchableOpacity>
          </View>

          {Object.entries(measurements).map(([key, value]) => {
            // Format label nicely
            const formatLabel = (label) => {
              return label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1');
            };
            
            return (
              <View key={key} style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>
                  {formatLabel(key)}
                </Text>
                {isEditing ? (
                  <TextInput
                    style={styles.measurementInput}
                    value={value.toString()}
                    onChangeText={(text) =>
                      setMeasurements({ ...measurements, [key]: text })
                    }
                    keyboardType={key === 'gender' ? 'default' : 'numeric'}
                    placeholder={key === 'gender' ? 'male/female/other' : 'Enter value'}
                    placeholderTextColor="#666666"
                  />
                ) : (
                  <View style={styles.measurementValue}>
                    <Text style={styles.measurementValueText}>
                      {value ? (key === 'bodyFat' || key === 'targetBodyFat' ? `${value}%` : value) : 'Not set'}
                    </Text>
                    {key !== 'gender' && key !== 'bodyFat' && key !== 'targetBodyFat' && (
                      <Text style={styles.measurementUnit}>
                        {['height', 'neck', 'waist', 'hip'].includes(key) ? 'in' : ['weight', 'targetWeight'].includes(key) ? 'lb' : ''}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}

          {isEditing && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Fitness Goals Section */}
        {userProfile?.fitnessGoals && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fitness Goals</Text>
            {Object.entries(userProfile.fitnessGoals).map(([key, value]) => (
              <View key={key} style={styles.goalItem}>
                <Text style={styles.goalLabel}>
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Text style={styles.goalValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={32} color="#00d4ff" />
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="fitness" size={32} color="#00d4ff" />
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
          </View>
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
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00d4ff',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#00d4ff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#cccccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  measurementLabel: {
    fontSize: 16,
    color: '#cccccc',
    flex: 1,
  },
  measurementInput: {
    fontSize: 16,
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#00d4ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 100,
    textAlign: 'right',
  },
  measurementValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 5,
  },
  measurementUnit: {
    fontSize: 12,
    color: '#999999',
  },
  saveButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  goalLabel: {
    fontSize: 16,
    color: '#cccccc',
    flex: 1,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
  },
});

export default UserProfileScreen;

