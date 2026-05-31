import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface HomeScreenProps {
  onOpenAIAssistant: () => void;
  onGestureAction: (action: string) => void;
  onOpenMap: () => void;
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
  onOpenCamera: () => void;
  onOpenWeather: () => void;
  onOpenMusic: () => void;
}

const apps = [
  { id: 'camera', name: '相机', icon: '📷', color: '#6366f1' },
  { id: 'weather', name: '天气', icon: '☀️', color: '#f59e0b' },
  { id: 'music', name: '音乐', icon: '🎵', color: '#ec4899' },
  { id: 'calendar', name: '日程', icon: '📅', color: '#10b981' },
  { id: 'maps', name: '地图', icon: '🗺️', color: '#3b82f6' },
  { id: 'settings', name: '设置', icon: '⚙️', color: '#64748b' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAIAssistant, onOpenMap, onOpenCalendar, onOpenSettings, onOpenCamera, onOpenWeather, onOpenMusic }) => {
  const [gestureHint, setGestureHint] = useState<string | null>(null);

  const handleAppClick = (appId: string) => {
    if (appId === 'settings') {
      onOpenSettings();
    } else if (appId === 'maps') {
      onOpenMap();
    } else if (appId === 'calendar') {
      onOpenCalendar();
    } else if (appId === 'camera') {
      onOpenCamera();
    } else if (appId === 'weather') {
      onOpenWeather();
    } else if (appId === 'music') {
      onOpenMusic();
    } else {
      setGestureHint(`打开 ${appId}`);
      setTimeout(() => setGestureHint(null), 1500);
    }
  };

  return (
    <div className="home-screen">
      <motion.div
        className="status-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="status-time">9:41</div>
        <div className="status-icons">
          <span className="signal">📶</span>
          <span className="battery">🔋 85%</span>
        </div>
      </motion.div>

      <motion.div
        className="widget-area"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="time-widget"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="date">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</div>
        </motion.div>

        <motion.div
          className="weather-widget"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="weather-icon">☀️</div>
          <div className="weather-info">
            <div className="temperature">26°</div>
            <div className="condition">晴朗</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="ai-shortcut"
        onClick={onOpenAIAssistant}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="ai-avatar-small">
          <motion.div
            className="pulse-ring"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <span>和智联对话</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </motion.div>

      <motion.div
        className="apps-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            className="app-icon"
            onClick={() => handleAppClick(app.id)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            style={{ '--app-color': app.color } as React.CSSProperties}
          >
            <div className="app-icon-bg" style={{ background: app.color }}>
              <span className="app-emoji">{app.icon}</span>
            </div>
            <span className="app-name">{app.name}</span>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {gestureHint && (
          <motion.div
            className="gesture-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zm5.5 2.47l-2.47 2.47-1.06-1.06 3.53-3.53 1.06 1.06 2.47-2.47v7.53h-3v-7.5z" />
            </svg>
            {gestureHint}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="gesture-guide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="guide-item">
          <span className="guide-icon">👆</span>
          <span>点击</span>
        </div>
        <div className="guide-item">
          <span className="guide-icon">👋</span>
          <span>语音</span>
        </div>
        <div className="guide-item">
          <span className="guide-icon">👁️</span>
          <span>视线</span>
        </div>
      </motion.div>
    </div>
  );
};
