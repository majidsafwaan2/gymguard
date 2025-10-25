import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SocialScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postText, setPostText] = useState('');

  const challenges = [
    {
      id: 1,
      title: "30-Day Push-up Challenge",
      description: "Complete 100 push-ups every day for 30 days",
      participants: 1250,
      difficulty: "Intermediate",
      duration: "30 days",
      reward: "Push-up Master Badge",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      progress: 15,
      total: 30
    },
    {
      id: 2,
      title: "Plank Challenge",
      description: "Hold a plank for 5 minutes straight",
      participants: 890,
      difficulty: "Advanced",
      duration: "1 day",
      reward: "Core Strength Badge",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&h=200&fit=crop",
      progress: 0,
      total: 1
    },
    {
      id: 3,
      title: "Squat Challenge",
      description: "Complete 1000 squats in a week",
      participants: 2100,
      difficulty: "Beginner",
      duration: "7 days",
      reward: "Leg Day Champion Badge",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=200&fit=crop",
      progress: 7,
      total: 7
    }
  ];

  const leaderboard = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      points: 2450,
      streak: 15,
      rank: 1
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      points: 2380,
      streak: 12,
      rank: 2
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      points: 2200,
      streak: 8,
      rank: 3
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      points: 1950,
      streak: 6,
      rank: 4
    }
  ];

  const communityPosts = [
    {
      id: 1,
      user: {
        name: "FitnessFan123",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face"
      },
      content: "Just completed my first 5K run! The training really paid off. Thanks to everyone who encouraged me!",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      user: {
        name: "GymGuru",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
      },
      content: "New PR on deadlifts today! 315lbs Consistency is key, keep grinding everyone!",
      time: "4 hours ago",
      likes: 45,
      comments: 12,
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      user: {
        name: "HealthyEats",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
      },
      content: "Meal prep Sunday! Here's my healthy lunch for the week. Recipe in comments!",
      time: "6 hours ago",
      likes: 18,
      comments: 5,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666666';
    }
  };

  const joinChallenge = (challenge) => {
    Alert.alert(
      "Join Challenge",
      `Are you ready to join "${challenge.title}"? This challenge is ${challenge.difficulty} level and will take ${challenge.duration}.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Join Challenge", onPress: () => {
          Alert.alert("Success!", "You've joined the challenge! Good luck!");
        }}
      ]
    );
  };

  const renderChallenge = (challenge) => (
    <View key={challenge.id} style={styles.challengeCard}>
      <Image source={{ uri: challenge.image }} style={styles.challengeImage} />
      <View style={styles.challengeOverlay}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        
        <View style={styles.challengeStats}>
          <View style={styles.challengeStat}>
            <Ionicons name="people-outline" size={16} color="#ffffff" />
            <Text style={styles.challengeStatText}>{challenge.participants}</Text>
          </View>
          <View style={styles.challengeStat}>
            <Ionicons name="time-outline" size={16} color="#ffffff" />
            <Text style={styles.challengeStatText}>{challenge.duration}</Text>
          </View>
          <View style={styles.challengeStat}>
            <Ionicons name="trophy-outline" size={16} color="#ffffff" />
            <Text style={styles.challengeStatText}>{challenge.reward}</Text>
          </View>
        </View>

        {challenge.progress > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progress: {challenge.progress}/{challenge.total}</Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${(challenge.progress / challenge.total) * 100}%` }
              ]} />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => joinChallenge(challenge)}
        >
          <Text style={styles.joinButtonText}>
            {challenge.progress > 0 ? 'Continue Challenge' : 'Join Challenge'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLeaderboardItem = (user, index) => (
    <View key={user.id} style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankNumber}>#{user.rank}</Text>
      </View>
      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userStats}>{user.points} points • {user.streak} day streak</Text>
      </View>
      <View style={styles.userBadges}>
        <Ionicons name="trophy" size={20} color="#FFD700" />
      </View>
    </View>
  );

  const renderCommunityPost = (post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{post.user.name}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <TouchableOpacity style={styles.postOptions}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="heart-outline" size={20} color="#666666" />
          <Text style={styles.postActionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="chatbubble-outline" size={20} color="#666666" />
          <Text style={styles.postActionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="share-outline" size={20} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const createPost = () => {
    if (!postText.trim()) {
      Alert.alert('Error', 'Please enter some content for your post.');
      return;
    }
    
    Alert.alert('Success!', 'Your post has been shared with the community!');
    setPostText('');
    setShowCreatePost(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'challenges' && styles.activeTabButton]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'challenges' && styles.activeTabButtonText]}>
            Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'leaderboard' && styles.activeTabButton]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'leaderboard' && styles.activeTabButtonText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'community' && styles.activeTabButton]}
          onPress={() => setActiveTab('community')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'community' && styles.activeTabButtonText]}>
            Community
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'challenges' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {challenges.map(renderChallenge)}
          </View>
        )}

        {activeTab === 'leaderboard' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
            {leaderboard.map(renderLeaderboardItem)}
          </View>
        )}

        {activeTab === 'community' && (
          <View style={styles.tabContent}>
            <TouchableOpacity
              style={styles.createPostButton}
              onPress={() => setShowCreatePost(true)}
            >
              <Ionicons name="add-circle" size={24} color="#667eea" />
              <Text style={styles.createPostText}>Share your progress</Text>
            </TouchableOpacity>
            {communityPosts.map(renderCommunityPost)}
          </View>
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCreatePost(false)}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.postInput}
              value={postText}
              onChangeText={setPostText}
              placeholder="Share your fitness journey..."
              placeholderTextColor="#999999"
              multiline
              maxLength={500}
            />
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreatePost(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={createPost}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  settingsButton: {
    padding: 8,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#ffffff',
  },
  tabButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeTabButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  challengeCard: {
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  challengeImage: {
    width: '100%',
    height: '100%',
  },
  challengeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  challengeDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  challengeStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeStatText: {
    fontSize: 10,
    color: '#ffffff',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  joinButton: {
    backgroundColor: '#667eea',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    color: '#666666',
  },
  userBadges: {
    alignItems: 'center',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  createPostText: {
    fontSize: 16,
    color: '#667eea',
    marginLeft: 10,
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  postTime: {
    fontSize: 12,
    color: '#666666',
  },
  postOptions: {
    padding: 5,
  },
  postContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  postActionText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 5,
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
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 5,
  },
  postInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#667eea',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default SocialScreen;
