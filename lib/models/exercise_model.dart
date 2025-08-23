class Exercise {
  final String id;
  final String name;
  final String description;
  final ExerciseCategory category;
  final ExerciseType type;
  final DifficultyLevel difficulty;
  final List<String> targetMuscles;
  final List<String> secondaryMuscles;
  final List<String> equipment;
  final List<String> instructions;
  final List<String> safetyTips;
  final List<String> commonMistakes;
  final List<String> modifications;
  final FormRequirements formRequirements;
  final WarmUpRequirements warmUpRequirements;
  final RestRequirements restRequirements;
  final String? videoUrl;
  final String? imageUrl;
  final bool isAgeAppropriate;
  final List<int> ageRange;
  final bool requiresSpotter;
  final String? spotterInstructions;

  Exercise({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.type,
    required this.difficulty,
    required this.targetMuscles,
    required this.secondaryMuscles,
    required this.equipment,
    required this.instructions,
    required this.safetyTips,
    required this.commonMistakes,
    required this.modifications,
    required this.formRequirements,
    required this.warmUpRequirements,
    required this.restRequirements,
    this.videoUrl,
    this.imageUrl,
    this.isAgeAppropriate = true,
    this.ageRange = const [13, 19],
    this.requiresSpotter = false,
    this.spotterInstructions,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category': category.name,
      'type': type.name,
      'difficulty': difficulty.name,
      'targetMuscles': targetMuscles,
      'secondaryMuscles': secondaryMuscles,
      'equipment': equipment,
      'instructions': instructions,
      'safetyTips': safetyTips,
      'commonMistakes': commonMistakes,
      'modifications': modifications,
      'formRequirements': formRequirements.toJson(),
      'warmUpRequirements': warmUpRequirements.toJson(),
      'restRequirements': restRequirements.toJson(),
      'videoUrl': videoUrl,
      'imageUrl': imageUrl,
      'isAgeAppropriate': isAgeAppropriate,
      'ageRange': ageRange,
      'requiresSpotter': requiresSpotter,
      'spotterInstructions': spotterInstructions,
    };
  }

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      category: ExerciseCategory.values.firstWhere(
        (e) => e.name == json['category'],
        orElse: () => ExerciseCategory.strength,
      ),
      type: ExerciseType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => ExerciseType.compound,
      ),
      difficulty: DifficultyLevel.values.firstWhere(
        (e) => e.name == json['difficulty'],
        orElse: () => DifficultyLevel.beginner,
      ),
      targetMuscles: List<String>.from(json['targetMuscles']),
      secondaryMuscles: List<String>.from(json['secondaryMuscles']),
      equipment: List<String>.from(json['equipment']),
      instructions: List<String>.from(json['instructions']),
      safetyTips: List<String>.from(json['safetyTips']),
      commonMistakes: List<String>.from(json['commonMistakes']),
      modifications: List<String>.from(json['modifications']),
      formRequirements: FormRequirements.fromJson(json['formRequirements']),
      warmUpRequirements: WarmUpRequirements.fromJson(json['warmUpRequirements']),
      restRequirements: RestRequirements.fromJson(json['restRequirements']),
      videoUrl: json['videoUrl'],
      imageUrl: json['imageUrl'],
      isAgeAppropriate: json['isAgeAppropriate'] ?? true,
      ageRange: List<int>.from(json['ageRange'] ?? [13, 19]),
      requiresSpotter: json['requiresSpotter'] ?? false,
      spotterInstructions: json['spotterInstructions'],
    );
  }
}

enum ExerciseCategory {
  strength,
  cardio,
  flexibility,
  balance,
  plyometric,
  mobility,
  warmUp,
  coolDown,
}

enum ExerciseType {
  compound,
  isolation,
  bodyweight,
  weighted,
  dynamic,
  static,
}

enum DifficultyLevel {
  beginner,
  intermediate,
  advanced,
  expert,
}

class FormRequirements {
  final List<JointAngle> requiredAngles;
  final List<AlignmentCheck> alignmentChecks;
  final List<MovementPattern> movementPatterns;
  final List<StabilityRequirement> stabilityRequirements;
  final double minFormScore;
  final int minRepetitions;
  final int maxRepetitions;
  final Duration minHoldTime;
  final Duration maxHoldTime;

  FormRequirements({
    required this.requiredAngles,
    required this.alignmentChecks,
    required this.movementPatterns,
    required this.stabilityRequirements,
    this.minFormScore = 0.7,
    this.minRepetitions = 1,
    this.maxRepetitions = 20,
    this.minHoldTime = Duration.zero,
    this.maxHoldTime = const Duration(seconds: 60),
  });

  Map<String, dynamic> toJson() {
    return {
      'requiredAngles': requiredAngles.map((e) => e.toJson()).toList(),
      'alignmentChecks': alignmentChecks.map((e) => e.toJson()).toList(),
      'movementPatterns': movementPatterns.map((e) => e.toJson()).toList(),
      'stabilityRequirements': stabilityRequirements.map((e) => e.toJson()).toList(),
      'minFormScore': minFormScore,
      'minRepetitions': minRepetitions,
      'maxRepetitions': maxRepetitions,
      'minHoldTime': minHoldTime.inMilliseconds,
      'maxHoldTime': maxHoldTime.inMilliseconds,
    };
  }

  factory FormRequirements.fromJson(Map<String, dynamic> json) {
    return FormRequirements(
      requiredAngles: (json['requiredAngles'] as List)
          .map((e) => JointAngle.fromJson(e))
          .toList(),
      alignmentChecks: (json['alignmentChecks'] as List)
          .map((e) => AlignmentCheck.fromJson(e))
          .toList(),
      movementPatterns: (json['movementPatterns'] as List)
          .map((e) => MovementPattern.fromJson(e))
          .toList(),
      stabilityRequirements: (json['stabilityRequirements'] as List)
          .map((e) => StabilityRequirement.fromJson(e))
          .toList(),
      minFormScore: json['minFormScore']?.toDouble() ?? 0.7,
      minRepetitions: json['minRepetitions'] ?? 1,
      maxRepetitions: json['maxRepetitions'] ?? 20,
      minHoldTime: Duration(milliseconds: json['minHoldTime'] ?? 0),
      maxHoldTime: Duration(milliseconds: json['maxHoldTime'] ?? 60000),
    );
  }
}

class JointAngle {
  final String jointName;
  final double minAngle;
  final double maxAngle;
  final double optimalAngle;
  final double tolerance;
  final String description;

  JointAngle({
    required this.jointName,
    required this.minAngle,
    required this.maxAngle,
    required this.optimalAngle,
    this.tolerance = 5.0,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'jointName': jointName,
      'minAngle': minAngle,
      'maxAngle': maxAngle,
      'optimalAngle': optimalAngle,
      'tolerance': tolerance,
      'description': description,
    };
  }

  factory JointAngle.fromJson(Map<String, dynamic> json) {
    return JointAngle(
      jointName: json['jointName'],
      minAngle: json['minAngle'].toDouble(),
      maxAngle: json['maxAngle'].toDouble(),
      optimalAngle: json['optimalAngle'].toDouble(),
      tolerance: json['tolerance']?.toDouble() ?? 5.0,
      description: json['description'],
    );
  }
}

class AlignmentCheck {
  final String name;
  final List<String> landmarks;
  final AlignmentType type;
  final double tolerance;
  final String description;

  AlignmentCheck({
    required this.name,
    required this.landmarks,
    required this.type,
    this.tolerance = 0.1,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'landmarks': landmarks,
      'type': type.name,
      'tolerance': tolerance,
      'description': description,
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
      tolerance: json['tolerance']?.toDouble() ?? 0.1,
      description: json['description'],
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
  final List<String> phases;
  final List<Duration> phaseDurations;
  final List<String> keyLandmarks;
  final String description;

  MovementPattern({
    required this.name,
    required this.phases,
    required this.phaseDurations,
    required this.keyLandmarks,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phases': phases,
      'phaseDurations': phaseDurations.map((e) => e.inMilliseconds).toList(),
      'keyLandmarks': keyLandmarks,
      'description': description,
    };
  }

  factory MovementPattern.fromJson(Map<String, dynamic> json) {
    return MovementPattern(
      name: json['name'],
      phases: List<String>.from(json['phases']),
      phaseDurations: (json['phaseDurations'] as List)
          .map((e) => Duration(milliseconds: e))
          .toList(),
      keyLandmarks: List<String>.from(json['keyLandmarks']),
      description: json['description'],
    );
  }
}

class StabilityRequirement {
  final String name;
  final List<String> stabilityPoints;
  final double minStabilityScore;
  final Duration minStabilityDuration;
  final String description;

  StabilityRequirement({
    required this.name,
    required this.stabilityPoints,
    this.minStabilityScore = 0.8,
    this.minStabilityDuration = const Duration(seconds: 1),
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'stabilityPoints': stabilityPoints,
      'minStabilityScore': minStabilityScore,
      'minStabilityDuration': minStabilityDuration.inMilliseconds,
      'description': description,
    };
  }

  factory StabilityRequirement.fromJson(Map<String, dynamic> json) {
    return StabilityRequirement(
      name: json['name'],
      stabilityPoints: List<String>.from(json['stabilityPoints']),
      minStabilityScore: json['minStabilityScore']?.toDouble() ?? 0.8,
      minStabilityDuration: Duration(milliseconds: json['minStabilityDuration'] ?? 1000),
      description: json['description'],
    );
  }
}

class WarmUpRequirements {
  final List<String> requiredWarmUps;
  final Duration minWarmUpDuration;
  final List<String> mobilityExercises;
  final List<String> activationDrills;

  WarmUpRequirements({
    this.requiredWarmUps = const [],
    this.minWarmUpDuration = const Duration(minutes: 5),
    this.mobilityExercises = const [],
    this.activationDrills = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'requiredWarmUps': requiredWarmUps,
      'minWarmUpDuration': minWarmUpDuration.inMilliseconds,
      'mobilityExercises': mobilityExercises,
      'activationDrills': activationDrills,
    };
  }

  factory WarmUpRequirements.fromJson(Map<String, dynamic> json) {
    return WarmUpRequirements(
      requiredWarmUps: List<String>.from(json['requiredWarmUps'] ?? []),
      minWarmUpDuration: Duration(milliseconds: json['minWarmUpDuration'] ?? 300000),
      mobilityExercises: List<String>.from(json['mobilityExercises'] ?? []),
      activationDrills: List<String>.from(json['activationDrills'] ?? []),
    );
  }
}

class RestRequirements {
  final Duration minRestBetweenSets;
  final Duration minRestBetweenExercises;
  final Duration minRestBetweenWorkouts;
  final List<String> recoveryTechniques;

  RestRequirements({
    this.minRestBetweenSets = const Duration(minutes: 2),
    this.minRestBetweenExercises = const Duration(minutes: 3),
    this.minRestBetweenWorkouts = const Duration(hours: 24),
    this.recoveryTechniques = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'minRestBetweenSets': minRestBetweenSets.inMilliseconds,
      'minRestBetweenExercises': minRestBetweenExercises.inMilliseconds,
      'minRestBetweenWorkouts': minRestBetweenWorkouts.inMilliseconds,
      'recoveryTechniques': recoveryTechniques,
    };
  }

  factory RestRequirements.fromJson(Map<String, dynamic> json) {
    return RestRequirements(
      minRestBetweenSets: Duration(milliseconds: json['minRestBetweenSets'] ?? 120000),
      minRestBetweenExercises: Duration(milliseconds: json['minRestBetweenExercises'] ?? 180000),
      minRestBetweenWorkouts: Duration(milliseconds: json['minRestBetweenWorkouts'] ?? 86400000),
      recoveryTechniques: List<String>.from(json['recoveryTechniques'] ?? []),
    );
  }
}
