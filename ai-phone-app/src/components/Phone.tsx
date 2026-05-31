
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { PhoneMode } from '../types';
import { HomeScreen } from './HomeScreen';
import { AIAssistant } from './AIAssistant';
import { MapScreen } from './MapScreen';
import { CalendarScreen } from './CalendarScreen';
import { SettingsScreen } from './SettingsScreen';

interface PhoneProps {
  initialMode?: PhoneMode;
}

export const Phone: React.FC<PhoneProps> = ({ initialMode = 'folded' }) => {
  const [mode, setMode] = useState<PhoneMode>(initialMode);
  const [isWakeUp, setIsWakeUp] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'ai-assistant' | 'map' | 'calendar' | 'camera' | 'settings'>('home');

  const bind = useDrag(
    ({ movement: [mx, my], down, cancel }) => {
      if (!down && Math.abs(mx) > 50 && Math.abs(mx) > Math.abs(my)) {
        if (mode === 'folded' && mx > 50) {
          setMode('unfolded');
        } else if (mode === 'unfolded' && mx < -50) {
          setMode('folded');
        }
        cancel();
      }
      if (!down && Math.abs(my) > 80 && Math.abs(my) > Math.abs(mx)) {
        if (my > 0 && mode === 'unfolded') {
          setMode('hover');
        } else if (my < 0 && mode === 'hover') {
          setMode('unfolded');
        }
        cancel();
      }
    },
    { filterTaps: true }
  );

  const handleTouch = useCallback(() => {
    if (!isWakeUp) {
      setIsWakeUp(true);
    }
  }, [isWakeUp]);

  const handleOpenAIAssistant = () => {
    setCurrentScreen('ai-assistant');
  };

  const handleCloseAIAssistant = () => {
    setCurrentScreen('home');
  };

  const handleOpenMap = () => {
    setCurrentScreen('map');
  };

  const handleCloseMap = () => {
    setCurrentScreen('home');
  };

  const handleOpenCalendar = () => {
    setCurrentScreen('calendar');
  };

  const handleCloseCalendar = () => {
    setCurrentScreen('home');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('home');
  };

  const handleGestureAction = (action: string) => {
    if (action === 'open_map') {
      handleOpenMap();
    } else if (action === 'open_calendar') {
      handleOpenCalendar();
    } else if (action === 'open_settings') {
      handleOpenSettings();
    } else {
      console.log('Gesture action:', action);
    }
  };

  const phoneWidth = mode === 'folded' ? 280 : mode === 'unfolded' ? 350 : 350;
  const phoneHeight = mode === 'folded' ? 560 : mode === 'unfolded' ? 560 : 520;

  return (
    <div className="phone-container">
      <motion.div
        {...bind() as any}
        className={`phone phone-${mode} ${isWakeUp ? 'wake-up' : ''}`}
        style={{
          width: phoneWidth,
          height: phoneHeight,
        }}
        onClick={handleTouch}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="phone-body"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="phone-frame"
            animate={{
              borderRadius: mode === 'hover' ? '20px 20px 40px 40px' : '30px',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="screen">
              <AnimatePresence mode="wait">
                {isWakeUp && currentScreen === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="screen-content"
                  >
                    <HomeScreen
                      onOpenAIAssistant={handleOpenAIAssistant}
                      onGestureAction={handleGestureAction}
                      onOpenMap={handleOpenMap}
                      onOpenCalendar={handleOpenCalendar}
                      onOpenSettings={handleOpenSettings}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentScreen === 'ai-assistant' && (
                  <motion.div
                    key="ai-assistant"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="screen-content"
                  >
                    <AIAssistant onClose={handleCloseAIAssistant} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentScreen === 'map' && (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="screen-content"
                  >
                    <MapScreen onClose={handleCloseMap} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentScreen === 'calendar' && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="screen-content"
                  >
                    <CalendarScreen onClose={handleCloseCalendar} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentScreen === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="screen-content"
                  >
                    <SettingsScreen onClose={handleCloseSettings} />
                  </motion.div>
                )}
              </AnimatePresence>

              {!isWakeUp && (
                <motion.div
                  className="lock-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={(e) => { e.stopPropagation(); setIsWakeUp(true); }}
                >
                  <motion.div
                    className="brand-logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    <span className="logo-text">AI Phone</span>
                    <span className="logo-sub">智联未来</span>
                  </motion.div>
                  <div className="unlock-hint">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      👆 点击解锁
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>

            {mode !== 'folded' && (
              <motion.div
                className="hinge-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.div>
        </motion.div>

        {mode === 'unfolded' && (
          <motion.div
            className="mode-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            大屏模式
          </motion.div>
        )}

        {mode === 'hover' && (
          <motion.div
            className="mode-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            悬停观影模式
          </motion.div>
        )}
      </motion.div>

      <div className="mode-switch-hint">
        <p>
          {mode === 'folded' && '→ 水平滑动展开  ↓ 向上滑动进入观影模式'}
          {mode === 'unfolded' && '← 水平滑动折叠  ↓ 继续向下滑动悬停'}
          {mode === 'hover' && '↑ 向上滑动回到展开模式'}
        </p>
      </div>
    </div>
  );
};
