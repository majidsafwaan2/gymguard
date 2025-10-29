import UIKit
import AVFoundation
import Vision

class CameraViewController: UIViewController {
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    
    @IBOutlet weak var cameraView: UIView!
    @IBOutlet weak var poseOverlayView: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupCamera()
    }
    
    func setupCamera() {
        let captureSession = AVCaptureSession()
        self.captureSession = captureSession
        
        guard let videoCaptureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
              let videoInput = try? AVCaptureDeviceInput(device: videoCaptureDevice) else {
            return
        }
        
        captureSession.addInput(videoInput)
        
        let videoOutput = AVCaptureVideoDataOutput()
        videoOutput.setSampleBufferDelegate(self, queue: DispatchQueue(label: "videoQueue"))
        captureSession.addOutput(videoOutput)
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = cameraView.bounds
        previewLayer.videoGravity = .resizeAspectFill
        cameraView.layer.addSublayer(previewLayer)
        self.previewLayer = previewLayer
        
        DispatchQueue.global(qos: .userInitiated).async {
            captureSession.startRunning()
        }
    }
    
    func detectPose(in image: CIImage) {
        let request = VNDetectHumanBodyPoseRequest { [weak self] request, error in
            guard let observations = request.results as? [VNHumanBodyPoseObservation] else { return }
            self?.processPoseObservations(observations)
        }
        
        let handler = VNImageRequestHandler(ciImage: image, options: [:])
        try? handler.perform([request])
    }
    
    func processPoseObservations(_ observations: [VNHumanBodyPoseObservation]) {
        guard let observation = observations.first else { return }
        
        DispatchQueue.main.async {
            self.drawPose(observation)
        }
    }
    
    func drawPose(_ observation: VNHumanBodyPoseObservation) {
        // Clear previous drawings
        poseOverlayView.layer.sublayers?.forEach { $0.removeFromSuperlayer() }
        
        let jointNames: [VNHumanBodyPoseObservation.JointName] = [
            .head, .neck, .rightShoulder, .rightElbow, .rightWrist,
            .leftShoulder, .leftElbow, .leftWrist,
            .root, .rightHip, .rightKnee, .rightAnkle,
            .leftHip, .leftKnee, .leftAnkle
        ]
        
        let size = poseOverlayView.bounds.size
        
        // Get keypoints
        for jointName in jointNames {
            guard let point = try? observation.recognizedPoint(jointName),
                  point.confidence > 0.3 else { continue }
            
            let x = point.location.x * size.width
            let y = (1.0 - point.location.y) * size.height
            
            // Draw keypoint circle
            let circle = CAShapeLayer()
            circle.path = UIBezierPath(arcCenter: CGPoint(x: x, y: y), radius: 10, startAngle: 0, endAngle: .pi * 2, clockwise: true).cgPath
            circle.fillColor = UIColor.cyan.cgColor
            circle.strokeColor = UIColor.white.cgColor
            circle.lineWidth = 3
            
            poseOverlayView.layer.addSublayer(circle)
        }
        
        // Draw skeleton connections
        let connections: [(VNHumanBodyPoseObservation.JointName, VNHumanBodyPoseObservation.JointName)] = [
            (.neck, .rightShoulder), (.neck, .leftShoulder),
            (.rightShoulder, .rightElbow), (.rightElbow, .rightWrist),
            (.leftShoulder, .leftElbow), (.leftElbow, .leftWrist),
            (.root, .rightHip), (.root, .leftHip),
            (.rightHip, .rightKnee), (.rightKnee, .rightAnkle),
            (.leftHip, .leftKnee), (.leftKnee, .leftAnkle)
        ]
        
        for (start, end) in connections {
            guard let startPoint = try? observation.recognizedPoint(start),
                  let endPoint = try? observation.recognizedPoint(end),
                  startPoint.confidence > 0.3,
                  endPoint.confidence > 0.3 else { continue }
            
            let line = CAShapeLayer()
            let path = UIBezierPath()
            let startX = startPoint.location.x * size.width
            let startY = (1.0 - startPoint.location.y) * size.height
            let endX = endPoint.location.x * size.width
            let endY = (1.0 - endPoint.location.y) * size.height
            
            path.move(to: CGPoint(x: startX, y: startY))
            path.addLine(to: CGPoint(x: endX, y: endY))
            
            line.path = path.cgPath
            line.strokeColor = UIColor.cyan.cgColor
            line.lineWidth = 4
            line.opacity = 0.7
            
            poseOverlayView.layer.addSublayer(line)
        }
    }
}

extension CameraViewController: AVCaptureVideoDataOutputSampleBufferDelegate {
    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        detectPose(in: ciImage)
    }
}

