import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { UserProfile, defaultSettings } from '../types/settings';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(settings.profile);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const updateNotification = (key: string, value: any) => {
    updateSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    });
  };

  const updateDisplay = (key: string, value: any) => {
    updateSettings({
      ...settings,
      display: { ...settings.display, [key]: value },
    });
  };

  const updatePrivacy = (key: string, value: any) => {
    updateSettings({
      ...settings,
      privacy: { ...settings.privacy, [key]: value },
    });
  };

  const handleSaveProfile = () => {
    updateSettings({ ...settings, profile: tempProfile });
    setEditingProfile(false);
  };

  const handleClearAllData = () => {
    localStorage.removeItem('appSettings');
    localStorage.removeItem('calendarEvents');
    localStorage.removeItem('aiMessages');
    updateSettings(defaultSettings);
    setTempProfile(defaultSettings.profile);
    setShowClearConfirm(false);
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 2000);
  };

  const sections = [
    { id: 'profile', title: '个人资料', icon: '👤' },
    { id: 'notifications', title: '通知设置', icon: '🔔' },
    { id: 'display', title: '显示设置', icon: '🎨' },
    { id: 'privacy', title: '隐私设置', icon: '🔒' },
  ];

  const renderToggle = (enabled: boolean, onToggle: () => void) => (
    <button
      className={`toggle-btn ${enabled ? 'active' : ''}`}
      onClick={onToggle}
    >
      <motion.div
        className="toggle-thumb"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'profile':
        return (
          <motion.div
            className="settings-section-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {editingProfile ? (
              <>
                <div className="form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>电话</label>
                  <input
                    type="text"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>邮箱</label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button className="action-btn secondary" onClick={() => setEditingProfile(false)}>取消</button>
                  <button className="action-btn primary" onClick={handleSaveProfile}>保存</button>
                </div>
              </>
            ) : (
              <>
                <div className="profile-card">
                  <div className="profile-avatar">{settings.profile.avatar}</div>
                  <div className="profile-info">
                    <h3>{settings.profile.name}</h3>
                    <p>{settings.profile.phone}</p>
                  </div>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">邮箱</span>
                    <span className="info-value">{settings.profile.email}</span>
                  </div>
                </div>
                <button className="action-btn primary full-width" onClick={() => setEditingProfile(true)}>
                  编辑资料
                </button>
              </>
            )}
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            className="settings-section-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">推送通知</span>
                <span className="setting-desc">接收应用推送消息</span>
              </div>
              {renderToggle(settings.notifications.enabled, () =>
                updateNotification('enabled', !settings.notifications.enabled)
              )}
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">声音</span>
                <span className="setting-desc">通知声音提示</span>
              </div>
              {renderToggle(settings.notifications.sound, () =>
                updateNotification('sound', !settings.notifications.sound)
              )}
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">震动</span>
                <span className="setting-desc">通知震动提示</span>
              </div>
              {renderToggle(settings.notifications.vibration, () =>
                updateNotification('vibration', !settings.notifications.vibration)
              )}
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">日程提醒</span>
                <span className="setting-desc">提前提醒日程安排</span>
              </div>
              {renderToggle(settings.notifications.dailyReminder, () =>
                updateNotification('dailyReminder', !settings.notifications.dailyReminder)
              )}
            </div>
            {settings.notifications.dailyReminder && (
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">提醒时间</span>
                </div>
                <input
                  type="time"
                  value={settings.notifications.reminderTime}
                  onChange={(e) => updateNotification('reminderTime', e.target.value)}
                  className="time-input"
                />
              </div>
            )}
          </motion.div>
        );

      case 'display':
        return (
          <motion.div
            className="settings-section-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">深色模式</span>
                <span className="setting-desc">开启深色主题</span>
              </div>
              {renderToggle(settings.display.darkMode, () =>
                updateDisplay('darkMode', !settings.display.darkMode)
              )}
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">自动亮度</span>
                <span className="setting-desc">根据环境自动调节</span>
              </div>
              {renderToggle(settings.display.autoBrightness, () =>
                updateDisplay('autoBrightness', !settings.display.autoBrightness)
              )}
            </div>
            {!settings.display.autoBrightness && (
              <div className="setting-item column">
                <div className="setting-info">
                  <span className="setting-label">屏幕亮度</span>
                  <span className="setting-value">{settings.display.brightness}%</span>
                </div>
                <div className="brightness-slider-container">
                  <span className="slider-icon">🌙</span>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={settings.display.brightness}
                    onChange={(e) => updateDisplay('brightness', parseInt(e.target.value))}
                    className="brightness-slider"
                  />
                  <span className="slider-icon">☀️</span>
                </div>
              </div>
            )}
            <div className="setting-item column">
              <div className="setting-info">
                <span className="setting-label">字体大小</span>
              </div>
              <div className="font-size-options">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    className={`font-size-btn ${settings.display.fontSize === size ? 'active' : ''}`}
                    onClick={() => updateDisplay('fontSize', size)}
                  >
                    {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div
            className="settings-section-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">位置服务</span>
                <span className="setting-desc">允许应用访问位置信息</span>
              </div>
              {renderToggle(settings.privacy.locationEnabled, () =>
                updatePrivacy('locationEnabled', !settings.privacy.locationEnabled)
              )}
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">活动状态</span>
                <span className="setting-desc">显示在线状态</span>
              </div>
              {renderToggle(settings.privacy.activityStatus, () =>
                updatePrivacy('activityStatus', !settings.privacy.activityStatus)
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="settings-screen"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="settings-header">
        <button className="back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2>设置</h2>
        <div style={{ width: 40 }} />
      </div>

      <div className="settings-content">
        <div className="settings-menu">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`menu-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <span className="menu-icon">{section.icon}</span>
              <span className="menu-title">{section.title}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={activeSection === section.id ? "M5 12h14M12 5l7 7-7 7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeSection && (
            <motion.div
              className="settings-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h3 className="detail-title">
                {sections.find((s) => s.id === activeSection)?.title}
              </h3>
              {renderSection(activeSection)}
            </motion.div>
          )}
        </AnimatePresence>

        {!activeSection && (
          <motion.div
            className="settings-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="settings-version">
              <p>AI Phone v1.0.0</p>
              <p className="copyright">© 2024 AI Phone. All rights reserved.</p>
            </div>

            <button
              className="danger-btn"
              onClick={() => setShowClearConfirm(true)}
            >
              🗑️ 清除所有数据
            </button>

            {clearSuccess && (
              <motion.div
                className="toast success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✓ 数据已清除
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>⚠️ 确认清除</h3>
              </div>
              <div className="modal-body">
                <p>确定要清除所有数据吗？此操作不可恢复。</p>
                <p className="warning-text">将清除：设置、日程、聊天记录等所有本地数据</p>
              </div>
              <div className="modal-footer">
                <button className="modal-btn cancel" onClick={() => setShowClearConfirm(false)}>
                  取消
                </button>
                <button className="modal-btn danger" onClick={handleClearAllData}>
                  确认清除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
