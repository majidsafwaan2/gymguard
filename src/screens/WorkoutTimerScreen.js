import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const WorkoutTimerScreen = ({ navigation }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('work'); // 'work', 'rest', 'break'
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(4);
  const [workTime, setWorkTime] = useState(45); // seconds
  const [restTime, setRestTime] = useState(15); // seconds
  const [breakTime, setBreakTime] = useState(60); // seconds
  const [sound, setSound] = useState(null);
  
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initialize timer with work time
    setTimeLeft(workTime);
    
    // Load sound
    loadSound();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
      );
      setSound(newSound);
    } catch (error) {
      console.log('Error loading sound:', error);
    }
  };

  const playSound = async () => {
    try {
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (currentPhase === 'work') {
      setTimeLeft(workTime);
    } else if (currentPhase === 'rest') {
      setTimeLeft(restTime);
    } else {
      setTimeLeft(breakTime);
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Vibrate and play sound
    Vibration.vibrate([0, 500, 200, 500]);
    playSound();
    
    // Move to next phase
    if (currentPhase === 'work') {
      if (currentSet < totalSets) {
        setCurrentPhase('rest');
        setTimeLeft(restTime);
        Alert.alert('Rest Time!', 'Take a short rest before your next set.');
      } else {
        setCurrentPhase('break');
        setTimeLeft(breakTime);
        Alert.alert('Break Time!', 'Great job! Take a longer break before your next exercise.');
      }
    } else if (currentPhase === 'rest') {
      setCurrentSet(prev => prev + 1);
      setCurrentPhase('work');
      setTimeLeft(workTime);
      Alert.alert('Next Set!', `Set ${currentSet + 1} of ${totalSets}. Let's go!`);
    } else {
      // Break finished, reset for next exercise
      setCurrentSet(1);
      setCurrentPhase('work');
      setTimeLeft(workTime);
      Alert.alert('Ready for Next Exercise!', 'Time to move on to your next exercise!');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'work': return '#FF6B6B';
      case 'rest': return '#4ECDC4';
      case 'break': return '#45B7D1';
      default: return '#667eea';
    }
  };

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'work': return 'fitness';
      case 'rest': return 'pause-circle';
      case 'break': return 'cafe';
      default: return 'play-circle';
    }
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'work': return 'Work Time';
      case 'rest': return 'Rest Time';
      case 'break': return 'Break Time';
      default: return 'Timer';
    }
  };

  const adjustTime = (phase, increment) => {
    const newTime = Math.max(5, Math.min(300, (phase === 'work' ? workTime : phase === 'rest' ? restTime : breakTime) + increment));
    
    if (phase === 'work') {
      setWorkTime(newTime);
      if (currentPhase === 'work') {
        setTimeLeft(newTime);
      }
    } else if (phase === 'rest') {
      setRestTime(newTime);
      if (currentPhase === 'rest') {
        setTimeLeft(newTime);
      }
    } else {
      setBreakTime(newTime);
      if (currentPhase === 'break') {
        setTimeLeft(newTime);
      }
    }
  };

  const adjustSets = (increment) => {
    const newSets = Math.max(1, Math.min(10, totalSets + increment));
    setTotalSets(newSets);
    if (currentSet > newSets) {
      setCurrentSet(newSets);
    }
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
        <Text style={styles.headerTitle}>Workout Timer</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Current Set Info */}
        <View style={styles.setInfo}>
          <Text style={styles.setText}>Set {currentSet} of {totalSets}</Text>
        </View>

        {/* Timer Display */}
        <View style={[styles.timerContainer, { backgroundColor: getPhaseColor() }]}>
          <View style={styles.timerHeader}>
            <Ionicons name={getPhaseIcon()} size={32} color="#ffffff" />
            <Text style={styles.phaseTitle}>{getPhaseTitle()}</Text>
          </View>
          
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={isRunning ? pauseTimer : startTimer}
            >
              <Ionicons 
                name={isRunning ? "pause" : "play"} 
                size={32} 
                color="#ffffff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={resetTimer}
            >
              <Ionicons name="refresh" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Panel */}
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Timer Settings</Text>
          
          {/* Work Time */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Work Time</Text>
            <View style={styles.settingControls}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustTime('work', -5)}
              >
                <Ionicons name="remove" size={20} color="#667eea" />
              </TouchableOpacity>
              <Text style={styles.settingValue}>{workTime}s</Text>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustTime('work', 5)}
              >
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Rest Time */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rest Time</Text>
            <View style={styles.settingControls}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustTime('rest', -5)}
              >
                <Ionicons name="remove" size={20} color="#667eea" />
              </TouchableOpacity>
              <Text style={styles.settingValue}>{restTime}s</Text>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustTime('rest', 5)}
              >
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Break Time */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Break Time</Text>
            <View style={styles.settingControls}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustTime('break', -15)}
              >
                <Ionicons name="remove" size={20} color="#667eea" />
              </TouchableOpacity>
              <Text style={styles.settingValue}>{breakTime}s</Text>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustTime('break', 15)}
              >
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Sets */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Total Sets</Text>
            <View style={styles.settingControls}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustSets(-1)}
              >
                <Ionicons name="remove" size={20} color="#667eea" />
              </TouchableOpacity>
              <Text style={styles.settingValue}>{totalSets}</Text>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustSets(1)}
              >
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              setCurrentPhase('work');
              setTimeLeft(workTime);
              setCurrentSet(1);
            }}
          >
            <Ionicons name="refresh-circle" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Reset Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              Alert.alert('Workout Complete!', 'Great job on finishing your workout!');
              navigation.goBack();
            }}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Finish Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  setInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  setText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timerContainer: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  adjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    minWidth: 40,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default WorkoutTimerScreen;
