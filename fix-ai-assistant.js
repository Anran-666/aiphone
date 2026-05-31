
const fs = require('fs');
const path = require('path');

const code = `import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { aiService } from '../services/aiService';

interface AIAssistantProps {
  onClose: () =&gt; void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '你好！我是智联', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) setInputValue(transcript);
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (userContent: string) => {
    if (!userContent.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userContent.trim(),
      timestamp: new Date()
    }]);
    
    setIsTyping(true);
    setInputValue('');
    
    try {
      const chatMessages = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      chatMessages.push({ role: 'user', content: userContent });
      
      const response = await aiService.chat(chatMessages);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('发送失败:', error);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) sendMessage(inputValue);
  };

  return (
    <motion.div className="ai-assistant" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
      <div className="ai-header">
        <div className="ai-avatar">
          <motion.div className="avatar-inner" animate={{ scale: isTyping ? [1, 1.1, 1] : 1 }} transition={{ repeat: isTyping ? Infinity : 0, duration: 1 }} />
        </div>
        <div className="ai-info">
          <span className="ai-name">智联</span>
          <span className="ai-status">{isTyping ? '思考中...' : '在线'}</span>
        </div>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>

      <div className="ai-messages">
        {messages.map((message) => (
          <motion.div key={message.id} className={message.role === 'user' ? 'message user' : 'message assistant'} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="message-content">{message.content}</div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="message assistant typing">
            <div className="typing-indicator">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-area">
        <motion.button className={isListening ? 'voice-btn listening' : 'voice-btn'} onMouseDown={startListening} onMouseUp={stopListening} whileTap={{ scale: 0.95 }}>
          🎤
        </motion.button>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="输入消息..." className="ai-input" />
        <motion.button className="send-btn" onClick={handleSend} whileTap={{ scale: 0.95 }} disabled={!inputValue.trim()}>
          ➤
        </motion.button>
      </div>
    </motion.div>
  );
};`;

const filePath = path.join(__dirname, 'ai-phone-app', 'src', 'components', 'AIAssistant.tsx');
fs.writeFileSync(filePath, code, 'utf8');
console.log('File written successfully at:', filePath);
