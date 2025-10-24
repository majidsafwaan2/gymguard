import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  const [currentExpert, setCurrentExpert] = useState('Coach Mike');

  const experts = [
    { name: 'Coach Mike', specialty: 'Strength Training', avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face" },
    { name: 'Dr. Sarah', specialty: 'Nutrition & Recovery', avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face" },
    { name: 'Trainer Alex', specialty: 'Cardio & HIIT', avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" }
  ];

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
      // Simulate AI response
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
    }
  };

  const generateAIResponse = async (userInput, expert) => {
    const responses = {
      "Coach Mike": [
        "For strength training, focus on compound movements like squats, deadlifts, and bench press. Start with 3-4 sets of 6-8 reps for maximum strength gains! 💪",
        "Progressive overload is key! Increase weight by 2.5-5lbs each week. Your muscles need constant challenge to grow stronger.",
        "Keep your core tight and maintain a neutral spine throughout the movement. This prevents injury and maximizes muscle engagement."
      ],
      "Dr. Sarah": [
        "Focus on whole foods: lean proteins, complex carbs, healthy fats, and plenty of vegetables. Aim for 5-7 servings of fruits/veggies daily.",
        "Sleep 7-9 hours nightly. This is when your body repairs and builds muscle tissue.",
        "Eat 1g of protein per lb of bodyweight daily. Chicken, fish, eggs, and Greek yogurt are excellent sources."
      ],
      "Trainer Alex": [
        "HIIT workouts burn more calories in less time! Try 30 seconds work, 30 seconds rest for 15-20 minutes.",
        "Consistency beats perfection! Even 20 minutes of exercise is better than nothing.",
        "Mix up your cardio! Running, cycling, rowing, and swimming all work different muscle groups."
      ]
    };

    const expertResponses = responses[expert] || responses["Coach Mike"];
    return expertResponses[Math.floor(Math.random() * expertResponses.length)];
  };

  const renderMessage = (message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!message.isUser && (
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: experts.find(e => e.name === currentExpert)?.avatar }} 
            style={styles.avatar} 
          />
        </View>
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
    <>
      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="chatbubbles" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.chatHeader}>
              <View style={styles.headerLeft}>
                <Image 
                  source={{ uri: experts.find(e => e.name === currentExpert)?.avatar }} 
                  style={styles.headerAvatar} 
                />
                <View>
                  <Text style={styles.headerName}>{currentExpert}</Text>
                  <Text style={styles.headerSpecialty}>
                    {experts.find(e => e.name === currentExpert)?.specialty}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Expert Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.expertSelector}>
              {experts.map((expert) => (
                <TouchableOpacity
                  key={expert.name}
                  style={[
                    styles.expertCard,
                    currentExpert === expert.name && styles.selectedExpert
                  ]}
                  onPress={() => setCurrentExpert(expert.name)}
                >
                  <Image source={{ uri: expert.avatar }} style={styles.expertAvatar} />
                  <Text style={styles.expertName}>{expert.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Messages */}
            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
              {messages.map(renderMessage)}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>AI is thinking...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.inputContainer}
            >
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={`Ask ${currentExpert} anything...`}
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
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00d4ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: height * 0.6,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpecialty: {
    fontSize: 12,
    color: '#cccccc',
  },
  closeButton: {
    padding: 5,
  },
  expertSelector: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 0,
  },
  expertCard: {
    alignItems: 'center',
    marginRight: 15,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#2d2d2d',
    minWidth: 100,
    height: 70,
    justifyContent: 'center',
  },
  selectedExpert: {
    backgroundColor: '#00d4ff',
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
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: -20,
  },
  messagesContent: {
    paddingBottom: 20,
    paddingTop: -15,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'center',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#00d4ff',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#2d2d2d',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 10,
    color: '#999999',
    marginTop: 5,
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#cccccc',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2d2d2d',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    color: '#ffffff',
  },
  sendButton: {
    backgroundColor: '#00d4ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#666666',
  },
});

export default FloatingChatbot;
