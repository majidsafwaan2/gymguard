import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useCommunity } from '../context/CommunityContext';

const CreatePostModal = ({ visible, onClose }) => {
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, userProfile } = useUser();
  const { createPost } = useCommunity();

  const postTypes = [
    { id: 'general', label: 'General', icon: 'chatbubble-outline', color: '#00d4ff' },
    { id: 'workout', label: 'Workout', icon: 'fitness-outline', color: '#4CAF50' },
    { id: 'nutrition', label: 'Nutrition', icon: 'nutrition-outline', color: '#FF9800' },
    { id: 'achievement', label: 'Achievement', icon: 'trophy-outline', color: '#FFD700' },
    { id: 'motivation', label: 'Motivation', icon: 'heart-outline', color: '#F44336' },
  ];

  const handleCreatePost = async () => {
    if (!postText.trim()) {
      Alert.alert('Error', 'Please write something to share!');
      return;
    }

    try {
      setIsLoading(true);
      
      const postData = {
        content: postText.trim(),
        type: postType,
        image: null, // Could be extended to support images
        tags: [], // Could be extended to support hashtags
      };
      
      await createPost(postData);
      
      // Reset form
      setPostText('');
      setPostType('general');
      
      // Close modal
      onClose();
      
      Alert.alert('Success', 'Your post has been shared!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (postText.trim()) {
      Alert.alert(
        'Discard Post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setPostText('');
              setPostType('general');
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <TouchableOpacity
            onPress={handleCreatePost}
            style={[styles.postButton, (!postText.trim() || isLoading) && styles.postButtonDisabled]}
            disabled={!postText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={{ 
                uri: userProfile?.profilePicture || user?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
              }}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userProfile?.username || userProfile?.displayName || user?.displayName || 'Anonymous'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Post Type Selection */}
          <View style={styles.postTypeContainer}>
            <Text style={styles.sectionTitle}>Post Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postTypeScroll}>
              {postTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.postTypeButton,
                    postType === type.id && styles.postTypeButtonSelected,
                    { borderColor: type.color }
                  ]}
                  onPress={() => setPostType(type.id)}
                >
                  <Ionicons
                    name={type.icon}
                    size={20}
                    color={postType === type.id ? type.color : '#666666'}
                  />
                  <Text style={[
                    styles.postTypeLabel,
                    postType === type.id && { color: type.color }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Post Content */}
          <View style={styles.postContentContainer}>
            <Text style={styles.sectionTitle}>What's on your mind?</Text>
            <TextInput
              style={styles.postInput}
              placeholder="Share your fitness journey, achievements, tips, or motivation with the community..."
              placeholderTextColor="#666666"
              value={postText}
              onChangeText={setPostText}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {postText.length}/500
            </Text>
          </View>

          {/* Post Guidelines */}
          <View style={styles.guidelinesContainer}>
            <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
            <Text style={styles.guidelinesText}>
              • Be respectful and supportive{'\n'}
              • Share authentic experiences{'\n'}
              • No spam or promotional content{'\n'}
              • Keep it fitness and health related
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  cancelButton: {
    padding: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#00d4ff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  postButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#666666',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#999999',
  },
  postTypeContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  postTypeScroll: {
    marginHorizontal: -5,
  },
  postTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
    marginHorizontal: 5,
    backgroundColor: '#2d2d2d',
  },
  postTypeButtonSelected: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  postTypeLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  postContentContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  postInput: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 5,
  },
  guidelinesContainer: {
    paddingVertical: 20,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
});

export default CreatePostModal;
