import React, { useState, useEffect } from 'react';
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

const NutritionScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    fiber: 25
  });
  const [currentIntake, setCurrentIntake] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const popularFoods = [
    {
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=150&h=150&fit=crop"
    },
    {
      name: "Brown Rice",
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop"
    },
    {
      name: "Avocado",
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=150&h=150&fit=crop"
    },
    {
      name: "Greek Yogurt",
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0,
      fiber: 0,
      image: "https://images.unsplash.com/photo-1571212057172-747c46a6cd96?w=150&h=150&fit=crop"
    },
    {
      name: "Salmon Fillet",
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&h=150&fit=crop"
    },
    {
      name: "Sweet Potato",
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      fiber: 3,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&h=150&fit=crop"
    }
  ];

  const mealTimes = [
    { key: 'breakfast', name: 'Breakfast', icon: 'sunny-outline', color: '#FFA726' },
    { key: 'lunch', name: 'Lunch', icon: 'partly-sunny-outline', color: '#FF7043' },
    { key: 'dinner', name: 'Dinner', icon: 'moon-outline', color: '#5C6BC0' },
    { key: 'snacks', name: 'Snacks', icon: 'cafe-outline', color: '#66BB6A' }
  ];

  useEffect(() => {
    calculateCurrentIntake();
  }, [meals]);

  const calculateCurrentIntake = () => {
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    Object.values(meals).forEach(meal => {
      meal.forEach(food => {
        total.calories += food.calories;
        total.protein += food.protein;
        total.carbs += food.carbs;
        total.fat += food.fat;
        total.fiber += food.fiber;
      });
    });
    
    setCurrentIntake(total);
  };

  const addFoodToMeal = (food) => {
    setMeals(prev => ({
      ...prev,
      [selectedMeal]: [...prev[selectedMeal], food]
    }));
    setShowAddFood(false);
  };

  const removeFoodFromMeal = (mealType, index) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index)
    }));
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return '#4CAF50';
    if (percentage >= 80) return '#FF9800';
    return '#F44336';
  };

  const renderMacroProgress = (label, current, goal, unit, color) => (
    <View style={styles.macroItem}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{current}g / {goal}g</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[
          styles.progressFill,
          {
            width: `${getProgressPercentage(current, goal)}%`,
            backgroundColor: color
          }
        ]} />
      </View>
    </View>
  );

  const renderMealSection = (mealType) => {
    const meal = mealTimes.find(m => m.key === mealType);
    const mealFoods = meals[mealType];
    
    return (
      <View key={mealType} style={styles.mealSection}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <Ionicons name={meal.icon} size={24} color={meal.color} />
            <Text style={styles.mealTitle}>{meal.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: meal.color }]}
            onPress={() => {
              setSelectedMeal(mealType);
              setShowAddFood(true);
            }}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        {mealFoods.length === 0 ? (
          <View style={styles.emptyMeal}>
            <Text style={styles.emptyMealText}>No foods added yet</Text>
            <Text style={styles.emptyMealSubtext}>Tap + to add foods</Text>
          </View>
        ) : (
          mealFoods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Image source={{ uri: food.image }} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodMacros}>
                  {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFoodFromMeal(mealType, index)}
              >
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
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
        <Text style={styles.headerTitle}>Nutrition Tracker</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Daily Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Today's Nutrition</Text>
          
          {/* Calories */}
          <View style={styles.caloriesSection}>
            <Text style={styles.caloriesLabel}>Calories</Text>
            <Text style={styles.caloriesValue}>
              {currentIntake.calories} / {dailyGoals.calories}
            </Text>
            <View style={styles.caloriesProgressBar}>
              <View style={[
                styles.caloriesProgressFill,
                {
                  width: `${getProgressPercentage(currentIntake.calories, dailyGoals.calories)}%`,
                  backgroundColor: getProgressColor(currentIntake.calories, dailyGoals.calories)
                }
              ]} />
            </View>
          </View>

          {/* Macros */}
          <View style={styles.macrosContainer}>
            {renderMacroProgress('Protein', currentIntake.protein, dailyGoals.protein, 'g', '#FF5722')}
            {renderMacroProgress('Carbs', currentIntake.carbs, dailyGoals.carbs, 'g', '#2196F3')}
            {renderMacroProgress('Fat', currentIntake.fat, dailyGoals.fat, 'g', '#FFC107')}
            {renderMacroProgress('Fiber', currentIntake.fiber, dailyGoals.fiber, 'g', '#4CAF50')}
          </View>
        </View>

        {/* Meals */}
        {mealTimes.map(meal => renderMealSection(meal.key))}
      </ScrollView>

      {/* Add Food Modal */}
      <Modal
        visible={showAddFood}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddFood(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food to {mealTimes.find(m => m.key === selectedMeal)?.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddFood(false)}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.foodList}>
              {popularFoods.map((food, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.foodOption}
                  onPress={() => addFoodToMeal(food)}
                >
                  <Image source={{ uri: food.image }} style={styles.foodOptionImage} />
                  <View style={styles.foodOptionInfo}>
                    <Text style={styles.foodOptionName}>{food.name}</Text>
                    <Text style={styles.foodOptionMacros}>
                      {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={24} color="#667eea" />
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  caloriesSection: {
    marginBottom: 20,
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 5,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  caloriesProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  caloriesProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosContainer: {
    gap: 15,
  },
  macroItem: {
    marginBottom: 10,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  macroLabel: {
    fontSize: 14,
    color: '#cccccc',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  mealSection: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMeal: {
    alignItems: 'center',
    padding: 20,
  },
  emptyMealText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  emptyMealSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  foodMacros: {
    fontSize: 12,
    color: '#cccccc',
  },
  removeButton: {
    padding: 5,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  foodList: {
    maxHeight: 400,
  },
  foodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  foodOptionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  foodOptionInfo: {
    flex: 1,
  },
  foodOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  foodOptionMacros: {
    fontSize: 12,
    color: '#cccccc',
  },
});

export default NutritionScreen;
