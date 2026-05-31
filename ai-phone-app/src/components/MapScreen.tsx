import { useState } from 'react';
import { motion } from 'framer-motion';

interface MapScreenProps {
  onClose: () => void;
}

const mockLocations = [
  { id: '1', name: '中央公园', lat: 39.9042, lng: 116.4074, type: 'park' },
  { id: '2', name: '购物中心', lat: 39.9142, lng: 116.4174, type: 'shopping' },
  { id: '3', name: '地铁站', lat: 39.9092, lng: 116.4124, type: 'transport' },
  { id: '4', name: '餐厅', lat: 39.9192, lng: 116.4024, type: 'food' },
];

const locationIcons: Record<string, string> = {
  park: '🌳',
  shopping: '🏬',
  transport: '🚇',
  food: '🍽️',
};

export const MapScreen: React.FC<MapScreenProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredLocations = mockLocations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="map-screen"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="map-header">
        <button className="back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="search-bar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索地点..."
            className="search-input"
          />
        </div>
      </div>

      <div className="map-view">
        <div className="map-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`grid-cell ${i % 3 === 0 ? 'highlight' : ''}`} />
          ))}
        </div>
        
        <motion.div 
          className="current-location"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="location-pin current">📍</div>
          <span className="location-label">当前位置</span>
        </motion.div>

        {filteredLocations.map((location) => (
          <motion.div
            key={location.id}
            className={`location-marker ${selectedLocation === location.id ? 'selected' : ''}`}
            onClick={() => setSelectedLocation(location.id)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="location-pin">{locationIcons[location.type]}</div>
            <span className="location-label">{location.name}</span>
          </motion.div>
        ))}
      </div>

      {selectedLocation && (
        <motion.div 
          className="location-detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="detail-header">
            <div className="detail-icon">{locationIcons[mockLocations.find(l => l.id === selectedLocation)?.type || 'park']}</div>
            <div className="detail-info">
              <h3>{mockLocations.find(l => l.id === selectedLocation)?.name}</h3>
              <p>📍 北京市朝阳区</p>
            </div>
          </div>
          <div className="detail-actions">
            <button className="action-btn">
              <span>🚗</span>
              <span>导航</span>
            </button>
            <button className="action-btn">
              <span>📞</span>
              <span>电话</span>
            </button>
            <button className="action-btn">
              <span>💾</span>
              <span>收藏</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
