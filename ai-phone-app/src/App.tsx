import { Phone } from './components';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import './App.css';

function AppContent() {
  const { isDarkMode } = useSettings();

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="app-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <header className="app-header">
        <h1>AI Phone</h1>
        <p>智联未来 · 共创下一代智能手机</p>
      </header>

      <main className="app-main">
        <Phone initialMode="folded" />
      </main>

      <footer className="app-footer">
        <div className="interaction-hints">
          <span className="hint-item">👆 点击唤醒</span>
          <span className="hint-item">👋 手势交互</span>
          <span className="hint-item">🎤 语音指令</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
