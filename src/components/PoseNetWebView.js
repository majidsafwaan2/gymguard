import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

const PoseNetWebView = ({ isActive }) => {
  if (!isActive) return null;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: transparent;
    }
    #overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .keypoint {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #00ffff;
      border: 2px solid #ffffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .connection {
      position: absolute;
      height: 2px;
      background: #00ffff;
      opacity: 0.7;
      transform-origin: left center;
    }
  </style>
</head>
<body>
  <div id="overlay"></div>

  <!-- TensorFlow.js not available in Expo Go WebView -->
  
  <script>
    let detector;
    let isTracking = false;
    let keypoints = [];

    // Simulate MoveNet pose detection with webcam-like data
    function initializePoseNet() {
      try {
        detector = true; // Placeholder
        isTracking = true;
        simulateKeypoints();
      } catch (error) {
        console.error('PoseNet init error:', error);
      }
    }

    function simulateKeypoints() {
      if (!isTracking) return;

      // Simulate realistic keypoint tracking
      const basePositions = [
        { x: 50, y: 15, name: 'nose' },
        { x: 45, y: 28, name: 'left_eye' },
        { x: 55, y: 28, name: 'right_eye' },
        { x: 40, y: 30, name: 'left_ear' },
        { x: 60, y: 30, name: 'right_ear' },
        { x: 45, y: 40, name: 'left_shoulder' },
        { x: 55, y: 40, name: 'right_shoulder' },
        { x: 38, y: 55, name: 'left_elbow' },
        { x: 62, y: 55, name: 'right_elbow' },
        { x: 35, y: 65, name: 'left_wrist' },
        { x: 65, y: 65, name: 'right_wrist' },
        { x: 48, y: 50, name: 'left_hip' },
        { x: 52, y: 50, name: 'right_hip' },
        { x: 48, y: 70, name: 'left_knee' },
        { x: 52, y: 70, name: 'right_knee' },
        { x: 48, y: 88, name: 'left_ankle' },
        { x: 52, y: 88, name: 'right_ankle' },
      ];

      // Add realistic movement
      const centerX = 50;
      const centerY = 50;
      const movementX = Math.sin(Date.now() / 1000) * 2;
      const movementY = Math.cos(Date.now() / 1000) * 1.5;

      keypoints = basePositions.map((pos, i) => ({
        x: pos.x + movementX + (Math.random() - 0.5) * 1.5,
        y: pos.y + movementY + (Math.random() - 0.5) * 1.5,
        score: 0.8 + Math.random() * 0.2,
      }));

      updateOverlay();
      requestAnimationFrame(simulateKeypoints);
    }

    function updateOverlay() {
      const overlay = document.getElementById('overlay');
      overlay.innerHTML = '';

      // Draw connections
      const connections = [
        [0, 1], [0, 2], [1, 2], [1, 3], [2, 4],
        [5, 6], [5, 7], [6, 8], [7, 9], [8, 10],
        [5, 11], [6, 12], [11, 12],
        [11, 13], [12, 14], [13, 15], [14, 16]
      ];

      connections.forEach(([startIdx, endIdx]) => {
        const start = keypoints[startIdx];
        const end = keypoints[endIdx];
        if (start && end && start.score > 0.3 && end.score > 0.3) {
          const line = document.createElement('div');
          line.className = 'connection';
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          line.style.width = length + '%';
          line.style.left = start.x + '%';
          line.style.top = start.y + '%';
          line.style.transform = 'rotate(' + angle + 'deg)';
          overlay.appendChild(line);
        }
      });

      // Draw keypoints
      keypoints.forEach((kp) => {
        if (kp.score > 0.3) {
          const dot = document.createElement('div');
          dot.className = 'keypoint';
          dot.style.left = kp.x + '%';
          dot.style.top = kp.y + '%';
          overlay.appendChild(dot);
        }
      });
    }

    // Initialize on load
    window.addEventListener('load', initializePoseNet);
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.webViewContainer}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webView}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default PoseNetWebView;
