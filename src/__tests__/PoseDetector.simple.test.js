// Simple unit test for PoseDetector without React Native dependencies
const PoseDetector = require('../utils/PoseDetector').default;

describe('PoseDetector Basic Tests', () => {
  let poseDetector;

  beforeEach(() => {
    poseDetector = new PoseDetector();
  });

  test('should initialize successfully', async () => {
    await expect(poseDetector.initialize()).resolves.not.toThrow();
    expect(poseDetector.isInitialized).toBe(true);
  });

  test('should generate mock keypoints', async () => {
    await poseDetector.initialize();
    const keypoints = poseDetector.generateMockKeypoints();
    
    expect(keypoints).toHaveLength(17);
    keypoints.forEach(keypoint => {
      expect(keypoint).toHaveProperty('x');
      expect(keypoint).toHaveProperty('y');
      expect(keypoint).toHaveProperty('score');
      expect(typeof keypoint.x).toBe('number');
      expect(typeof keypoint.y).toBe('number');
      expect(typeof keypoint.score).toBe('number');
      expect(keypoint.score).toBeGreaterThanOrEqual(0);
      expect(keypoint.score).toBeLessThanOrEqual(1);
    });
  });

  test('should calculate angles correctly', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 1, y: 0 };
    const p3 = { x: 1, y: 1 };
    
    const angle = poseDetector.calculateAngle(p1, p2, p3);
    expect(angle).toBeCloseTo(90, 1);
  });

  test('should analyze squat form', async () => {
    await poseDetector.initialize();
    const keypoints = poseDetector.generateMockKeypoints();
    
    const analysis = poseDetector.analyzeForm(keypoints, 'squat');
    
    expect(analysis).toHaveProperty('score');
    expect(analysis).toHaveProperty('feedback');
    expect(analysis).toHaveProperty('keypoints');
    expect(analysis.score).toBeGreaterThanOrEqual(0);
    expect(analysis.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(analysis.feedback)).toBe(true);
  });
});


