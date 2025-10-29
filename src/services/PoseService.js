import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

let detector = null;
let isInitialized = false;

export const initializePoseDetection = async () => {
  if (isInitialized) return true;
  
  try {
    console.log('🤖 Initializing TensorFlow.js...');
    
    // Initialize TensorFlow.js
    await tf.ready();
    console.log('✅ TensorFlow.js ready');

    // Import pose-detection dynamically
    const poseDetection = require('@tensorflow-models/pose-detection');
    
    // Create MoveNet detector
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      }
    );
    
    isInitialized = true;
    console.log('✅ MoveNet detector initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize pose detection:', error);
    return false;
  }
};

export const detectPose = async (imageTensor) => {
  if (!isInitialized || !detector) {
    console.warn('⚠️ Detector not initialized');
    return null;
  }

  try {
    const poses = await detector.estimatePoses(imageTensor);
    return poses.length > 0 ? poses[0] : null;
  } catch (error) {
    console.error('❌ Error detecting pose:', error);
    return null;
  }
};

export const disposePoseDetection = () => {
  if (detector) {
    detector.dispose();
    detector = null;
  }
  isInitialized = false;
};

