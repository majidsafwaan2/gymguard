import 'dart:math';

class PoseLandmark {
  final int id;
  final double x;
  final double y;
  final double z;
  final double visibility;
  final double presence;
  final String name;

  PoseLandmark({
    required this.id,
    required this.x,
    required this.y,
    required this.z,
    required this.visibility,
    required this.presence,
    required this.name,
  });

  PoseLandmark copyWith({
    int? id,
    double? x,
    double? y,
    double? z,
    double? visibility,
    double? presence,
    String? name,
  }) {
    return PoseLandmark(
      id: id ?? this.id,
      x: x ?? this.x,
      y: y ?? this.y,
      z: z ?? this.z,
      visibility: visibility ?? this.visibility,
      presence: presence ?? this.presence,
      name: name ?? this.name,
    );
  }

  double distanceTo(PoseLandmark other) {
    return sqrt(pow(x - other.x, 2) + pow(y - other.y, 2) + pow(z - other.z, 2));
  }

  double angleTo(PoseLandmark other1, PoseLandmark other2) {
    final a = distanceTo(other1);
    final b = distanceTo(other2);
    final c = other1.distanceTo(other2);
    
    if (a == 0 || b == 0) return 0;
    
    final cosAngle = (a * a + b * b - c * c) / (2 * a * b);
    final clampedCos = cosAngle.clamp(-1.0, 1.0);
    return acos(clampedCos) * 180 / pi;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'x': x,
      'y': y,
      'z': z,
      'visibility': visibility,
      'presence': presence,
      'name': name,
    };
  }

  factory PoseLandmark.fromJson(Map<String, dynamic> json) {
    return PoseLandmark(
      id: json['id'],
      x: json['x'].toDouble(),
      y: json['y'].toDouble(),
      z: json['z'].toDouble(),
      visibility: json['visibility'].toDouble(),
      presence: json['presence'].toDouble(),
      name: json['name'],
    );
  }
}

class PoseFrame {
  final List<PoseLandmark> landmarks;
  final DateTime timestamp;
  final double confidence;
  final String? exerciseId;
  final PoseStatus status;

  PoseFrame({
    required this.landmarks,
    required this.timestamp,
    required this.confidence,
    this.exerciseId,
    this.status = PoseStatus.detecting,
  });

  PoseLandmark? getLandmarkById(int id) {
    try {
      return landmarks.firstWhere((landmark) => landmark.id == id);
    } catch (e) {
      return null;
    }
  }

  PoseLandmark? getLandmarkByName(String name) {
    try {
      return landmarks.firstWhere((landmark) => landmark.name == name);
    } catch (e) {
      return null;
    }
  }

  List<PoseLandmark> getVisibleLandmarks() {
    return landmarks.where((landmark) => landmark.visibility > 0.5).toList();
  }

  bool hasRequiredLandmarks(List<String> requiredNames) {
    return requiredNames.every((name) => getLandmarkByName(name) != null);
  }

  Map<String, dynamic> toJson() {
    return {
      'landmarks': landmarks.map((e) => e.toJson()).toList(),
      'timestamp': timestamp.toIso8601String(),
      'confidence': confidence,
      'exerciseId': exerciseId,
      'status': status.name,
    };
  }

  factory PoseFrame.fromJson(Map<String, dynamic> json) {
    return PoseFrame(
      landmarks: (json['landmarks'] as List)
          .map((e) => PoseLandmark.fromJson(e))
          .toList(),
      timestamp: DateTime.parse(json['timestamp']),
      confidence: json['confidence'].toDouble(),
      exerciseId: json['exerciseId'],
      status: PoseStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => PoseStatus.detecting,
      ),
    );
  }
}

enum PoseStatus {
  detecting,
  tracking,
  analyzing,
  feedback,
  completed,
}

class JointAngle {
  final String jointName;
  final double angle;
  final double targetAngle;
  final double tolerance;
  final bool isCorrect;
  final String feedback;

  JointAngle({
    required this.jointName,
    required this.angle,
    required this.targetAngle,
    this.tolerance = 5.0,
    required this.isCorrect,
    required this.feedback,
  });

  double get deviation => (angle - targetAngle).abs();

  Map<String, dynamic> toJson() {
    return {
      'jointName': jointName,
      'angle': angle,
      'targetAngle': targetAngle,
      'tolerance': tolerance,
      'isCorrect': isCorrect,
      'feedback': feedback,
    };
  }

  factory JointAngle.fromJson(Map<String, dynamic> json) {
    return JointAngle(
      jointName: json['jointName'],
      angle: json['angle'].toDouble(),
      targetAngle: json['targetAngle'].toDouble(),
      tolerance: json['tolerance']?.toDouble() ?? 5.0,
      isCorrect: json['isCorrect'],
      feedback: json['feedback'],
    );
  }
}

class FormAnalysis {
  final String exerciseId;
  final DateTime timestamp;
  final List<JointAngle> jointAngles;
  final List<AlignmentCheck> alignmentChecks;
  final List<MovementPattern> movementPatterns;
  final double overallScore;
  final List<FormFeedback> feedback;
  final FormStatus status;
  final String? recommendation;

  FormAnalysis({
    required this.exerciseId,
    required this.timestamp,
    required this.jointAngles,
    required this.alignmentChecks,
    required this.movementPatterns,
    required this.overallScore,
    required this.feedback,
    required this.status,
    this.recommendation,
  });

  bool get hasCriticalErrors => feedback.any((f) => f.severity == FeedbackSeverity.critical);
  bool get hasWarnings => feedback.any((f) => f.severity == FeedbackSeverity.warning);
  bool get isFormCorrect => overallScore >= 0.8;

  Map<String, dynamic> toJson() {
    return {
      'exerciseId': exerciseId,
      'timestamp': timestamp.toIso8601String(),
      'jointAngles': jointAngles.map((e) => e.toJson()).toList(),
      'alignmentChecks': alignmentChecks.map((e) => e.toJson()).toList(),
      'movementPatterns': movementPatterns.map((e) => e.toJson()).toList(),
      'overallScore': overallScore,
      'feedback': feedback.map((e) => e.toJson()).toList(),
      'status': status.name,
      'recommendation': recommendation,
    };
  }

  factory FormAnalysis.fromJson(Map<String, dynamic> json) {
    return FormAnalysis(
      exerciseId: json['exerciseId'],
      timestamp: DateTime.parse(json['timestamp']),
      jointAngles: (json['jointAngles'] as List)
          .map((e) => JointAngle.fromJson(e))
          .toList(),
      alignmentChecks: (json['alignmentChecks'] as List)
          .map((e) => AlignmentCheck.fromJson(e))
          .toList(),
      movementPatterns: (json['movementPatterns'] as List)
          .map((e) => MovementPattern.fromJson(e))
          .toList(),
      overallScore: json['overallScore'].toDouble(),
      feedback: (json['feedback'] as List)
          .map((e) => FormFeedback.fromJson(e))
          .toList(),
      status: FormStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => FormStatus.analyzing,
      ),
      recommendation: json['recommendation'],
    );
  }
}

class AlignmentCheck {
  final String name;
  final List<String> landmarks;
  final AlignmentType type;
  final bool isCorrect;
  final double deviation;
  final String feedback;

  AlignmentCheck({
    required this.name,
    required this.landmarks,
    required this.type,
    required this.isCorrect,
    required this.deviation,
    required this.feedback,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'landmarks': landmarks,
      'type': type.name,
      'isCorrect': isCorrect,
      'deviation': deviation,
      'feedback': feedback,
    };
  }

  factory AlignmentCheck.fromJson(Map<String, dynamic> json) {
    return AlignmentCheck(
      name: json['name'],
      landmarks: List<String>.from(json['landmarks']),
      type: AlignmentType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => AlignmentType.vertical,
      ),
      isCorrect: json['isCorrect'],
      deviation: json['deviation'].toDouble(),
      feedback: json['feedback'],
    );
  }
}

enum AlignmentType {
  vertical,
  horizontal,
  parallel,
  perpendicular,
  symmetrical,
}

class MovementPattern {
  final String name;
  final String phase;
  final bool isCorrect;
  final double confidence;
  final String feedback;

  MovementPattern({
    required this.name,
    required this.phase,
    required this.isCorrect,
    required this.confidence,
    required this.feedback,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phase': phase,
      'isCorrect': isCorrect,
      'confidence': confidence,
      'feedback': feedback,
    };
  }

  factory MovementPattern.fromJson(Map<String, dynamic> json) {
    return MovementPattern(
      name: json['name'],
      phase: json['phase'],
      isCorrect: json['isCorrect'],
      confidence: json['confidence'].toDouble(),
      feedback: json['feedback'],
    );
  }
}

enum FormStatus {
  analyzing,
  good,
  needsImprovement,
  poor,
  dangerous,
}

class FormFeedback {
  final String message;
  final FeedbackSeverity severity;
  final FeedbackType type;
  final List<String> suggestions;
  final DateTime timestamp;

  FormFeedback({
    required this.message,
    required this.severity,
    required this.type,
    required this.suggestions,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'severity': severity.name,
      'type': type.name,
      'suggestions': suggestions,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory FormFeedback.fromJson(Map<String, dynamic> json) {
    return FormFeedback(
      message: json['message'],
      severity: FeedbackSeverity.values.firstWhere(
        (e) => e.name == json['severity'],
        orElse: () => FeedbackSeverity.info,
      ),
      type: FeedbackType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => FeedbackType.general,
      ),
      suggestions: List<String>.from(json['suggestions']),
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}

enum FeedbackSeverity {
  info,
  warning,
  critical,
}

enum FeedbackType {
  jointAngle,
  alignment,
  movement,
  safety,
  general,
}
