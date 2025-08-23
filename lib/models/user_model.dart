class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final DateTime dateOfBirth;
  final String? profileImageUrl;
  final UserType userType;
  final FitnessLevel fitnessLevel;
  final UserPreferences preferences;
  final UserStats stats;
  final DateTime createdAt;
  final DateTime lastActiveAt;
  final bool isActive;
  final List<String> guardianIds;
  final List<String> coachIds;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.dateOfBirth,
    this.profileImageUrl,
    required this.userType,
    required this.fitnessLevel,
    required this.preferences,
    required this.stats,
    required this.createdAt,
    required this.lastActiveAt,
    this.isActive = true,
    this.guardianIds = const [],
    this.coachIds = const [],
  });

  int get age {
    final now = DateTime.now();
    int age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month || 
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      age--;
    }
    return age;
  }

  bool get isMinor => age < 18;

  User copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    DateTime? dateOfBirth,
    String? profileImageUrl,
    UserType? userType,
    FitnessLevel? fitnessLevel,
    UserPreferences? preferences,
    UserStats? stats,
    DateTime? createdAt,
    DateTime? lastActiveAt,
    bool? isActive,
    List<String>? guardianIds,
    List<String>? coachIds,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      userType: userType ?? this.userType,
      fitnessLevel: fitnessLevel ?? this.fitnessLevel,
      preferences: preferences ?? this.preferences,
      stats: stats ?? this.stats,
      createdAt: createdAt ?? this.createdAt,
      lastActiveAt: lastActiveAt ?? this.lastActiveAt,
      isActive: isActive ?? this.isActive,
      guardianIds: guardianIds ?? this.guardianIds,
      coachIds: coachIds ?? this.coachIds,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'dateOfBirth': dateOfBirth.toIso8601String(),
      'profileImageUrl': profileImageUrl,
      'userType': userType.name,
      'fitnessLevel': fitnessLevel.name,
      'preferences': preferences.toJson(),
      'stats': stats.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'lastActiveAt': lastActiveAt.toIso8601String(),
      'isActive': isActive,
      'guardianIds': guardianIds,
      'coachIds': coachIds,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      dateOfBirth: DateTime.parse(json['dateOfBirth']),
      profileImageUrl: json['profileImageUrl'],
      userType: UserType.values.firstWhere(
        (e) => e.name == json['userType'],
        orElse: () => UserType.teen,
      ),
      fitnessLevel: FitnessLevel.values.firstWhere(
        (e) => e.name == json['fitnessLevel'],
        orElse: () => FitnessLevel.beginner,
      ),
      preferences: UserPreferences.fromJson(json['preferences']),
      stats: UserStats.fromJson(json['stats']),
      createdAt: DateTime.parse(json['createdAt']),
      lastActiveAt: DateTime.parse(json['lastActiveAt']),
      isActive: json['isActive'] ?? true,
      guardianIds: List<String>.from(json['guardianIds'] ?? []),
      coachIds: List<String>.from(json['coachIds'] ?? []),
    );
  }
}

enum UserType {
  teen,
  parent,
  coach,
  guardian,
}

enum FitnessLevel {
  beginner,
  intermediate,
  advanced,
  athlete,
}

class UserPreferences {
  final List<String> preferredExercises;
  final List<String> avoidedExercises;
  final int preferredWorkoutDuration;
  final int preferredRestDays;
  final bool enableAudioFeedback;
  final bool enableVisualFeedback;
  final bool enableNotifications;
  final String preferredLanguage;
  final bool enableDarkMode;
  final List<String> fitnessGoals;

  UserPreferences({
    this.preferredExercises = const [],
    this.avoidedExercises = const [],
    this.preferredWorkoutDuration = 45,
    this.preferredRestDays = 2,
    this.enableAudioFeedback = true,
    this.enableVisualFeedback = true,
    this.enableNotifications = true,
    this.preferredLanguage = 'en',
    this.enableDarkMode = false,
    this.fitnessGoals = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'preferredExercises': preferredExercises,
      'avoidedExercises': avoidedExercises,
      'preferredWorkoutDuration': preferredWorkoutDuration,
      'preferredRestDays': preferredRestDays,
      'enableAudioFeedback': enableAudioFeedback,
      'enableVisualFeedback': enableVisualFeedback,
      'enableNotifications': enableNotifications,
      'preferredLanguage': preferredLanguage,
      'enableDarkMode': enableDarkMode,
      'fitnessGoals': fitnessGoals,
    };
  }

  factory UserPreferences.fromJson(Map<String, dynamic> json) {
    return UserPreferences(
      preferredExercises: List<String>.from(json['preferredExercises'] ?? []),
      avoidedExercises: List<String>.from(json['avoidedExercises'] ?? []),
      preferredWorkoutDuration: json['preferredWorkoutDuration'] ?? 45,
      preferredRestDays: json['preferredRestDays'] ?? 2,
      enableAudioFeedback: json['enableAudioFeedback'] ?? true,
      enableVisualFeedback: json['enableVisualFeedback'] ?? true,
      enableNotifications: json['enableNotifications'] ?? true,
      preferredLanguage: json['preferredLanguage'] ?? 'en',
      enableDarkMode: json['enableDarkMode'] ?? false,
      fitnessGoals: List<String>.from(json['fitnessGoals'] ?? []),
    );
  }
}

class UserStats {
  final int totalWorkouts;
  final int totalExercises;
  final int totalFormCorrections;
  final int currentStreak;
  final int longestStreak;
  final double averageFormScore;
  final DateTime lastWorkoutDate;
  final Map<String, int> exerciseCounts;
  final Map<String, double> exerciseFormScores;

  UserStats({
    this.totalWorkouts = 0,
    this.totalExercises = 0,
    this.totalFormCorrections = 0,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.averageFormScore = 0.0,
    this.lastWorkoutDate = DateTime.now(),
    this.exerciseCounts = const {},
    this.exerciseFormScores = const {},
  });

  Map<String, dynamic> toJson() {
    return {
      'totalWorkouts': totalWorkouts,
      'totalExercises': totalExercises,
      'totalFormCorrections': totalFormCorrections,
      'currentStreak': currentStreak,
      'longestStreak': longestStreak,
      'averageFormScore': averageFormScore,
      'lastWorkoutDate': lastWorkoutDate.toIso8601String(),
      'exerciseCounts': exerciseCounts,
      'exerciseFormScores': exerciseFormScores,
    };
  }

  factory UserStats.fromJson(Map<String, dynamic> json) {
    return UserStats(
      totalWorkouts: json['totalWorkouts'] ?? 0,
      totalExercises: json['totalExercises'] ?? 0,
      totalFormCorrections: json['totalFormCorrections'] ?? 0,
      currentStreak: json['currentStreak'] ?? 0,
      longestStreak: json['longestStreak'] ?? 0,
      averageFormScore: (json['averageFormScore'] ?? 0.0).toDouble(),
      lastWorkoutDate: DateTime.parse(json['lastWorkoutDate']),
      exerciseCounts: Map<String, int>.from(json['exerciseCounts'] ?? {}),
      exerciseFormScores: Map<String, double>.from(json['exerciseFormScores'] ?? {}),
    );
  }
}
