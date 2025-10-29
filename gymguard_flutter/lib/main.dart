import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'dart:ui' as ui;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Get available cameras
  final cameras = await availableCameras();
  
  runApp(MyApp(cameras: cameras));
}

class MyApp extends StatelessWidget {
  final List<CameraDescription> cameras;

  const MyApp({Key? key, required this.cameras}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GymGuard PoseNet',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: CameraScreen(cameras: cameras),
    );
  }
}

class CameraScreen extends StatefulWidget {
  final List<CameraDescription> cameras;

  const CameraScreen({Key? key, required this.cameras}) : super(key: key);

  @override
  _CameraScreenState createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  late CameraController _controller;
  late PoseDetector _poseDetector;
  List<Pose> _poses = [];
  bool _isInitialized = false;
  Size? _imageSize;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    _initializePoseDetector();
  }

  Future<void> _initializeCamera() async {
    _controller = CameraController(
      widget.cameras[1], // 1 = front camera
      ResolutionPreset.medium,
    );

    await _controller.initialize();
    
    _controller.startImageStream((image) async {
      if (!_isInitialized || _imageSize == null) {
        _imageSize = Size(image.width.toDouble(), image.height.toDouble());
        _isInitialized = true;
        setState(() {});
      }

      await _processImage(image);
    });

    setState(() {});
  }

  Future<void> _initializePoseDetector() async {
    final options = PoseDetectorOptions(
      mode: PoseMode.accurate,
    );
    _poseDetector = PoseDetector(options: options);
  }

  Future<void> _processImage(CameraImage image) async {
    final InputImage inputImage = _inputImageFromCameraImage(image);
    final List<Pose> poses = await _poseDetector.processImage(inputImage);
    
    if (mounted) {
      setState(() {
        _poses = poses;
      });
    }
  }

  InputImage _inputImageFromCameraImage(CameraImage image) {
    final WriteBuffer allBytes = WriteBuffer();
    for (final Plane plane in image.planes) {
      allBytes.putUint8List(plane.bytes);
    }
    final bytes = allBytes.done().buffer.asUint8List();

    final imageRotation = InputImageRotation.values[_controller.description.sensorOrientation];
    
    return InputImage.fromBytes(
      bytes: bytes,
      metadata: InputImageMetadata(
        size: Size(image.width.toDouble(), image.height.toDouble()),
        rotation: imageRotation,
        format: InputImageFormat.yuv420,
        bytesPerRow: image.planes[0].bytesPerRow,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _poseDetector.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_controller.value.isInitialized) {
      return Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          CameraPreview(_controller),
          if (_isInitialized && _imageSize != null)
            CustomPaint(
              painter: PosePainter(_poses, _imageSize!),
              child: Container(
                width: _imageSize!.width,
                height: _imageSize!.height,
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: Icon(Icons.camera_alt),
      ),
    );
  }
}

class PosePainter extends CustomPainter {
  final List<Pose> poses;
  final Size imageSize;

  PosePainter(this.poses, this.imageSize);

  @override
  void paint(Canvas canvas, Size size) {
    for (final pose in poses) {
      _drawPose(canvas, pose, size);
    }
  }

  void _drawPose(Canvas canvas, Pose pose, Size size) {
    final paint = Paint()
      ..color = Colors.cyan
      ..strokeWidth = 4.0
      ..style = PaintingStyle.stroke;

    final pointPaint = Paint()
      ..color = Colors.cyan
      ..style = PaintingStyle.fill;

    // Draw all keypoints
    for (final landmark in pose.landmarks.values) {
      final x = landmark.x;
      final y = landmark.y;

      // Draw point
      canvas.drawCircle(Offset(x, y), 12, pointPaint);
      canvas.drawCircle(Offset(x, y), 12, Paint()..color = Colors.white..strokeWidth = 2..style = PaintingStyle.stroke);
    }

    // Draw connections
    final connections = [
      (PoseLandmarkType.nose, PoseLandmarkType.leftEye),
      (PoseLandmarkType.nose, PoseLandmarkType.rightEye),
      (PoseLandmarkType.leftEye, PoseLandmarkType.rightEye),
      (PoseLandmarkType.leftShoulder, PoseLandmarkType.rightShoulder),
      (PoseLandmarkType.leftShoulder, PoseLandmarkType.leftElbow),
      (PoseLandmarkType.leftElbow, PoseLandmarkType.leftWrist),
      (PoseLandmarkType.rightShoulder, PoseLandmarkType.rightElbow),
      (PoseLandmarkType.rightElbow, PoseLandmarkType.rightWrist),
      (PoseLandmarkType.leftShoulder, PoseLandmarkType.leftHip),
      (PoseLandmarkType.rightShoulder, PoseLandmarkType.rightHip),
      (PoseLandmarkType.leftHip, PoseLandmarkType.rightHip),
      (PoseLandmarkType.leftHip, PoseLandmarkType.leftKnee),
      (PoseLandmarkType.leftKnee, PoseLandmarkType.leftAnkle),
      (PoseLandmarkType.rightHip, PoseLandmarkType.rightKnee),
      (PoseLandmarkType.rightKnee, PoseLandmarkType.rightAnkle),
    ];

    for (final connection in connections) {
      final start = pose.landmarks[connection.$1];
      final end = pose.landmarks[connection.$2];
      
      if (start != null && end != null) {
        canvas.drawLine(
          Offset(start.x, start.y),
          Offset(end.x, end.y),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(PosePainter oldDelegate) {
    return poses != oldDelegate.poses;
  }
}

