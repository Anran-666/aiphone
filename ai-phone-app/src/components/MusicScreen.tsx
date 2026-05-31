import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MusicScreenProps {
  onClose: () => void;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
}

const mockSongs: Song[] = [
  { id: '1', title: '夜曲', artist: '周杰伦', album: '十一月的萧邦', duration: 245, cover: 'https://picsum.photos/300/300?random=1' },
  { id: '2', title: '晴天', artist: '周杰伦', album: '叶惠美', duration: 269, cover: 'https://picsum.photos/300/300?random=2' },
  { id: '3', title: '稻香', artist: '周杰伦', album: '魔杰座', duration: 210, cover: 'https://picsum.photos/300/300?random=3' },
  { id: '4', title: '七里香', artist: '周杰伦', album: '七里香', duration: 299, cover: 'https://picsum.photos/300/300?random=4' },
  { id: '5', title: '简单爱', artist: '周杰伦', album: '范特西', duration: 270, cover: 'https://picsum.photos/300/300?random=5' },
];

export const MusicScreen: React.FC<MusicScreenProps> = ({ onClose }) => {
  const [currentSong, setCurrentSong] = useState<Song>(mockSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            if (repeatMode === 'one') return 0;
            if (repeatMode === 'all') {
              const nextIndex = (mockSongs.findIndex((s) => s.id === currentSong.id) + 1) % mockSongs.length;
              setCurrentSong(mockSongs[nextIndex]);
            }
            return currentSong.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, repeatMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = mockSongs.findIndex((s) => s.id === currentSong.id);
    if (shuffleOn) {
      const randomIndex = Math.floor(Math.random() * mockSongs.length);
      setCurrentSong(mockSongs[randomIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % mockSongs.length;
      setCurrentSong(mockSongs[nextIndex]);
    }
    setCurrentTime(0);
  };

  const handlePrev = () => {
    const currentIndex = mockSongs.findIndex((s) => s.id === currentSong.id);
    if (currentTime < 5) {
      const prevIndex = (currentIndex - 1 + mockSongs.length) % mockSongs.length;
      setCurrentSong(mockSongs[prevIndex]);
    }
    setCurrentTime(0);
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const handleRepeat = () => {
    const modes: ('off' | 'one' | 'all')[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="music-screen">
      <div className="music-header">
        <button className="music-back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m0 0l7-7 7 7" />
          </svg>
        </button>
        <h2 className="music-title">音乐</h2>
        <button className="music-search-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      <motion.div
        className="album-cover"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`cover-image ${isPlaying ? 'spinning' : ''}`}>
          <img src={currentSong.cover} alt={currentSong.album} />
        </div>
        <motion.div
          className="cover-glow"
          animate={{ opacity: isPlaying ? 0.5 : 0.2 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <motion.div
        className="song-info"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="song-title">{currentSong.title}</h3>
        <p className="song-artist">{currentSong.artist}</p>
        <p className="song-album">{currentSong.album}</p>
      </motion.div>

      <motion.div
        className="progress-bar-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="time-current">{formatTime(currentTime)}</span>
        <div className="progress-bar-wrapper">
          <input
            type="range"
            min="0"
            max={currentSong.duration}
            value={currentTime}
            onChange={handleProgress}
            className="progress-bar"
          />
          <div
            className="progress-fill"
            style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
          />
        </div>
        <span className="time-total">{formatTime(currentSong.duration)}</span>
      </motion.div>

      <motion.div
        className="player-controls"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className={`control-btn ${shuffleOn ? 'active' : ''}`} onClick={() => setShuffleOn(!shuffleOn)}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 3 21 3 21 8" />
            <path d="M4 20h7a4 4 0 0 0 4-4V4" />
            <polyline points="16 21 21 21 21 16" />
            <path d="M15 4H8a4 4 0 0 0-4 4v12" />
          </svg>
        </button>
        <button className="control-btn" onClick={handlePrev}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <polygon points="5 20 15 12 5 4 5 20" />
          </svg>
        </button>
        <motion.button
          className="play-button"
          onClick={handlePlayPause}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </motion.button>
        <button className="control-btn" onClick={handleNext}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <polygon points="19 4 9 12 19 20 19 4" />
          </svg>
        </button>
        <button className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`} onClick={handleRepeat}>
          {repeatMode === 'one' ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 14v-4" />
              <path d="M18 8v-1a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v11a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-1" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 14v-4" />
              <path d="M18 8v-1a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v11a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-1" />
            </svg>
          )}
        </button>
      </motion.div>

      <motion.div
        className="volume-control"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="volume-slider"
        />
      </motion.div>

      <motion.div
        className="playlist-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="playlist-title">播放列表</h3>
        <div className="playlist-list">
          {mockSongs.map((song, index) => (
            <motion.div
              key={song.id}
              className={`playlist-item ${currentSong.id === song.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentSong(song);
                setCurrentTime(0);
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <img src={song.cover} alt={song.title} className="playlist-cover" />
              <div className="playlist-info">
                <span className="playlist-title-text">{song.title}</span>
                <span className="playlist-artist">{song.artist}</span>
              </div>
              <span className="playlist-duration">{formatTime(song.duration)}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};