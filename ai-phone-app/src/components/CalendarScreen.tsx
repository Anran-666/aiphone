import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarScreenProps {
  onClose: () => void;
}

export interface Event {
  id: string;
  title: string;
  time: string;
  location: string;
  color: string;
  date: string;
}

const defaultEvents: Event[] = [
  { id: '1', title: '团队会议', time: '09:00 - 10:30', location: '会议室A', color: '#6366f1', date: new Date().toISOString().split('T')[0] },
  { id: '2', title: '午餐约会', time: '12:00 - 13:00', location: '餐厅', color: '#ec4899', date: new Date().toISOString().split('T')[0] },
  { id: '3', title: '产品评审', time: '14:00 - 15:30', location: '会议室B', color: '#10b981', date: new Date().toISOString().split('T')[0] },
  { id: '4', title: '健身', time: '18:00 - 19:00', location: '健身房', color: '#f59e0b', date: new Date().toISOString().split('T')[0] },
];

const colorOptions = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onClose }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', location: '', color: colorOptions[0] });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(defaultEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(defaultEvents));
    }
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.time.trim()) return;
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      time: newEvent.time,
      location: newEvent.location,
      color: newEvent.color,
      date: new Date().toISOString().split('T')[0],
    };
    
    saveEvents([...events, event]);
    setNewEvent({ title: '', time: '', location: '', color: colorOptions[0] });
    setShowAddModal(false);
  };

  const handleEditEvent = () => {
    if (!editingEvent || !editingEvent.title.trim()) return;
    
    const updatedEvents = events.map(e => 
      e.id === editingEvent.id ? editingEvent : e
    );
    saveEvents(updatedEvents);
    setEditingEvent(null);
    setShowEditModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    saveEvents(updatedEvents);
    setSelectedEvent(null);
  };

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('zh-CN', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  const todayDate = today.toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === todayDate);

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  return (
    <motion.div 
      className="calendar-screen"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="calendar-header">
        <button className="back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="calendar-title">
          <h2>日程</h2>
          <p>{dayOfWeek} · {dateStr}</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="calendar-content">
        <div className="day-header">
          <span className="day-label">今日安排</span>
          <span className="event-count">{todayEvents.length} 项</span>
        </div>

        <div className="events-list">
          {todayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className={`event-card ${selectedEvent === event.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="event-time">{event.time}</div>
              <div className="event-content">
                <div className="event-header">
                  <div className="event-color" style={{ background: event.color }} />
                  <h3 className="event-title">{event.title}</h3>
                </div>
                <p className="event-location">📍 {event.location}</p>
              </div>
              <div className="event-arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}

          {todayEvents.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>今日暂无日程安排</p>
              <button className="empty-add-btn" onClick={() => setShowAddModal(true)}>
                添加日程
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedEvent && (
            <motion.div 
              className="event-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {(() => {
                const event = events.find(e => e.id === selectedEvent);
                if (!event) return null;
                return (
                  <>
                    <div className="detail-title">
                      <div className="detail-color" style={{ background: event.color }} />
                      <h2>{event.title}</h2>
                    </div>
                    <div className="detail-info">
                      <div className="info-item">
                        <span className="info-icon">🕐</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="detail-actions">
                      <button className="action-btn primary" onClick={() => handleOpenEdit(event)}>
                        <span>编辑</span>
                      </button>
                      <button className="action-btn secondary" onClick={() => handleDeleteEvent(event.id)}>
                        <span>删除</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>添加日程</h3>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>标题</label>
                  <input 
                    type="text" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="输入日程标题"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>时间</label>
                  <input 
                    type="text" 
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="例如: 09:00 - 10:30"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>地点</label>
                  <input 
                    type="text" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="输入地点"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>颜色标签</label>
                  <div className="color-picker">
                    {colorOptions.map((color) => (
                      <button 
                        key={color}
                        className={`color-option ${newEvent.color === color ? 'selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-btn cancel" onClick={() => setShowAddModal(false)}>取消</button>
                <button className="modal-btn confirm" onClick={handleAddEvent}>添加</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && editingEvent && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>编辑日程</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>标题</label>
                  <input 
                    type="text" 
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="输入日程标题"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>时间</label>
                  <input 
                    type="text" 
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="例如: 09:00 - 10:30"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>地点</label>
                  <input 
                    type="text" 
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="输入地点"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>颜色标签</label>
                  <div className="color-picker">
                    {colorOptions.map((color) => (
                      <button 
                        key={color}
                        className={`color-option ${editingEvent.color === color ? 'selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setEditingEvent({ ...editingEvent, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-btn cancel" onClick={() => setShowEditModal(false)}>取消</button>
                <button className="modal-btn confirm" onClick={handleEditEvent}>保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
