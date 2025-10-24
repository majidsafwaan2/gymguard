import { WorkoutProvider, useWorkoutContext } from '../context/WorkoutContext';
import React from 'react';
import { render } from '@testing-library/react-native';

// Test component to access context
const TestComponent = () => {
  const context = useWorkoutContext();
  return React.createElement('Text', { testID: 'context-test' }, JSON.stringify(context));
};

describe('WorkoutContext', () => {
  test('should provide context values', () => {
    const { getByTestId } = render(
      React.createElement(WorkoutProvider, null, React.createElement(TestComponent))
    );
    
    const contextText = getByTestId('context-test').props.children;
    const context = JSON.parse(contextText);
    
    expect(context).toHaveProperty('selectedWorkout');
    expect(context).toHaveProperty('analysisHistory');
    expect(context).toHaveProperty('currentAnalysis');
    expect(context).toHaveProperty('setSelectedWorkout');
    expect(context).toHaveProperty('addAnalysisResult');
    expect(context).toHaveProperty('getWorkoutProgress');
    expect(context).toHaveProperty('getOverallProgress');
  });

  test('should initialize with empty state', () => {
    const { getByTestId } = render(
      React.createElement(WorkoutProvider, null, React.createElement(TestComponent))
    );
    
    const contextText = getByTestId('context-test').props.children;
    const context = JSON.parse(contextText);
    
    expect(context.selectedWorkout).toBeNull();
    expect(context.analysisHistory).toEqual([]);
    expect(context.currentAnalysis).toBeNull();
  });
});


