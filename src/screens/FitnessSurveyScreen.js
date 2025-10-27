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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const FitnessSurveyScreen = ({ navigation = null }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { updateUserProfile } = useUser();

  // Base questions that apply to everyone
  const baseQuestions = [
    {
      id: 'age',
      question: 'What is your age?',
      type: 'input',
      unit: 'years'
    },
    {
      id: 'gender',
      question: 'What is your gender?',
      type: 'options',
      options: [
        { id: 'male', label: 'Male' },
        { id: 'female', label: 'Female' },
        { id: 'other', label: 'Other' }
      ]
    },
    {
      id: 'height',
      question: 'What is your height? (in)',
      type: 'input',
      unit: 'in'
    },
    {
      id: 'weight',
      question: 'What is your current weight? (lb)',
      type: 'input',
      unit: 'lb'
    },
    {
      id: 'neck',
      question: 'What is your neck circumference? (in)',
      type: 'input',
      unit: 'in'
    },
    {
      id: 'waist',
      question: 'What is your waist circumference? (in)',
      type: 'input',
      unit: 'in'
    },
  ];

  // Hip question only for females (inserted after waist)
  const hipQuestion = {
    id: 'hip',
    question: 'What is your hip circumference? (in)',
    type: 'input',
    unit: 'in'
  };

  // Rest of the questions
  const remainingQuestions = [
    {
      id: 'gymExperience',
      question: 'Are you new to the gym?',
      type: 'options',
      options: [
        { id: 'yes', label: 'Yes, completely new', description: 'First time in a gym' },
        { id: 'somewhat', label: 'Somewhat experienced', description: 'Been to gym a few times' },
        { id: 'experienced', label: 'Experienced', description: 'Regular gym goer' }
      ]
    },
    {
      id: 'primaryGoal',
      question: 'What\'s your primary fitness goal?',
      type: 'options',
      options: [
        { id: 'weightLoss', label: 'Weight Loss', description: 'Lose weight and burn fat' },
        { id: 'muscleGain', label: 'Muscle Gain', description: 'Build muscle and strength' },
        { id: 'endurance', label: 'Endurance', description: 'Improve cardiovascular fitness' },
        { id: 'general', label: 'General Fitness', description: 'Stay healthy and active' }
      ]
    },
    {
      id: 'targetWeight',
      question: 'What is your target weight? (lb)',
      type: 'input',
      unit: 'lb'
    },
    {
      id: 'targetBodyFat',
      question: 'What is your target body fat percentage?',
      type: 'input',
      unit: '%'
    }
  ];

  // Dynamically build questions based on gender
  const questions = React.useMemo(() => {
    // Find the index where waist question is
    const waistIndex = baseQuestions.findIndex(q => q.id === 'waist');
    
    // If gender is female, insert hip question after waist
    if (answers.gender === 'female' && waistIndex !== -1) {
      return [
        ...baseQuestions.slice(0, waistIndex + 1),
        hipQuestion,
        ...remainingQuestions
      ];
    }
    
    // For males and others, no hip question
    return [...baseQuestions, ...remainingQuestions];
  }, [answers.gender]);

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

  // Calculate Body Fat Percentage using U.S. Navy Method
  const calculateBodyFatPercentage = (height, neck, waist, hip, gender) => {
    const heightNum = parseFloat(height);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    
    // Validate required measurements
    if (!heightNum || !neckNum || !waistNum || !gender) {
      return null;
    }
    
    // For females, hip measurement is required
    if (gender === 'female' && !hipNum) {
      return null;
    }
    
    let bodyFat;
    
    if (gender === 'male') {
      // U.S. Navy Method for Males (USC Units - inches)
      // BFP = 86.010×log₁₀(abdomen-neck) - 70.041×log₁₀(height) + 36.76
      const abdomenMinusNeck = waistNum - neckNum;
      
      if (abdomenMinusNeck <= 0) {
        return null; // Invalid measurement
      }
      
      bodyFat = 86.010 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(heightNum) + 36.76;
    } else if (gender === 'female') {
      // U.S. Navy Method for Females (USC Units - inches)
      // BFP = 163.205×log₁₀(waist+hip-neck) - 97.684×log₁₀(height) - 78.387
      const waistPlusHipMinusNeck = waistNum + hipNum - neckNum;
      
      if (waistPlusHipMinusNeck <= 0) {
        return null; // Invalid measurement
      }
      
      bodyFat = 163.205 * Math.log10(waistPlusHipMinusNeck) - 97.684 * Math.log10(heightNum) - 78.387;
    } else {
      // For 'other' gender, use male formula as default
      const abdomenMinusNeck = waistNum - neckNum;
      
      if (abdomenMinusNeck <= 0) {
        return null;
      }
      
      bodyFat = 86.010 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(heightNum) + 36.76;
    }
    
    // Ensure the result is between 5% and 50%
    const clampedBFP = Math.max(5, Math.min(50, bodyFat));
    
    return Math.round(clampedBFP * 10) / 10; // Round to 1 decimal place
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // Separate body measurements from other answers
      const bodyMeasurements = {};
      const fitnessGoals = {};
      
      questions.forEach(q => {
        if (['age', 'gender', 'height', 'weight', 'neck', 'waist', 'hip', 'targetWeight', 'targetBodyFat'].includes(q.id)) {
          bodyMeasurements[q.id] = answers[q.id] || '';
        } else {
          fitnessGoals[q.id] = answers[q.id] || '';
        }
      });
      
      console.log('Saving survey data:', { bodyMeasurements, fitnessGoals });
      
      // Convert empty strings to numbers or leave as is
      const processedMeasurements = {};
      Object.keys(bodyMeasurements).forEach(key => {
        const value = bodyMeasurements[key];
        if (key === 'gender') {
          processedMeasurements[key] = value; // Keep gender as string
        } else {
          processedMeasurements[key] = value ? parseFloat(value) || value : '';
        }
      });
      
      // Calculate body fat percentage using U.S. Navy Method
      const bodyFatPercentage = calculateBodyFatPercentage(
        processedMeasurements.height,
        processedMeasurements.neck,
        processedMeasurements.waist,
        processedMeasurements.hip,
        processedMeasurements.gender
      );
      
      if (bodyFatPercentage !== null) {
        processedMeasurements.bodyFat = bodyFatPercentage;
        console.log('Calculated body fat percentage:', bodyFatPercentage + '%');
      }
      
      console.log('Processed measurements:', processedMeasurements);
      
      // Save survey answers to user profile
      await updateUserProfile({
        ...processedMeasurements,
        fitnessGoals,
        surveyCompleted: true
      });
      
      console.log('Survey completed successfully - profile will update and screen will change');
      
      // Wait a moment for the state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Survey completion error:', error);
      Alert.alert('Error', `Failed to save your preferences: ${error.message || error.toString()}`);
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
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="fitness" size={50} color="#00d4ff" />
          </View>
          <Text style={styles.title}>Let's Get Started!</Text>
          <Text style={styles.subtitle}>
            Help us personalize your GymGuard experience
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
                placeholder={`Enter ${currentQ.id} in ${currentQ.unit}`}
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
              <Ionicons name="chevron-back" size={20} color="#ffffff" />
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
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
    color: '#999999',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    fontSize: 18,
    color: '#ffffff',
    borderWidth: 2,
    borderColor: '#333333',
  },
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
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
    color: '#ffffff',
  },
  optionLabelSelected: {
    color: '#00d4ff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: '#ffffff',
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
    color: '#ffffff',
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
    backgroundColor: '#666666',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 5,
  },
});

export default FitnessSurveyScreen;
