import 'dart:math';
import '../models/pose_model.dart';
import '../models/exercise_model.dart';

class PoseAnalyzer {
  // Analyze pose against exercise requirements
  FormAnalysis analyzePose(PoseFrame poseFrame, Exercise exercise) {
    final jointAngles = _analyzeJointAngles(poseFrame, exercise);
    final alignmentChecks = _analyzeAlignment(poseFrame, exercise);
    final movementPatterns = _analyzeMovementPatterns(poseFrame, exercise);
    final feedback = _generateFeedback(jointAngles, alignmentChecks, movementPatterns);
    final overallScore = _calculateOverallScore(jointAngles, alignmentChecks, movementPatterns);
    final status = _determineFormStatus(overallScore, feedback);
    
    return FormAnalysis(
      exerciseId: exercise.id,
      timestamp: DateTime.now(),
      jointAngles: jointAngles,
      alignmentChecks: alignmentChecks,
      movementPatterns: movementPatterns,
      overallScore: overallScore,
      feedback: feedback,
      status: status,
      recommendation: _generateRecommendation(feedback, overallScore),
    );
  }

  // Analyze joint angles against exercise requirements
  List<JointAngle> _analyzeJointAngles(PoseFrame poseFrame, Exercise exercise) {
    final jointAngles = <JointAngle>[];
    
    for (final requiredAngle in exercise.formRequirements.requiredAngles) {
      final angle = _calculateJointAngle(poseFrame, requiredAngle.jointName);
      final isCorrect = (angle - requiredAngle.optimalAngle).abs() <= requiredAngle.tolerance;
      
      jointAngles.add(JointAngle(
        jointName: requiredAngle.jointName,
        angle: angle,
        targetAngle: requiredAngle.optimalAngle,
        tolerance: requiredAngle.tolerance,
        isCorrect: isCorrect,
        feedback: _generateJointAngleFeedback(requiredAngle, angle),
      ));
    }
    
    return jointAngles;
  }

  // Calculate joint angle from pose landmarks
  double _calculateJointAngle(PoseFrame poseFrame, String jointName) {
    final landmarks = _getJointLandmarks(poseFrame, jointName);
    if (landmarks.length != 3) return 0.0;
    
    final point1 = landmarks[0];
    final joint = landmarks[1];
    final point2 = landmarks[2];
    
    return _calculateAngle(point1, joint, point2);
  }

  // Get landmarks for a specific joint
  List<PoseLandmark> _getJointLandmarks(PoseFrame poseFrame, String jointName) {
    switch (jointName.toLowerCase()) {
      case 'left_knee':
        return [
          poseFrame.getLandmarkByName('left_hip')!,
          poseFrame.getLandmarkByName('left_knee')!,
          poseFrame.getLandmarkByName('left_ankle')!,
        ];
      case 'right_knee':
        return [
          poseFrame.getLandmarkByName('right_hip')!,
          poseFrame.getLandmarkByName('right_knee')!,
          poseFrame.getLandmarkByName('right_ankle')!,
        ];
      case 'left_hip':
        return [
          poseFrame.getLandmarkByName('left_shoulder')!,
          poseFrame.getLandmarkByName('left_hip')!,
          poseFrame.getLandmarkByName('left_knee')!,
        ];
      case 'right_hip':
        return [
          poseFrame.getLandmarkByName('right_shoulder')!,
          poseFrame.getLandmarkByName('right_hip')!,
          poseFrame.getLandmarkByName('right_knee')!,
        ];
      case 'left_elbow':
        return [
          poseFrame.getLandmarkByName('left_shoulder')!,
          poseFrame.getLandmarkByName('left_elbow')!,
          poseFrame.getLandmarkByName('left_wrist')!,
        ];
      case 'right_elbow':
        return [
          poseFrame.getLandmarkByName('right_shoulder')!,
          poseFrame.getLandmarkByName('right_elbow')!,
          poseFrame.getLandmarkByName('right_wrist')!,
        ];
      case 'left_shoulder':
        return [
          poseFrame.getLandmarkByName('left_elbow')!,
          poseFrame.getLandmarkByName('left_shoulder')!,
          poseFrame.getLandmarkByName('left_hip')!,
        ];
      case 'right_shoulder':
        return [
          poseFrame.getLandmarkByName('right_elbow')!,
          poseFrame.getLandmarkByName('right_shoulder')!,
          poseFrame.getLandmarkByName('right_hip')!,
        ];
      default:
        return [];
    }
  }

  // Calculate angle between three points
  double _calculateAngle(PoseLandmark p1, PoseLandmark p2, PoseLandmark p3) {
    final a = _distance(p1, p2);
    final b = _distance(p2, p3);
    final c = _distance(p1, p3);
    
    if (a == 0 || b == 0) return 0;
    
    final cosAngle = (a * a + b * b - c * c) / (2 * a * b);
    final clampedCos = cosAngle.clamp(-1.0, 1.0);
    return acos(clampedCos) * 180 / pi;
  }

  // Calculate distance between two points
  double _distance(PoseLandmark p1, PoseLandmark p2) {
    return sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2) + pow(p1.z - p2.z, 2));
  }

  // Generate joint angle feedback
  String _generateJointAngleFeedback(FormRequirements requiredAngle, double actualAngle) {
    final deviation = (actualAngle - requiredAngle.optimalAngle).abs();
    
    if (deviation <= requiredAngle.tolerance) {
      return 'Good ${requiredAngle.jointName} angle';
    } else if (actualAngle > requiredAngle.optimalAngle) {
      return '${requiredAngle.jointName} angle too large. Reduce to ${requiredAngle.optimalAngle.toStringAsFixed(1)}°';
    } else {
      return '${requiredAngle.jointName} angle too small. Increase to ${requiredAngle.optimalAngle.toStringAsFixed(1)}°';
    }
  }

  // Analyze body alignment
  List<AlignmentCheck> _analyzeAlignment(PoseFrame poseFrame, Exercise exercise) {
    final alignmentChecks = <AlignmentCheck>[];
    
    for (final requiredAlignment in exercise.formRequirements.alignmentChecks) {
      final isCorrect = _checkAlignment(poseFrame, requiredAlignment);
      final deviation = _calculateAlignmentDeviation(poseFrame, requiredAlignment);
      
      alignmentChecks.add(AlignmentCheck(
        name: requiredAlignment.name,
        landmarks: requiredAlignment.landmarks,
        type: requiredAlignment.type,
        isCorrect: isCorrect,
        deviation: deviation,
        feedback: _generateAlignmentFeedback(requiredAlignment, isCorrect, deviation),
      ));
    }
    
    return alignmentChecks;
  }

  // Check if alignment is correct
  bool _checkAlignment(PoseFrame poseFrame, AlignmentCheck requiredAlignment) {
    final landmarks = requiredAlignment.landmarks
        .map((name) => poseFrame.getLandmarkByName(name))
        .where((landmark) => landmark != null)
        .toList();
    
    if (landmarks.length < 2) return false;
    
    switch (requiredAlignment.type) {
      case AlignmentType.vertical:
        return _checkVerticalAlignment(landmarks);
      case AlignmentType.horizontal:
        return _checkHorizontalAlignment(landmarks);
      case AlignmentType.parallel:
        return _checkParallelAlignment(landmarks);
      case AlignmentType.perpendicular:
        return _checkPerpendicularAlignment(landmarks);
      case AlignmentType.symmetrical:
        return _checkSymmetricalAlignment(landmarks);
      default:
        return false;
    }
  }

  // Check vertical alignment
  bool _checkVerticalAlignment(List<PoseLandmark> landmarks) {
    if (landmarks.length < 2) return false;
    
    final x1 = landmarks[0].x;
    final x2 = landmarks[1].x;
    final tolerance = 0.1; // 10% of image width
    
    return (x1 - x2).abs() <= tolerance;
  }

  // Check horizontal alignment
  bool _checkHorizontalAlignment(List<PoseLandmark> landmarks) {
    if (landmarks.length < 2) return false;
    
    final y1 = landmarks[0].y;
    final y2 = landmarks[1].y;
    final tolerance = 0.1; // 10% of image height
    
    return (y1 - y2).abs() <= tolerance;
  }

  // Check parallel alignment
  bool _checkParallelAlignment(List<PoseLandmark> landmarks) {
    // Simplified parallel check - would need more sophisticated geometry
    return true;
  }

  // Check perpendicular alignment
  bool _checkPerpendicularAlignment(List<PoseLandmark> landmarks) {
    // Simplified perpendicular check - would need more sophisticated geometry
    return true;
  }

  // Check symmetrical alignment
  bool _checkSymmetricalAlignment(List<PoseLandmark> landmarks) {
    if (landmarks.length < 4) return false;
    
    // Check if left and right side landmarks are roughly symmetrical
    final leftSide = landmarks.take(landmarks.length ~/ 2).toList();
    final rightSide = landmarks.skip(landmarks.length ~/ 2).toList();
    
    if (leftSide.length != rightSide.length) return false;
    
    for (int i = 0; i < leftSide.length; i++) {
      final left = leftSide[i];
      final right = rightSide[i];
      final tolerance = 0.15; // 15% tolerance for symmetry
      
      if ((left.x + right.x).abs() > tolerance || (left.y - right.y).abs() > tolerance) {
        return false;
      }
    }
    
    return true;
  }

  // Calculate alignment deviation
  double _calculateAlignmentDeviation(PoseFrame poseFrame, AlignmentCheck requiredAlignment) {
    // Simplified deviation calculation
    return 0.0;
  }

  // Generate alignment feedback
  String _generateAlignmentFeedback(AlignmentCheck requiredAlignment, bool isCorrect, double deviation) {
    if (isCorrect) {
      return 'Good ${requiredAlignment.name} alignment';
    } else {
      return 'Improve ${requiredAlignment.name} alignment';
    }
  }

  // Analyze movement patterns
  List<MovementPattern> _analyzeMovementPatterns(PoseFrame poseFrame, Exercise exercise) {
    final movementPatterns = <MovementPattern>[];
    
    for (final requiredPattern in exercise.formRequirements.movementPatterns) {
      final isCorrect = _checkMovementPattern(poseFrame, requiredPattern);
      final confidence = _calculateMovementConfidence(poseFrame, requiredPattern);
      
      movementPatterns.add(MovementPattern(
        name: requiredPattern.name,
        phase: _detectMovementPhase(poseFrame, requiredPattern),
        isCorrect: isCorrect,
        confidence: confidence,
        feedback: _generateMovementFeedback(requiredPattern, isCorrect),
      ));
    }
    
    return movementPatterns;
  }

  // Check if movement pattern is correct
  bool _checkMovementPattern(PoseFrame poseFrame, MovementPattern requiredPattern) {
    // Simplified movement pattern check
    return true;
  }

  // Calculate movement confidence
  double _calculateMovementConfidence(PoseFrame poseFrame, MovementPattern requiredPattern) {
    // Simplified confidence calculation
    return 0.8;
  }

  // Detect movement phase
  String _detectMovementPhase(PoseFrame poseFrame, MovementPattern requiredPattern) {
    // Simplified phase detection
    return 'mid';
  }

  // Generate movement feedback
  String _generateMovementFeedback(MovementPattern requiredPattern, bool isCorrect) {
    if (isCorrect) {
      return 'Good ${requiredPattern.name} movement';
    } else {
      return 'Focus on ${requiredPattern.name} movement pattern';
    }
  }

  // Generate overall feedback
  List<FormFeedback> _generateFeedback(
    List<JointAngle> jointAngles,
    List<AlignmentCheck> alignmentChecks,
    List<MovementPattern> movementPatterns,
  ) {
    final feedback = <FormFeedback>[];
    
    // Add joint angle feedback
    for (final jointAngle in jointAngles) {
      if (!jointAngle.isCorrect) {
        feedback.add(FormFeedback(
          message: jointAngle.feedback,
          severity: _determineFeedbackSeverity(jointAngle.deviation),
          type: FeedbackType.jointAngle,
          suggestions: _generateJointAngleSuggestions(jointAngle),
          timestamp: DateTime.now(),
        ));
      }
    }
    
    // Add alignment feedback
    for (final alignment in alignmentChecks) {
      if (!alignment.isCorrect) {
        feedback.add(FormFeedback(
          message: alignment.feedback,
          severity: FeedbackSeverity.warning,
          type: FeedbackType.alignment,
          suggestions: _generateAlignmentSuggestions(alignment),
          timestamp: DateTime.now(),
        ));
      }
    }
    
    // Add movement feedback
    for (final movement in movementPatterns) {
      if (!movement.isCorrect) {
        feedback.add(FormFeedback(
          message: movement.feedback,
          severity: FeedbackSeverity.info,
          type: FeedbackType.movement,
          suggestions: _generateMovementSuggestions(movement),
          timestamp: DateTime.now(),
        ));
      }
    }
    
    return feedback;
  }

  // Determine feedback severity based on deviation
  FeedbackSeverity _determineFeedbackSeverity(double deviation) {
    if (deviation > 20) return FeedbackSeverity.critical;
    if (deviation > 10) return FeedbackSeverity.warning;
    return FeedbackSeverity.info;
  }

  // Generate joint angle suggestions
  List<String> _generateJointAngleSuggestions(JointAngle jointAngle) {
    if (jointAngle.angle > jointAngle.targetAngle) {
      return ['Reduce the angle', 'Focus on controlled movement'];
    } else {
      return ['Increase the angle', 'Go deeper into the movement'];
    }
  }

  // Generate alignment suggestions
  List<String> _generateAlignmentSuggestions(AlignmentCheck alignment) {
    return ['Check your posture', 'Maintain proper alignment'];
  }

  // Generate movement suggestions
  List<String> _generateMovementSuggestions(MovementPattern movement) {
    return ['Focus on form', 'Control the movement'];
  }

  // Calculate overall form score
  double _calculateOverallScore(
    List<JointAngle> jointAngles,
    List<AlignmentCheck> alignmentChecks,
    List<MovementPattern> movementPatterns,
  ) {
    if (jointAngles.isEmpty && alignmentChecks.isEmpty && movementPatterns.isEmpty) {
      return 1.0;
    }
    
    double totalScore = 0.0;
    int totalChecks = 0;
    
    // Joint angle score (weighted 50%)
    if (jointAngles.isNotEmpty) {
      final jointScore = jointAngles.map((j) => j.isCorrect ? 1.0 : 0.0).reduce((a, b) => a + b) / jointAngles.length;
      totalScore += jointScore * 0.5;
      totalChecks += jointAngles.length;
    }
    
    // Alignment score (weighted 30%)
    if (alignmentChecks.isNotEmpty) {
      final alignmentScore = alignmentChecks.map((a) => a.isCorrect ? 1.0 : 0.0).reduce((a, b) => a + b) / alignmentChecks.length;
      totalScore += alignmentScore * 0.3;
      totalChecks += alignmentChecks.length;
    }
    
    // Movement pattern score (weighted 20%)
    if (movementPatterns.isNotEmpty) {
      final movementScore = movementPatterns.map((m) => m.isCorrect ? 1.0 : 0.0).reduce((a, b) => a + b) / movementPatterns.length;
      totalScore += movementScore * 0.2;
      totalChecks += movementPatterns.length;
    }
    
    return totalScore;
  }

  // Determine form status
  FormStatus _determineFormStatus(double overallScore, List<FormFeedback> feedback) {
    if (feedback.any((f) => f.severity == FeedbackSeverity.critical)) {
      return FormStatus.dangerous;
    } else if (overallScore >= 0.9) {
      return FormStatus.good;
    } else if (overallScore >= 0.7) {
      return FormStatus.needsImprovement;
    } else {
      return FormStatus.poor;
    }
  }

  // Generate overall recommendation
  String? _generateRecommendation(List<FormFeedback> feedback, double overallScore) {
    if (overallScore >= 0.9) {
      return 'Excellent form! Keep it up.';
    } else if (overallScore >= 0.7) {
      return 'Good form with room for improvement.';
    } else if (overallScore >= 0.5) {
      return 'Focus on improving your form before increasing intensity.';
    } else {
      return 'Please review the exercise instructions and focus on proper form.';
    }
  }
}
