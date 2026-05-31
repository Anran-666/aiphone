export type PhoneMode = 'folded' | 'unfolded' | 'hover';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GestureEvent {
  type: 'swipe' | 'tap' | 'longPress' | 'pinch';
  direction?: 'up' | 'down' | 'left' | 'right';
  position?: { x: number; y: number };
}

export interface AppState {
  phoneMode: PhoneMode;
  currentScreen: 'home' | 'ai-assistant' | 'camera' | 'settings';
  isWakeUp: boolean;
  messages: Message[];
}
