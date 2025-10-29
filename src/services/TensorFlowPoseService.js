import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

// TensorFlow.js is compatible with Expo via polyfills for fetch and crypto
// We need to ensure polyfills are in place at app initialization
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

class TensorFlowPoseService {
  constructor() {
    this.detector = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🤖 Initializing TensorFlow.js PoseNet...');
      
      // Create the detector using MoveNet (fast, mobile-optimized model)
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // High accuracy
          enableSmoothing: true,
          minPoseScore: 0.25,
        }
      );
      
      this.isInitialized = true;
      console.log('✅ TensorFlow.js PoseNet initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize TensorFlow.js PoseNet:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async detectPose(imageElement) {
    if (!this.isInitialized || !this.detector) {
      console.warn('⚠️ Pose detector not initialized');
      return null;
    }

    try {
      // Estimate poses in the image
      const poses = await this.detector.estimatePoses(imageElement);
      
      // Return the first (and only) pose for single person detection
      return poses[0] || null;
    } catch (error) {
      console.error('❌ Pose detection error:', error);
      return null;
    }
  }

  dispose() {
    if (this.detector) {
      // Clean up resources
      this.isInitialized = false;
      console.log('🧹 TensorFlow PoseNet disposed');
    }
  }
}

export default new TensorFlowPoseService();
