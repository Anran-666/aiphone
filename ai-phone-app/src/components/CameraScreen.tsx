import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraScreenProps {
  onClose: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onClose }) => {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video' | 'portrait'>('photo');

  const handleCapture = () => {
    const photoUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setCapturedPhotos([photoUrl, ...capturedPhotos]);
  };

  const modes = [
    { id: 'photo', name: '拍照', icon: '📷' },
    { id: 'video', name: '录像', icon: '🎥' },
    { id: 'portrait', name: '人像', icon: '👤' },
  ];

  return (
    <div className="camera-screen">
      <div className="camera-header">
        <button className="camera-back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m0 0l7-7 7 7" />
          </svg>
        </button>
        <button 
          className={`flash-btn ${flashOn ? 'active' : ''}`}
          onClick={() => setFlashOn(!flashOn)}
        >
          {flashOn ? '💡' : '🔆'}
        </button>
      </div>

      <div className="camera-viewfinder">
        <div className="focus-frame">
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
        </div>
        <div className="camera-grid">
          <div className="grid-line horizontal"></div>
          <div className="grid-line horizontal"></div>
          <div className="grid-line vertical"></div>
          <div className="grid-line vertical"></div>
        </div>
      </div>

      <div className="camera-controls">
        <div className="mode-selector">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-btn ${cameraMode === mode.id ? 'active' : ''}`}
              onClick={() => setCameraMode(mode.id as typeof cameraMode)}
            >
              <span>{mode.icon}</span>
              <span className="mode-name">{mode.name}</span>
            </button>
          ))}
        </div>

        <div className="capture-button-container">
          {capturedPhotos.length > 0 && (
            <motion.div
              className="preview-thumb"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <img src={capturedPhotos[0]} alt="预览" />
            </motion.div>
          )}
          <motion.button
            className="capture-button"
            onClick={handleCapture}
            whileTap={{ scale: 0.9 }}
          >
            <div className="capture-inner"></div>
          </motion.button>
          <div className="gallery-placeholder">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {capturedPhotos.length > 0 && (
          <motion.div
            className="recent-photos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="recent-title">最近拍摄</div>
            <div className="recent-grid">
              {capturedPhotos.slice(0, 6).map((photo, index) => (
                <motion.div
                  key={photo}
                  className="recent-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img src={photo} alt={`照片 ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};