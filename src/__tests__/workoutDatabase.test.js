import { workoutDatabase } from '../data/workoutDatabase';

describe('Workout Database', () => {
  test('should have at least 50 exercises', () => {
    expect(workoutDatabase.length).toBeGreaterThanOrEqual(50);
  });

  test('should have required properties for each exercise', () => {
    workoutDatabase.forEach(workout => {
      expect(workout).toHaveProperty('id');
      expect(workout).toHaveProperty('name');
      expect(workout).toHaveProperty('targetMuscles');
      expect(workout).toHaveProperty('difficulty');
      expect(workout).toHaveProperty('thumbnail');
      expect(workout).toHaveProperty('description');
      expect(workout).toHaveProperty('tips');
      expect(workout).toHaveProperty('commonMistakes');
      expect(workout).toHaveProperty('safetyTips');
    });
  });

  test('should have valid difficulty levels', () => {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    workoutDatabase.forEach(workout => {
      expect(validDifficulties).toContain(workout.difficulty);
    });
  });

  test('should have unique IDs', () => {
    const ids = workoutDatabase.map(workout => workout.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('should have non-empty arrays for tips and mistakes', () => {
    workoutDatabase.forEach(workout => {
      expect(workout.tips.length).toBeGreaterThan(0);
      expect(workout.commonMistakes.length).toBeGreaterThan(0);
      expect(workout.targetMuscles.length).toBeGreaterThan(0);
    });
  });
});


