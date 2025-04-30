import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface VideoProctoringProps {
  onViolation: () => void;
}

const VideoProctoring: React.FC<VideoProctoringProps> = ({ onViolation }) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [outOfFrameCount, setOutOfFrameCount] = useState(0);
  const [lastWarningTime, setLastWarningTime] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));

    // Load face-api models
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]).then(() => {
      setModelsLoaded(true);
    });
  }, []);

  const handleCameraToggle = async () => {
    if (!cameraEnabled) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraEnabled(true);
        startFaceDetection();
      } catch (error) {
        console.error('Failed to access camera:', error);
      }
    } else {
      const stream = webcamRef.current?.video?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraEnabled(false);
    }
  };

  const startFaceDetection = async () => {
    if (!webcamRef.current?.video || !cameraEnabled || !modelsLoaded) return;

    const video = webcamRef.current.video;
    
    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (!detection) {
      setFaceDetected(false);
      setOutOfFrameCount(prev => prev + 1);

      if (outOfFrameCount > 5) {
        const now = Date.now();
        if (now - lastWarningTime > 5000) {
          onViolation();
          setLastWarningTime(now);
        }
      }
    } else {
      setFaceDetected(true);
      setOutOfFrameCount(0);

      const videoWidth = video.offsetWidth;
      const videoHeight = video.offsetHeight;
      
      const box = detection.box;
      const margin = 0.1;
      
      if (
        box.x < videoWidth * margin ||
        box.x + box.width > videoWidth * (1 - margin) ||
        box.y < videoHeight * margin ||
        box.y + box.height > videoHeight * (1 - margin)
      ) {
        onViolation();
        setLastWarningTime(Date.now());
      }
    }

    if (cameraEnabled) {
      requestAnimationFrame(startFaceDetection);
    }
  };

  useEffect(() => {
    let detectionInterval: number;

    if (cameraEnabled && modelsLoaded) {
      detectionInterval = window.setInterval(startFaceDetection, 1000);
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [cameraEnabled, modelsLoaded]);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
      {hasCamera ? (
        <>
          {cameraEnabled ? (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                width={200}
                height={150}
                mirrored
                className="rounded-lg"
              />
              <button
                onClick={handleCameraToggle}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <CameraOff size={16} />
              </button>
              {!faceDetected && (
                <div className="absolute bottom-2 left-2 right-2 bg-red-500 text-white text-xs p-1 rounded flex items-center">
                  <AlertTriangle size={12} className="mr-1" />
                  Face not detected
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleCameraToggle}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Camera size={16} className="mr-2" />
              Enable Camera
            </button>
          )}
        </>
      ) : (
        <div className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <CameraOff size={16} className="mr-2" />
          No camera detected
        </div>
      )}
    </div>
  );
};

export default VideoProctoring;