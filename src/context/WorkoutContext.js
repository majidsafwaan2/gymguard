import React, { createContext, useContext, useState } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  const addAnalysisResult = (result) => {
    const newAnalysis = {
      id: Date.now(),
      workoutId: selectedWorkout?.id,
      workoutName: selectedWorkout?.name,
      date: new Date().toISOString(),
      score: result.score,
      feedback: result.feedback,
      keypoints: result.keypoints,
    };
    
    setAnalysisHistory(prev => [newAnalysis, ...prev]);
    setCurrentAnalysis(newAnalysis);
  };

  const getWorkoutProgress = (workoutId) => {
    return analysisHistory.filter(analysis => analysis.workoutId === workoutId);
  };

  const getOverallProgress = () => {
    return analysisHistory.map(analysis => ({
      date: analysis.date,
      score: analysis.score,
      workoutName: analysis.workoutName,
    }));
  };

  const value = {
    selectedWorkout,
    setSelectedWorkout,
    analysisHistory,
    currentAnalysis,
    setCurrentAnalysis,
    addAnalysisResult,
    getWorkoutProgress,
    getOverallProgress,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};

export { WorkoutContext };


