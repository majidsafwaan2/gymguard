import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const FitnessSurveyScreen = ({ navigation = null }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { userProfile, updateUserProfile } = useUser();

  // Basic patient information questions
  const questions = [
    {
      id: 'age',
      question: 'What is your age?',
      type: 'input',
      unit: 'years',
      placeholder: 'Enter your age'
    },
    {
      id: 'gender',
      question: 'What is your gender?',
      type: 'options',
      options: [
        { id: 'male', label: 'Male', description: 'Male' },
        { id: 'female', label: 'Female', description: 'Female' },
        { id: 'other', label: 'Other', description: 'Prefer not to say or other' }
      ]
    },
    {
      id: 'height',
      question: 'What is your height?',
      type: 'input',
      unit: 'inches',
      placeholder: 'Enter your height in inches'
    },
    {
      id: 'weight',
      question: 'What is your current weight?',
      type: 'input',
      unit: 'lbs',
      placeholder: 'Enter your weight in pounds'
    },
  ];

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // Process personal information
      const personalInfo = {
        age: answers.age ? parseFloat(answers.age) : '',
        gender: answers.gender || '',
        height: answers.height ? parseFloat(answers.height) : '',
        weight: answers.weight ? parseFloat(answers.weight) : '',
        surveyCompleted: true
      };
      
      console.log('Saving personal information:', personalInfo);
      
      // Save personal information to user profile
      await updateUserProfile(personalInfo);
      
      console.log('Personal information saved successfully');
      
      // Wait a moment for the state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Survey completion error:', error);
      Alert.alert('Error', `Failed to save your information: ${error.message || error.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const isAnswered = currentQ.type === 'options' 
    ? answers[currentQ.id] 
    : (currentQ.type === 'input' 
        ? (answers[currentQ.id] && answers[currentQ.id].trim() !== '')
        : answers[currentQ.id]);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>
            {userProfile?.userType === 'doctor' ? 'Personal Information' : 'Patient Information'}
          </Text>
          <Text style={styles.subtitle}>
            Please provide your basic information
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          
          {currentQ.type === 'input' ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={answers[currentQ.id] || ''}
                onChangeText={(text) => handleInputChange(currentQ.id, text)}
                keyboardType="numeric"
                placeholder={currentQ.placeholder || `Enter ${currentQ.id}`}
                placeholderTextColor="#666666"
              />
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {currentQ.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    answers[currentQ.id] === option.id && styles.optionCardSelected
                  ]}
                  onPress={() => handleAnswer(currentQ.id, option.id)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={[
                      styles.optionLabel,
                      answers[currentQ.id] === option.id && styles.optionLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    {answers[currentQ.id] === option.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#00d4ff" />
                    )}
                  </View>
                  <Text style={[
                    styles.optionDescription,
                    answers[currentQ.id] === option.id && styles.optionDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentQuestion > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePrevious}
            >
              <Ionicons name="chevron-back" size={20} color="#333333" />
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              !isAnswered && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={!isAnswered || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                </Text>
                {currentQuestion < questions.length - 1 && (
                  <Ionicons name="chevron-forward" size={20} color="#ffffff" />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    fontSize: 18,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionCardSelected: {
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  optionLabelSelected: {
    color: '#00d4ff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: '#333333',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  previousButtonText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 5,
  },
});

export default FitnessSurveyScreen;
