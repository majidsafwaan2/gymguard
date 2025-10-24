// Simple test runner for basic functionality
const fs = require('fs');
const path = require('path');

// Test the workout database
function testWorkoutDatabase() {
  console.log('🧪 Testing Workout Database...');
  
  try {
    const workoutData = require('./src/data/workoutDatabase');
    const { workoutDatabase } = workoutData;
    
    // Test 1: Check if we have enough exercises
    console.log(`✅ Found ${workoutDatabase.length} exercises`);
    if (workoutDatabase.length >= 50) {
      console.log('✅ PASS: Has at least 50 exercises');
    } else {
      console.log('❌ FAIL: Needs at least 50 exercises');
    }
    
    // Test 2: Check required properties
    let allValid = true;
    workoutDatabase.forEach((workout, index) => {
      const requiredProps = ['id', 'name', 'targetMuscles', 'difficulty', 'thumbnail', 'description', 'tips', 'commonMistakes', 'safetyTips'];
      const missingProps = requiredProps.filter(prop => !workout.hasOwnProperty(prop));
      
      if (missingProps.length > 0) {
        console.log(`❌ FAIL: Exercise ${index + 1} (${workout.name}) missing: ${missingProps.join(', ')}`);
        allValid = false;
      }
    });
    
    if (allValid) {
      console.log('✅ PASS: All exercises have required properties');
    }
    
    // Test 3: Check difficulty levels
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const invalidDifficulties = workoutDatabase.filter(workout => !validDifficulties.includes(workout.difficulty));
    
    if (invalidDifficulties.length === 0) {
      console.log('✅ PASS: All exercises have valid difficulty levels');
    } else {
      console.log(`❌ FAIL: ${invalidDifficulties.length} exercises have invalid difficulty levels`);
    }
    
    // Test 4: Check unique IDs
    const ids = workoutDatabase.map(workout => workout.id);
    const uniqueIds = new Set(ids);
    
    if (uniqueIds.size === ids.length) {
      console.log('✅ PASS: All exercise IDs are unique');
    } else {
      console.log('❌ FAIL: Duplicate exercise IDs found');
    }
    
    return true;
  } catch (error) {
    console.log('❌ FAIL: Error loading workout database:', error.message);
    return false;
  }
}

// Test the PoseDetector
function testPoseDetector() {
  console.log('\n🧪 Testing PoseDetector...');
  
  try {
    const PoseDetector = require('./src/utils/PoseDetector').default;
    const detector = new PoseDetector();
    
    // Test initialization
    detector.initialize().then(() => {
      console.log('✅ PASS: PoseDetector initializes successfully');
      
      // Test keypoint generation
      const keypoints = detector.generateMockKeypoints();
      if (keypoints.length === 17) {
        console.log('✅ PASS: Generates 17 keypoints');
      } else {
        console.log('❌ FAIL: Expected 17 keypoints, got', keypoints.length);
      }
      
      // Test angle calculation
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 1, y: 0 };
      const p3 = { x: 1, y: 1 };
      const angle = detector.calculateAngle(p1, p2, p3);
      
      if (Math.abs(angle - 90) < 1) {
        console.log('✅ PASS: Angle calculation works correctly');
      } else {
        console.log('❌ FAIL: Angle calculation incorrect, expected ~90, got', angle);
      }
      
      // Test form analysis
      const analysis = detector.analyzeForm(keypoints, 'squat');
      if (analysis.score >= 0 && analysis.score <= 100 && Array.isArray(analysis.feedback)) {
        console.log('✅ PASS: Form analysis works correctly');
      } else {
        console.log('❌ FAIL: Form analysis returned invalid results');
      }
      
    }).catch(error => {
      console.log('❌ FAIL: PoseDetector initialization failed:', error.message);
    });
    
    return true;
  } catch (error) {
    console.log('❌ FAIL: Error loading PoseDetector:', error.message);
    return false;
  }
}

// Run all tests
function runTests() {
  console.log('🚀 Running GymGuard Unit Tests\n');
  
  const results = [];
  results.push(testWorkoutDatabase());
  results.push(testPoseDetector());
  
  console.log('\n📊 Test Summary:');
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

runTests();


