import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const GymBuddyScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! I'm your AI Gym Buddy! 💪 I can help you with workout plans, nutrition advice, form tips, and answer any fitness questions. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const gymExperts = [
    {
      name: "Coach Mike",
      specialty: "Strength Training",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
      personality: "Motivational and technical"
    },
    {
      name: "Dr. Sarah",
      specialty: "Nutrition & Recovery",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      personality: "Scientific and supportive"
    },
    {
      name: "Trainer Alex",
      specialty: "Cardio & HIIT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      personality: "Energetic and encouraging"
    }
  ];

  const [currentExpert, setCurrentExpert] = useState(gymExperts[0]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate AI response (in real app, this would call Llama API)
      const aiResponse = await generateAIResponse(inputText.trim(), currentExpert);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const generateAIResponse = async (userInput, expert) => {
    // Simulate different responses based on expert and input
    const responses = {
      "Coach Mike": {
        workout: [
          "For strength training, focus on compound movements like squats, deadlifts, and bench press. Start with 3-4 sets of 6-8 reps for maximum strength gains! 💪",
          "Progressive overload is key! Increase weight by 2.5-5lbs each week. Your muscles need constant challenge to grow stronger.",
          "Rest 2-3 minutes between heavy sets. Your nervous system needs time to recover for optimal performance."
        ],
        form: [
          "Keep your core tight and maintain a neutral spine throughout the movement. This prevents injury and maximizes muscle engagement.",
          "Control the eccentric (lowering) phase for 2-3 seconds. This builds more muscle than explosive movements.",
          "Full range of motion is crucial! Don't sacrifice form for heavier weights."
        ],
        nutrition: [
          "Eat 1g of protein per lb of bodyweight daily. Chicken, fish, eggs, and Greek yogurt are excellent sources.",
          "Carbs fuel your workouts! Eat complex carbs like oats, sweet potatoes, and brown rice 2-3 hours before training.",
          "Stay hydrated! Drink 0.5-1oz of water per lb of bodyweight daily."
        ]
      },
      "Dr. Sarah": {
        nutrition: [
          "Focus on whole foods: lean proteins, complex carbs, healthy fats, and plenty of vegetables. Aim for 5-7 servings of fruits/veggies daily.",
          "Meal timing matters! Eat protein within 30 minutes post-workout to maximize muscle protein synthesis.",
          "Track your macros: 40% carbs, 30% protein, 30% fat is a good starting point for most people."
        ],
        recovery: [
          "Sleep 7-9 hours nightly. This is when your body repairs and builds muscle tissue.",
          "Active recovery is important! Light walks, yoga, or stretching on rest days improves circulation.",
          "Listen to your body. If you're constantly sore or fatigued, you might be overtraining."
        ],
        supplements: [
          "Creatine monohydrate (3-5g daily) is the most researched supplement for strength and muscle gains.",
          "Whey protein is convenient, but whole foods should be your primary protein source.",
          "Omega-3s reduce inflammation and support joint health. Consider fish oil if you don't eat fish regularly."
        ]
      },
      "Trainer Alex": {
        cardio: [
          "HIIT workouts burn more calories in less time! Try 30 seconds work, 30 seconds rest for 15-20 minutes.",
          "Mix up your cardio! Running, cycling, rowing, and swimming all work different muscle groups.",
          "Zone 2 training (conversational pace) improves your aerobic base and fat burning capacity."
        ],
        motivation: [
          "Consistency beats perfection! Even 20 minutes of exercise is better than nothing.",
          "Find activities you enjoy! You're more likely to stick with workouts you actually like doing.",
          "Track your progress! Take photos, measurements, and note how you feel. Small wins add up!"
        ],
        beginner: [
          "Start with bodyweight exercises: push-ups, squats, lunges, and planks. Master these before adding weights.",
          "Begin with 2-3 workouts per week. Your body needs time to adapt to new stress.",
          "Focus on learning proper form first. Bad habits are hard to break later!"
        ]
      }
    };

    const expertResponses = responses[expert.name] || responses["Coach Mike"];
    const categories = Object.keys(expertResponses);
    
    // Simple keyword matching to determine category
    let category = "workout";
    if (userInput.toLowerCase().includes("nutrition") || userInput.toLowerCase().includes("diet") || userInput.toLowerCase().includes("food")) {
      category = "nutrition";
    } else if (userInput.toLowerCase().includes("cardio") || userInput.toLowerCase().includes("running") || userInput.toLowerCase().includes("hiit")) {
      category = "cardio";
    } else if (userInput.toLowerCase().includes("form") || userInput.toLowerCase().includes("technique")) {
      category = "form";
    } else if (userInput.toLowerCase().includes("recovery") || userInput.toLowerCase().includes("rest")) {
      category = "recovery";
    } else if (userInput.toLowerCase().includes("beginner") || userInput.toLowerCase().includes("start")) {
      category = "beginner";
    }

    const categoryResponses = expertResponses[category] || expertResponses["workout"];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    return randomResponse;
  };

  const renderMessage = (message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!message.isUser && (
        <Image source={{ uri: currentExpert.avatar }} style={styles.avatar} />
      )}
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.botText
        ]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gym Buddy AI</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Expert Selection */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.expertSelector}>
        {gymExperts.map((expert) => (
          <TouchableOpacity
            key={expert.name}
            style={[
              styles.expertCard,
              currentExpert.name === expert.name && styles.selectedExpert
            ]}
            onPress={() => setCurrentExpert(expert)}
          >
            <Image source={{ uri: expert.avatar }} style={styles.expertAvatar} />
            <Text style={styles.expertName}>{expert.name}</Text>
            <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#667eea" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Ask ${currentExpert.name} anything...`}
            placeholderTextColor="#999999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  expertSelector: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  expertCard: {
    alignItems: 'center',
    marginRight: 15,
    padding: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 100,
    height: 80,
    justifyContent: 'center',
  },
  selectedExpert: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  expertAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 4,
  },
  expertName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  expertSpecialty: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 10,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#333333',
  },
  botText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 10,
    color: '#666666',
    marginTop: 5,
    textAlign: 'right',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: '#333333',
  },
  sendButton: {
    backgroundColor: '#667eea',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default GymBuddyScreen;
