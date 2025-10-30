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

const PTBuddyScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Physical Therapist! 🏥 I can help you with rehabilitation exercises, pain management, mobility improvement, and answer questions about your recovery. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const gymExperts = [
    {
      name: "Dr. James",
      specialty: "Orthopedic PT",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
      personality: "Clinical and supportive"
    },
    {
      name: "Dr. Maria",
      specialty: "Sports Rehab",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      personality: "Encouraging and precise"
    },
    {
      name: "Dr. Kevin",
      specialty: "Movement Therapy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      personality: "Holistic and patient"
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
      "Dr. James": {
        exercises: [
          "For orthopedic recovery, focus on controlled movements that don't cause sharp pain. Start with 2-3 sets of 10-15 reps, prioritizing quality over quantity. 🏥",
          "Range of motion exercises should be done slowly and deliberately. Don't push through sharp pain, but mild discomfort is normal during recovery.",
          "Strengthen the muscles around your injury site to provide better support. This helps prevent re-injury and speeds up recovery."
        ],
        pain: [
          "Ice for acute pain (first 48-72 hours), heat for chronic stiffness. 15-20 minutes at a time, with breaks in between.",
          "Pain that increases during or after exercise needs attention. Use the pain scale - keep activities between 0-3 out of 10.",
          "Take prescribed anti-inflammatories with food. They reduce swelling and make exercises more comfortable."
        ],
        recovery: [
          "Rest is crucial, but complete inactivity can delay healing. Gentle movement promotes blood flow and prevents stiffness.",
          "Follow your prescribed exercise schedule consistently. Skipping sessions or overdoing it both slow recovery.",
          "Expect gradual improvement. Healing takes time - weeks for soft tissue, months for bones and tendons."
        ]
      },
      "Dr. Maria": {
        rehab: [
          "Sport-specific rehab builds on basic strength. Start with fundamental movements before progressing to athletic drills.",
          "Balance and proprioception training prevents re-injury. Single-leg exercises and stability work are essential.",
          "Return to sport gradually. Use the 10% rule - increase intensity/volume by no more than 10% per week."
        ],
        exercises: [
          "Eccentric exercises (controlling the lowering phase) rebuild tendon strength effectively. 3 seconds down, 1 second up.",
          "Plyometric training should only begin after pain-free strength is restored. Start with low-impact before progressing.",
          "Core stability is fundamental to all movement. Include planks, bird-dogs, and dead bugs in your routine."
        ],
        prevention: [
          "Warm up properly before activity. 5-10 minutes of light cardio and dynamic stretching prepares your body.",
          "Listen to early warning signs. Persistent soreness, reduced range of motion, or subtle pain shouldn't be ignored.",
          "Cross-training reduces overuse injuries by varying movement patterns and stress distribution."
        ]
      },
      "Dr. Kevin": {
        mobility: [
          "Gentle stretching improves flexibility. Hold each stretch 30-60 seconds, breathing deeply. Never bounce.",
          "Yoga and tai chi enhance mind-body connection while building functional strength and balance.",
          "Daily movement is better than occasional intensive stretching. Even 5 minutes makes a difference."
        ],
        posture: [
          "Ergonomics matter! Ensure your workspace supports neutral spine alignment to prevent chronic pain.",
          "Postural exercises strengthen muscles that fight gravity. Wall angels, chin tucks, and scapular squeezes help.",
          "Take frequent breaks from static positions. Move every 30 minutes to prevent muscle tightness."
        ],
        breathing: [
          "Diaphragmatic breathing reduces tension and improves core stability. Practice: breathe in for 4, hold for 4, out for 6.",
          "Breath control during exercises maintains stability. Exhale during exertion, inhale during release.",
          "Stress affects physical recovery. Mindfulness and breathing exercises support both mental and physical healing."
        ]
      }
    };

    const expertResponses = responses[expert.name] || responses["Dr. James"];
    const categories = Object.keys(expertResponses);
    
    // Simple keyword matching to determine category
    let category = "exercises";
    if (userInput.toLowerCase().includes("pain") || userInput.toLowerCase().includes("hurt") || userInput.toLowerCase().includes("sore")) {
      category = "pain";
    } else if (userInput.toLowerCase().includes("recovery") || userInput.toLowerCase().includes("heal") || userInput.toLowerCase().includes("rest")) {
      category = "recovery";
    } else if (userInput.toLowerCase().includes("exercise") || userInput.toLowerCase().includes("workout") || userInput.toLowerCase().includes("rehab")) {
      category = "exercises";
    } else if (userInput.toLowerCase().includes("mobility") || userInput.toLowerCase().includes("flexibility") || userInput.toLowerCase().includes("stretch")) {
      category = "mobility";
    } else if (userInput.toLowerCase().includes("posture") || userInput.toLowerCase().includes("alignment")) {
      category = "posture";
    } else if (userInput.toLowerCase().includes("breathing") || userInput.toLowerCase().includes("breath") || userInput.toLowerCase().includes("stress")) {
      category = "breathing";
    } else if (userInput.toLowerCase().includes("prevent") || userInput.toLowerCase().includes("avoid")) {
      category = "prevention";
    }

    const categoryResponses = expertResponses[category] || expertResponses["exercises"];
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
        <Text style={styles.headerTitle}>Dr. Recovery</Text>
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

export default PTBuddyScreen;
