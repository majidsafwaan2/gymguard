import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

class PoseAnalyzer {
  constructor() {
    this.detector = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🤖 Initializing pose detection...');
      
      // Initialize TensorFlow.js backend
      await tf.ready();
      
      // Create pose detector
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      );
      
      this.isInitialized = true;
      console.log('✅ Pose detection initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize pose detection:', error);
      return false;
    }
  }

  async analyzePose(imageElement) {
    if (!this.isInitialized || !this.detector) {
      throw new Error('Pose detector not initialized');
    }

    try {
      const poses = await this.detector.estimatePoses(imageElement);
      return poses[0] || null; // Return first pose detected
    } catch (error) {
      console.error('Error analyzing pose:', error);
      throw error;
    }
  }

  analyzeForm(pose, exerciseType, duration) {
    if (!pose) {
      return this.getDefaultAnalysis(exerciseType, duration);
    }

    const keypoints = pose.keypoints;
    const analysis = {
      score: 60,
      feedback: [],
      recommendations: [],
      keypoints: keypoints,
      confidence: pose.score || 0.8,
    };

    // Analyze based on exercise type
    switch (exerciseType?.toLowerCase()) {
      case 'squats':
        this.analyzeSquats(keypoints, analysis);
        break;
      case 'bench press':
        this.analyzeBenchPress(keypoints, analysis);
        break;
      case 'deadlift':
        this.analyzeDeadlift(keypoints, analysis);
        break;
      case 'overhead press':
        this.analyzeOverheadPress(keypoints, analysis);
        break;
      case 'bicep curls':
        this.analyzeBicepCurls(keypoints, analysis);
        break;
      case 'tricep extensions':
        this.analyzeTricepExtensions(keypoints, analysis);
        break;
      default:
        this.analyzeGeneralForm(keypoints, analysis);
    }

    // Adjust score based on duration
    if (duration < 5) {
      analysis.score -= 20;
      analysis.feedback.push({
        type: 'bad',
        message: 'Recording too short for proper analysis',
        bodyPart: 'Overall',
        severity: 'high'
      });
    } else if (duration > 30) {
      analysis.score -= 10;
      analysis.feedback.push({
        type: 'neutral',
        message: 'Recording too long, focus on a single set',
        bodyPart: 'Overall',
        severity: 'medium'
      });
    }

    analysis.score = Math.max(0, Math.min(100, analysis.score));
    return analysis;
  }

  analyzeSquats(keypoints, analysis) {
    const leftHip = this.getKeypoint(keypoints, 'left_hip');
    const rightHip = this.getKeypoint(keypoints, 'right_hip');
    const leftKnee = this.getKeypoint(keypoints, 'left_knee');
    const rightKnee = this.getKeypoint(keypoints, 'right_knee');
    const leftAnkle = this.getKeypoint(keypoints, 'left_ankle');
    const rightAnkle = this.getKeypoint(keypoints, 'right_ankle');

    if (leftHip && rightHip && leftKnee && rightKnee) {
      // Check hip-knee alignment
      const hipKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
      
      if (hipKneeAngle > 90) {
        analysis.score += 15;
        analysis.feedback.push({
          type: 'good',
          message: 'Good hip-knee alignment',
          bodyPart: 'Lower Body',
          severity: 'low'
        });
      } else {
        analysis.score -= 10;
        analysis.feedback.push({
          type: 'bad',
          message: 'Keep knees behind toes',
          bodyPart: 'Lower Body',
          severity: 'medium'
        });
        analysis.recommendations.push('Focus on sitting back into the squat');
      }

      // Check depth
      const hipHeight = (leftHip.y + rightHip.y) / 2;
      const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
      
      if (hipHeight > kneeHeight) {
        analysis.score += 10;
        analysis.feedback.push({
          type: 'good',
          message: 'Good squat depth',
          bodyPart: 'Lower Body',
          severity: 'low'
        });
      } else {
        analysis.score -= 5;
        analysis.feedback.push({
          type: 'neutral',
          message: 'Try to go deeper',
          bodyPart: 'Lower Body',
          severity: 'low'
        });
      }
    }
  }

  analyzeBenchPress(keypoints, analysis) {
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const rightShoulder = this.getKeypoint(keypoints, 'right_shoulder');
    const leftElbow = this.getKeypoint(keypoints, 'left_elbow');
    const rightElbow = this.getKeypoint(keypoints, 'right_elbow');
    const leftWrist = this.getKeypoint(keypoints, 'left_wrist');
    const rightWrist = this.getKeypoint(keypoints, 'right_wrist');

    if (leftShoulder && rightShoulder && leftElbow && rightElbow) {
      // Check elbow angle
      const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      
      if (leftElbowAngle > 45 && leftElbowAngle < 90) {
        analysis.score += 15;
        analysis.feedback.push({
          type: 'good',
          message: 'Good elbow positioning',
          bodyPart: 'Arms',
          severity: 'low'
        });
      } else {
        analysis.score -= 10;
        analysis.feedback.push({
          type: 'bad',
          message: 'Keep elbows at 45-90 degree angle',
          bodyPart: 'Arms',
          severity: 'medium'
        });
        analysis.recommendations.push('Tuck elbows in at about 45 degrees');
      }

      // Check bar path
      if (leftWrist && rightWrist) {
        const barPath = Math.abs(leftWrist.x - rightWrist.x);
        if (barPath < 50) {
          analysis.score += 10;
          analysis.feedback.push({
            type: 'good',
            message: 'Good bar path',
            bodyPart: 'Arms',
            severity: 'low'
          });
        } else {
          analysis.score -= 5;
          analysis.feedback.push({
            type: 'neutral',
            message: 'Keep bar path straight',
            bodyPart: 'Arms',
            severity: 'low'
          });
        }
      }
    }
  }

  analyzeDeadlift(keypoints, analysis) {
    const leftHip = this.getKeypoint(keypoints, 'left_hip');
    const rightHip = this.getKeypoint(keypoints, 'right_hip');
    const leftKnee = this.getKeypoint(keypoints, 'left_knee');
    const rightKnee = this.getKeypoint(keypoints, 'right_knee');
    const leftAnkle = this.getKeypoint(keypoints, 'left_ankle');
    const rightAnkle = this.getKeypoint(keypoints, 'right_ankle');

    if (leftHip && rightHip && leftKnee && rightKnee) {
      // Check hip hinge
      const hipKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
      
      if (hipKneeAngle > 120) {
        analysis.score += 15;
        analysis.feedback.push({
          type: 'good',
          message: 'Good hip hinge pattern',
          bodyPart: 'Lower Body',
          severity: 'low'
        });
      } else {
        analysis.score -= 10;
        analysis.feedback.push({
          type: 'bad',
          message: 'Focus on hip hinge, not squat',
          bodyPart: 'Lower Body',
          severity: 'medium'
        });
        analysis.recommendations.push('Push hips back, keep chest up');
      }

      // Check back position
      const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
      if (leftShoulder && leftHip) {
        const backAngle = Math.abs(leftShoulder.y - leftHip.y);
        if (backAngle > 100) {
          analysis.score += 10;
          analysis.feedback.push({
            type: 'good',
            message: 'Good back position',
            bodyPart: 'Back',
            severity: 'low'
          });
        } else {
          analysis.score -= 5;
          analysis.feedback.push({
            type: 'neutral',
            message: 'Keep chest up and back straight',
            bodyPart: 'Back',
            severity: 'low'
          });
        }
      }
    }
  }

  analyzeOverheadPress(keypoints, analysis) {
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const rightShoulder = this.getKeypoint(keypoints, 'right_shoulder');
    const leftElbow = this.getKeypoint(keypoints, 'left_elbow');
    const rightElbow = this.getKeypoint(keypoints, 'right_elbow');
    const leftWrist = this.getKeypoint(keypoints, 'left_wrist');
    const rightWrist = this.getKeypoint(keypoints, 'right_wrist');

    if (leftShoulder && rightShoulder && leftElbow && rightElbow) {
      // Check overhead position
      if (leftWrist && rightWrist) {
        const wristHeight = (leftWrist.y + rightWrist.y) / 2;
        const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
        
        if (wristHeight < shoulderHeight - 50) {
          analysis.score += 15;
          analysis.feedback.push({
            type: 'good',
            message: 'Good overhead position',
            bodyPart: 'Arms',
            severity: 'low'
          });
        } else {
          analysis.score -= 10;
          analysis.feedback.push({
            type: 'bad',
            message: 'Press directly overhead',
            bodyPart: 'Arms',
            severity: 'medium'
          });
          analysis.recommendations.push('Press straight up, not forward');
        }
      }

      // Check core engagement
      const leftHip = this.getKeypoint(keypoints, 'left_hip');
      if (leftHip && leftShoulder) {
        const coreAngle = Math.abs(leftShoulder.x - leftHip.x);
        if (coreAngle < 30) {
          analysis.score += 10;
          analysis.feedback.push({
            type: 'good',
            message: 'Good core engagement',
            bodyPart: 'Core',
            severity: 'low'
          });
        } else {
          analysis.score -= 5;
          analysis.feedback.push({
            type: 'neutral',
            message: 'Keep core tight',
            bodyPart: 'Core',
            severity: 'low'
          });
        }
      }
    }
  }

  analyzeBicepCurls(keypoints, analysis) {
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const rightShoulder = this.getKeypoint(keypoints, 'right_shoulder');
    const leftElbow = this.getKeypoint(keypoints, 'left_elbow');
    const rightElbow = this.getKeypoint(keypoints, 'right_elbow');
    const leftWrist = this.getKeypoint(keypoints, 'left_wrist');
    const rightWrist = this.getKeypoint(keypoints, 'right_wrist');

    if (leftElbow && rightElbow && leftWrist && rightWrist) {
      // Check elbow position
      const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      
      if (leftElbowAngle > 30 && leftElbowAngle < 60) {
        analysis.score += 15;
        analysis.feedback.push({
          type: 'good',
          message: 'Good elbow positioning',
          bodyPart: 'Arms',
          severity: 'low'
        });
      } else {
        analysis.score -= 10;
        analysis.feedback.push({
          type: 'bad',
          message: 'Keep elbows tucked to sides',
          bodyPart: 'Arms',
          severity: 'medium'
        });
        analysis.recommendations.push('Avoid swinging the weights');
      }

      // Check range of motion
      const leftElbowHeight = leftElbow.y;
      const leftWristHeight = leftWrist.y;
      
      if (leftWristHeight < leftElbowHeight - 20) {
        analysis.score += 10;
        analysis.feedback.push({
          type: 'good',
          message: 'Good range of motion',
          bodyPart: 'Arms',
          severity: 'low'
        });
      } else {
        analysis.score -= 5;
        analysis.feedback.push({
          type: 'neutral',
          message: 'Focus on full range of motion',
          bodyPart: 'Arms',
          severity: 'low'
        });
      }
    }
  }

  analyzeTricepExtensions(keypoints, analysis) {
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const rightShoulder = this.getKeypoint(keypoints, 'right_shoulder');
    const leftElbow = this.getKeypoint(keypoints, 'left_elbow');
    const rightElbow = this.getKeypoint(keypoints, 'right_elbow');
    const leftWrist = this.getKeypoint(keypoints, 'left_wrist');
    const rightWrist = this.getKeypoint(keypoints, 'right_wrist');

    if (leftElbow && rightElbow && leftWrist && rightWrist) {
      // Check elbow stability
      const leftElbowAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
      
      if (leftElbowAngle > 90 && leftElbowAngle < 150) {
        analysis.score += 15;
        analysis.feedback.push({
          type: 'good',
          message: 'Good elbow stability',
          bodyPart: 'Arms',
          severity: 'low'
        });
      } else {
        analysis.score -= 10;
        analysis.feedback.push({
          type: 'bad',
          message: 'Keep elbows stable',
          bodyPart: 'Arms',
          severity: 'medium'
        });
        analysis.recommendations.push('Keep elbows close to head');
      }

      // Check extension
      const leftElbowHeight = leftElbow.y;
      const leftWristHeight = leftWrist.y;
      
      if (leftWristHeight > leftElbowHeight + 20) {
        analysis.score += 10;
        analysis.feedback.push({
          type: 'good',
          message: 'Good extension',
          bodyPart: 'Arms',
          severity: 'low'
        });
      } else {
        analysis.score -= 5;
        analysis.feedback.push({
          type: 'neutral',
          message: 'Extend fully at the bottom',
          bodyPart: 'Arms',
          severity: 'low'
        });
      }
    }
  }

  analyzeGeneralForm(keypoints, analysis) {
    // General posture analysis
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const rightShoulder = this.getKeypoint(keypoints, 'right_shoulder');
    const leftHip = this.getKeypoint(keypoints, 'left_hip');
    const rightHip = this.getKeypoint(keypoints, 'right_hip');

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      // Check shoulder alignment
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderDiff < 20) {
        analysis.score += 10;
        analysis.feedback.push({
          type: 'good',
          message: 'Good shoulder alignment',
          bodyPart: 'Upper Body',
          severity: 'low'
        });
      }

      // Check hip alignment
      const hipDiff = Math.abs(leftHip.y - rightHip.y);
      if (hipDiff < 20) {
        analysis.score += 10;
        analysis.feedback.push({
          type: 'good',
          message: 'Good hip alignment',
          bodyPart: 'Lower Body',
          severity: 'low'
        });
      }
    }
  }

  getKeypoint(keypoints, name) {
    return keypoints.find(kp => kp.name === name);
  }

  calculateAngle(point1, point2, point3) {
    if (!point1 || !point2 || !point3) return 0;
    
    const a = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    const b = Math.sqrt(Math.pow(point3.x - point2.x, 2) + Math.pow(point3.y - point2.y, 2));
    const c = Math.sqrt(Math.pow(point1.x - point3.x, 2) + Math.pow(point1.y - point3.y, 2));
    
    const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    return (angle * 180) / Math.PI;
  }

  getDefaultAnalysis(exerciseType, duration) {
    return {
      score: 50,
      feedback: [{
        type: 'neutral',
        message: 'No pose detected - ensure good lighting and clear view',
        bodyPart: 'Overall',
        severity: 'medium'
      }],
      recommendations: ['Ensure good lighting and a clear view of your body'],
      keypoints: null,
      confidence: 0,
    };
  }

  dispose() {
    if (this.detector) {
      this.detector.dispose();
      this.detector = null;
    }
    this.isInitialized = false;
  }
}

export default PoseAnalyzer;
