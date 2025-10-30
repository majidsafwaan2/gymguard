import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useCommunity } from '../context/CommunityContext';
import CreatePostModal from '../components/CreatePostModal';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user, userProfile } = useUser();
  const { posts, loading, refreshing, refreshPosts, likePost, deletePost } = useCommunity();
  
  const [userStats, setUserStats] = useState({
    streak: 7,
    workoutsThisWeek: 4,
    totalWorkouts: 127,
    caloriesBurned: 1200,
    currentWeight: 165,
    goalWeight: 160
  });

  const todaysWorkout = {
    name: "Upper Body Strength",
    duration: "45 min",
    exercises: 6,
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=200&fit=crop"
  };

  const recentAchievements = [
    {
      id: 1,
      title: "Week Warrior",
      description: "Worked out 4 times this week",
      icon: "🏆",
      date: "Today"
    },
    {
      id: 2,
      title: "Consistency King",
      description: "7 day workout streak",
      icon: "👑",
      date: "Yesterday"
    }
  ];

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={28} color="#ffffff" />
      <Text style={styles.quickActionTitle}>{item.title}</Text>
      <Text style={styles.quickActionDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId);
              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          }
        }
      ]
    );
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderCommunityPost = (post) => {
    const isLiked = post.likedBy?.includes(user?.uid);
    const postTypeIcon = {
      workout: 'fitness',
      nutrition: 'nutrition',
      achievement: 'trophy',
      motivation: 'heart',
      general: 'chatbubble'
    }[post.type] || 'chatbubble';

    return (
      <View key={post.id} style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image 
            source={{ 
              uri: post.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
            }} 
            style={styles.postAvatar} 
          />
          <View style={styles.postUserInfo}>
            <View style={styles.postUserRow}>
              <Text style={styles.postUserName}>{post.user?.name || 'Anonymous'}</Text>
              <View style={styles.postTypeBadge}>
                <Ionicons name={postTypeIcon} size={12} color="#00d4ff" />
                <Text style={styles.postTypeText}>{post.type}</Text>
              </View>
            </View>
            <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
          </View>
          {post.userId === user?.uid ? (
            <TouchableOpacity 
              style={styles.postOptions}
              onPress={() => handleDeletePost(post.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.postOptions}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#333333" />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.postContent}>{post.content}</Text>
        
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.postAction}
            onPress={() => handleLikePost(post.id)}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#F44336" : "#666666"} 
            />
            <Text style={[styles.postActionText, isLiked && { color: "#F44336" }]}>
              {post.likes || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={20} color="#333333" />
            <Text style={styles.postActionText}>{post.comments || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="share-outline" size={20} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAchievement = (achievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        <Text style={styles.achievementDate}>{achievement.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.userName}>Ready to train?</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Image 
            source={{ 
              uri: userProfile?.profilePicture || user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" 
            }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor="#00d4ff"
            colors={["#00d4ff"]}
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#00d4ff" />
            <Text style={styles.statValue}>{userStats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="fitness" size={24} color="#00d4ff" />
            <Text style={styles.statValue}>{userStats.workoutsThisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color="#00d4ff" />
            <Text style={styles.statValue}>{userStats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Doctor Assigned Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Doctor Assigned Workouts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorAssignedWorkouts')}>
              <Ionicons name="arrow-forward" size={20} color="#00d4ff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.doctorWorkoutCard}
            onPress={() => navigation.navigate('DoctorAssignedWorkouts')}
          >
            <View style={styles.doctorWorkoutIcon}>
              <Ionicons name="medical" size={32} color="#00d4ff" />
            </View>
            <View style={styles.doctorWorkoutInfo}>
              <Text style={styles.doctorWorkoutTitle}>View Your Prescribed Exercises</Text>
              <Text style={styles.doctorWorkoutSubtitle}>
                Personalized workouts from your physical therapist
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333333" />
          </TouchableOpacity>

          {/* Pain Form Report Button */}
          <TouchableOpacity 
            style={styles.painFormCard}
            onPress={() => navigation.navigate('SendPainForm')}
          >
            <View style={styles.painFormIcon}>
              <Ionicons name="fitness" size={32} color="#ff6b6b" />
            </View>
            <View style={styles.painFormInfo}>
              <Text style={styles.painFormTitle}>Report Pain</Text>
              <Text style={styles.painFormSubtitle}>
                Send pain assessment to your physical therapist
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          <TouchableOpacity style={styles.workoutCard}>
            <Image source={{ uri: todaysWorkout.image }} style={styles.workoutImage} />
            <View style={styles.workoutOverlay}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{todaysWorkout.name}</Text>
                <View style={styles.workoutDetails}>
                  <View style={styles.workoutDetail}>
                    <Ionicons name="time-outline" size={16} color="#ffffff" />
                    <Text style={styles.workoutDetailText}>{todaysWorkout.duration}</Text>
                  </View>
                  <View style={styles.workoutDetail}>
                    <Ionicons name="list-outline" size={16} color="#ffffff" />
                    <Text style={styles.workoutDetailText}>{todaysWorkout.exercises} exercises</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.startWorkoutButton}>
                <Ionicons name="play" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Community Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community</Text>
            <TouchableOpacity 
              style={styles.createPostButton}
              onPress={() => setShowCreatePost(true)}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          {loading && posts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00d4ff" />
              <Text style={styles.loadingText}>Loading community posts...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#666666" />
              <Text style={styles.emptyStateTitle}>No posts yet</Text>
              <Text style={styles.emptyStateText}>Be the first to share something with the community!</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowCreatePost(true)}
              >
                <Text style={styles.emptyStateButtonText}>Create First Post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map(renderCommunityPost)
          )}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {recentAchievements.map(renderAchievement)}
        </View>
      </ScrollView>
      
      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
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
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorWorkoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorWorkoutIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  doctorWorkoutInfo: {
    flex: 1,
  },
  doctorWorkoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  doctorWorkoutSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  painFormCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  painFormIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  painFormInfo: {
    flex: 1,
  },
  painFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  painFormSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  quickActionsScroll: {
    marginHorizontal: -5,
  },
  quickActionCard: {
    width: 120,
    height: 100,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 14,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  friendBadge: {
    backgroundColor: '#00d4ff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  friendBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  postTime: {
    fontSize: 12,
    color: '#999999',
  },
  postOptions: {
    padding: 5,
  },
  postContent: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  postActionText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  workoutCard: {
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  workoutOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutDetailText: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 4,
  },
  startWorkoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999999',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  createPostButton: {
    backgroundColor: '#00d4ff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  postTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  postTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
});

export default HomeScreen;
