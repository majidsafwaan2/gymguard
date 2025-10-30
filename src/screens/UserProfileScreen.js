import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const UserProfileScreen = ({ navigation }) => {
  const { user, userProfile, updateUserProfile, signOut } = useUser();

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
      <View style={styles.headerGradient}>
        {/* Header */}
        <View style={styles.header}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#333333" />
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
              <Ionicons name="camera" size={16} color="#333333" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userProfile?.username || userProfile?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Personal/Patient Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {userProfile?.userType === 'doctor' ? 'Personal Information' : 'Patient Information'}
          </Text>
          
          {userProfile?.age && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{userProfile.age} years</Text>
            </View>
          )}
          
          {userProfile?.gender && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{userProfile.gender}</Text>
            </View>
          )}
          
          {userProfile?.height && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{userProfile.height} inches</Text>
            </View>
          )}
          
          {userProfile?.weight && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{userProfile.weight} lbs</Text>
            </View>
          )}

          {!userProfile?.age && !userProfile?.gender && !userProfile?.height && !userProfile?.weight && (
            <Text style={styles.emptyText}>
              {userProfile?.userType === 'doctor' ? 'No personal information available' : 'No patient information available'}
            </Text>
          )}
        </View>

        {/* Stats Section - Only show for patients */}
        {userProfile?.userType === 'patient' && (
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
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    color: '#333333',
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
    borderColor: '#333333',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
});

export default UserProfileScreen;

