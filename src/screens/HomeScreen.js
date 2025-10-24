import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
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

  const communityPosts = [
    {
      id: 1,
      user: {
        name: "FitnessFan123",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        isFriend: true
      },
      content: "Just completed my first ski trip! 🎿 The training really paid off. Thanks to everyone who encouraged me!",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      user: {
        name: "GymGuru",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        isFriend: false
      },
      content: "New PR on deadlifts today! 315lbs 💪 Consistency is key, keep grinding everyone!",
      time: "4 hours ago",
      likes: 45,
      comments: 12,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      user: {
        name: "HealthyEats",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        isFriend: false
      },
      content: "Meal prep Sunday! 🥗 Here's my healthy lunch for the week. Recipe in comments!",
      time: "6 hours ago",
      likes: 18,
      comments: 5,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop"
    }
  ];

  const renderCommunityPost = (post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
        <View style={styles.postUserInfo}>
          <View style={styles.postUserRow}>
            <Text style={styles.postUserName}>{post.user.name}</Text>
            {post.user.isFriend && (
              <View style={styles.friendBadge}>
                <Text style={styles.friendBadgeText}>Friend</Text>
              </View>
            )}
          </View>
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
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.sectionTitle}>Community</Text>
          {communityPosts.map(renderCommunityPost)}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {recentAchievements.map(renderAchievement)}
        </View>

        {/* Progress Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Summary</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Weight Progress</Text>
              <Text style={styles.progressValue}>{userStats.currentWeight} lbs</Text>
              <Text style={styles.progressGoal}>Goal: {userStats.goalWeight} lbs</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '85%' }]} />
              </View>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Calories Burned</Text>
              <Text style={styles.progressValue}>{userStats.caloriesBurned}</Text>
              <Text style={styles.progressGoal}>Today</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
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
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
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
    color: '#ffffff',
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
    color: '#ffffff',
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
    borderTopColor: '#333333',
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
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
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
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999999',
  },
  progressCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  progressGoal: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 3,
  },
});

export default HomeScreen;
