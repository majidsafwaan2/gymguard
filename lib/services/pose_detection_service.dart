import 'dart:async';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:camera/camera.dart';
import 'package:image/image.dart' as img;
import 'package:google_ml_kit/google_ml_kit.dart';

import '../models/pose_model.dart';
import '../models/exercise_model.dart';
import '../utils/pose_analyzer.dart';
import '../utils/exercise_detector.dart';

class PoseDetectionService extends ChangeNotifier {
  CameraController? _cameraController;
  PoseDetector? _poseDetector;
  Timer? _analysisTimer;
  
  bool _isInitialized = false;
  bool _isDetecting = false;
  bool _isAnalyzing = false;
  
  PoseFrame? _currentPoseFrame;
  FormAnalysis? _currentFormAnalysis;
  Exercise? _currentExercise;
  
  List<PoseFrame> _poseHistory = [];
  List<FormAnalysis> _formHistory = [];
  
  double _confidence = 0.0;
  String _status = 'Initializing...';
  
  // Getters
  bool get isInitialized => _isInitialized;
  bool get isDetecting => _isDetecting;
  bool get isAnalyzing => _isAnalyzing;
  PoseFrame? get currentPoseFrame => _currentPoseFrame;
  FormAnalysis? get currentFormAnalysis => _currentFormAnalysis;
  Exercise? get currentExercise => _currentExercise;
  List<PoseFrame> get poseHistory => _poseHistory;
  List<FormAnalysis> get formHistory => _formHistory;
  double get confidence => _confidence;
  String get status => _status;

  // Initialize the service
  Future<void> initialize() async {
    try {
      _status = 'Initializing camera...';
      notifyListeners();
      
      // Initialize camera
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        throw Exception('No cameras available');
      }
      
      // Use front camera for selfie mode
      final frontCamera = cameras.firstWhere(
        (camera) => camera.lensDirection == CameraLensDirection.front,
        orElse: () => cameras.first,
      );
      
      _cameraController = CameraController(
        frontCamera,
        ResolutionPreset.high,
        enableAudio: false,
        imageFormatGroup: Platform.isAndroid 
            ? ImageFormatGroup.yuv420 
            : ImageFormatGroup.bgra8888,
      );
      
      await _cameraController!.initialize();
      
      // Initialize pose detector
      _status = 'Initializing pose detector...';
      notifyListeners();
      
      _poseDetector = GoogleMlKit.vision.poseDetector(
        options: PoseDetectorOptions(
          model: PoseDetectionModel.accurate,
          mode: PoseDetectionMode.stream,
        ),
      );
      
      _isInitialized = true;
      _status = 'Ready';
      notifyListeners();
      
    } catch (e) {
      _status = 'Initialization failed: $e';
      notifyListeners();
      rethrow;
    }
  }

  // Start pose detection
  Future<void> startDetection() async {
    if (!_isInitialized || _isDetecting) return;
    
    try {
      _isDetecting = true;
      _status = 'Starting detection...';
      notifyListeners();
      
      await _cameraController!.startImageStream(_processImage);
      
      _status = 'Detecting poses...';
      notifyListeners();
      
    } catch (e) {
      _isDetecting = false;
      _status = 'Detection failed: $e';
      notifyListeners();
      rethrow;
    }
  }

  // Stop pose detection
  Future<void> stopDetection() async {
    if (!_isDetecting) return;
    
    try {
      _isDetecting = false;
      _status = 'Stopping detection...';
      notifyListeners();
      
      await _cameraController!.stopImageStream();
      _analysisTimer?.cancel();
      
      _status = 'Detection stopped';
      notifyListeners();
      
    } catch (e) {
      _status = 'Stop detection failed: $e';
      notifyListeners();
      rethrow;
    }
  }

  // Process camera image for pose detection
  Future<void> _processImage(CameraImage image) async {
    if (!_isDetecting || _poseDetector == null) return;
    
    try {
      final inputImage = _convertCameraImage(image);
      final poses = await _poseDetector!.processImage(inputImage);
      
      if (poses.isNotEmpty) {
        final pose = poses.first;
        final poseFrame = _convertPoseToFrame(pose, image);
        
        _currentPoseFrame = poseFrame;
        _poseHistory.add(poseFrame);
        
        // Keep only last 100 frames for memory management
        if (_poseHistory.length > 100) {
          _poseHistory.removeAt(0);
        }
        
        // Start form analysis if exercise is set
        if (_currentExercise != null && !_isAnalyzing) {
          _startFormAnalysis();
        }
        
        notifyListeners();
      }
      
    } catch (e) {
      debugPrint('Pose detection error: $e');
    }
  }

  // Convert camera image to ML Kit input image
  InputImage _convertCameraImage(CameraImage image) {
    final WriteBuffer allBytes = WriteBuffer();
    for (final Plane plane in image.planes) {
      allBytes.putUint8List(plane.bytes);
    }
    final bytes = allBytes.done().buffer.asUint8List();

    final Size imageSize = Size(image.width.toDouble(), image.height.toDouble());
    final InputImageRotation imageRotation = InputImageRotation.rotation0deg;
    final InputImageFormat inputImageFormat = InputImageFormat.bgra8888;

    final planeData = image.planes.map(
      (Plane plane) {
        return InputImagePlaneMetadata(
          bytesPerRow: plane.bytesPerRow,
          height: plane.height,
          width: plane.width,
        );
      },
    ).toList();

    return InputImage.fromBytes(
      bytes: bytes,
      metadata: InputImageMetadata(
        size: imageSize,
        rotation: imageRotation,
        format: inputImageFormat,
        bytesPerRow: image.planes.first.bytesPerRow,
      ),
    );
  }

  // Convert ML Kit pose to our PoseFrame model
  PoseFrame _convertPoseToFrame(Pose pose, CameraImage image) {
    final landmarks = <PoseLandmark>[];
    
    // Convert pose landmarks to our model
    for (final landmark in pose.landmarks.values) {
      landmarks.add(PoseLandmark(
        id: landmark.type.index,
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.likelihood,
        presence: landmark.likelihood,
        name: _getLandmarkName(landmark.type),
      ));
    }
    
    return PoseFrame(
      landmarks: landmarks,
      timestamp: DateTime.now(),
      confidence: pose.landmarks.values.map((l) => l.likelihood).reduce((a, b) => a + b) / pose.landmarks.length,
      exerciseId: _currentExercise?.id,
    );
  }

  // Get landmark name from ML Kit pose type
  String _getLandmarkName(PoseLandmarkType type) {
    switch (type) {
      case PoseLandmarkType.nose:
        return 'nose';
      case PoseLandmarkType.leftEye:
        return 'left_eye';
      case PoseLandmarkType.rightEye:
        return 'right_eye';
      case PoseLandmarkType.leftEar:
        return 'left_ear';
      case PoseLandmarkType.rightEar:
        return 'right_ear';
      case PoseLandmarkType.leftShoulder:
        return 'left_shoulder';
      case PoseLandmarkType.rightShoulder:
        return 'right_shoulder';
      case PoseLandmarkType.leftElbow:
        return 'left_elbow';
      case PoseLandmarkType.rightElbow:
        return 'right_elbow';
      case PoseLandmarkType.leftWrist:
        return 'left_wrist';
      case PoseLandmarkType.rightWrist:
        return 'right_wrist';
      case PoseLandmarkType.leftHip:
        return 'left_hip';
      case PoseLandmarkType.rightHip:
        return 'right_hip';
      case PoseLandmarkType.leftKnee:
        return 'left_knee';
      case PoseLandmarkType.rightKnee:
        return 'right_knee';
      case PoseLandmarkType.leftAnkle:
        return 'left_ankle';
      case PoseLandmarkType.rightAnkle:
        return 'right_ankle';
      default:
        return 'unknown';
    }
  }

  // Set current exercise for form analysis
  void setExercise(Exercise exercise) {
    _currentExercise = exercise;
    _status = 'Exercise set: ${exercise.name}';
    notifyListeners();
  }

  // Start form analysis
  void _startFormAnalysis() {
    if (_isAnalyzing || _currentExercise == null) return;
    
    _isAnalyzing = true;
    _status = 'Analyzing form...';
    notifyListeners();
    
    // Analyze form every 500ms for real-time feedback
    _analysisTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (!_isAnalyzing || _currentPoseFrame == null) {
        timer.cancel();
        return;
      }
      
      _analyzeForm();
    });
  }

  // Analyze current pose for form correctness
  void _analyzeForm() {
    if (_currentPoseFrame == null || _currentExercise == null) return;
    
    try {
      final analyzer = PoseAnalyzer();
      final analysis = analyzer.analyzePose(
        _currentPoseFrame!,
        _currentExercise!,
      );
      
      _currentFormAnalysis = analysis;
      _formHistory.add(analysis);
      
      // Keep only last 50 analyses
      if (_formHistory.length > 50) {
        _formHistory.removeAt(0);
      }
      
      _status = 'Form score: ${(analysis.overallScore * 100).toStringAsFixed(1)}%';
      notifyListeners();
      
    } catch (e) {
      debugPrint('Form analysis error: $e');
    }
  }

  // Get form feedback for current pose
  List<FormFeedback> getCurrentFeedback() {
    return _currentFormAnalysis?.feedback ?? [];
  }

  // Get form score trend
  List<double> getFormScoreTrend() {
    return _formHistory.map((analysis) => analysis.overallScore).toList();
  }

  // Check if form is improving
  bool isFormImproving() {
    if (_formHistory.length < 3) return false;
    
    final recentScores = _formHistory.take(3).map((a) => a.overallScore).toList();
    return recentScores[0] < recentScores[1] && recentScores[1] < recentScores[2];
  }

  // Reset analysis
  void resetAnalysis() {
    _currentFormAnalysis = null;
    _formHistory.clear();
    _poseHistory.clear();
    _status = 'Analysis reset';
    notifyListeners();
  }

  // Dispose resources
  @override
  void dispose() {
    _analysisTimer?.cancel();
    _cameraController?.dispose();
    _poseDetector?.close();
    super.dispose();
  }
}
