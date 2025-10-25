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
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentExpert, setCurrentExpert] = useState(null);

  const experts = [
    { 
      name: 'Coach Mike', 
      specialty: 'Strength Training', 
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face",
      prompt: "Hey! I'm Coach Mike, your strength training expert! I can help you with proper form, progressive overload, and building muscle. What's your strength training goal?"
    },
    { 
      name: 'Dr. Sarah', 
      specialty: 'Nutrition & Recovery', 
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face",
      prompt: "Hi! I'm Dr. Sarah, your nutrition and recovery specialist! I can help you with meal planning, supplements, sleep optimization, and injury prevention. How can I help you recover better?"
    },
    { 
      name: 'Trainer Alex', 
      specialty: 'Cardio & HIIT', 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      prompt: "What's up! I'm Alex, your cardio and HIIT coach! I can help you with fat loss, endurance training, and high-intensity workouts. Ready to get your heart pumping?"
    }
  ];

  const selectExpert = (expert) => {
    setCurrentExpert(expert);
    setMessages([{
      id: Date.now(),
      text: expert.prompt,
      isUser: false,
      timestamp: new Date(),
    }]);
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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand what you're looking for. Here's my advice:",
        "Based on your question, I'd recommend:",
        "Excellent point! Here's what I suggest:",
        "I've got some great tips for you on that topic."
      ];
      
      const botMessage = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)] + " This is a simulated response. In a real app, this would connect to an AI service.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const renderMessage = (message) => (
    <View key={message.id} style={styles.messageContainer}>
      {!message.isUser && (
        <Image 
          source={{ uri: currentExpert?.avatar }} 
          style={styles.messageAvatar} 
        />
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
              <Text style={styles.headerTitle}>Gym Buddy</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Expert Selection */}
            {!currentExpert && (
              <View style={styles.expertSelector}>
                <Text style={styles.selectorTitle}>Choose Your Expert</Text>
                <Text style={styles.selectorSubtitle}>Select a fitness expert to help you reach your goals</Text>
                <View style={styles.expertList}>
                  {experts.map((expert) => (
                    <TouchableOpacity
                      key={expert.name}
                      style={styles.expertCard}
                      onPress={() => selectExpert(expert)}
                    >
                      <View style={styles.expertCardContent}>
                        <Image source={{ uri: expert.avatar }} style={styles.expertAvatar} />
                        <View style={styles.expertInfo}>
                          <Text style={styles.expertCardName}>{expert.name}</Text>
                          <Text style={styles.expertCardSpecialty}>{expert.specialty}</Text>
                        </View>
                        <View style={styles.selectButton}>
                          <Ionicons name="arrow-forward" size={16} color="#00d4ff" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Messages */}
            {currentExpert && (
              <>
                <View style={styles.currentExpertHeader}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setCurrentExpert(null)}
                  >
                    <Ionicons name="arrow-back" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <Image 
                    source={{ uri: currentExpert.avatar }} 
                    style={styles.currentExpertAvatar} 
                  />
                  <View style={styles.expertHeaderInfo}>
                    <Text style={styles.currentExpertName}>{currentExpert.name}</Text>
                    <Text style={styles.currentExpertSpecialty}>{currentExpert.specialty}</Text>
                  </View>
                </View>
                
                <ScrollView style={styles.messagesContainer}>
                  <View style={styles.messagesContent}>
                    {messages.map((message) => renderMessage(message))}
                    {isLoading && (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Typing...</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>

                {/* Input */}
                <KeyboardAvoidingView 
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.inputContainer}
                >
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.textInput}
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="Ask your expert..."
                      placeholderTextColor="#666666"
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={sendMessage}
                      disabled={isLoading || !inputText.trim()}
                    >
                      <Ionicons name="send" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 120,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    backgroundColor: '#1a1a1a',
    height: height * 0.55,
    width: width * 0.9,
    borderRadius: 25,
    paddingTop: 20,
    paddingBottom: 100,
    position: 'relative',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  expertSelector: {
    padding: 20,
    flex: 1,
  },
  selectorTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectorSubtitle: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  expertList: {
    flex: 1,
    justifyContent: 'center',
  },
  expertCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    minHeight: 80,
  },
  expertCardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  expertInfo: {
    flex: 1,
  },
  expertCardName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expertCardSpecialty: {
    color: '#cccccc',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#333333',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentExpertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  currentExpertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  expertHeaderInfo: {
    flex: 1,
  },
  currentExpertName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentExpertSpecialty: {
    color: '#cccccc',
    fontSize: 12,
  },
  messagesContainer: {
    height: height * 0.25,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: '#00d4ff',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#2d2d2d',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#ffffff',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    color: '#cccccc',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00d4ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingChatbot;