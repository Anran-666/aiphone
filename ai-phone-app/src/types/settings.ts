export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface AppSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    dailyReminder: boolean;
    reminderTime: string;
  };
  display: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    autoBrightness: boolean;
    brightness: number;
  };
  privacy: {
    locationEnabled: boolean;
    activityStatus: boolean;
  };
  profile: UserProfile;
}

export const defaultSettings: AppSettings = {
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    dailyReminder: false,
    reminderTime: '09:00',
  },
  display: {
    darkMode: true,
    fontSize: 'medium',
    autoBrightness: false,
    brightness: 80,
  },
  privacy: {
    locationEnabled: true,
    activityStatus: true,
  },
  profile: {
    name: '用户',
    phone: '138****8888',
    email: 'user@example.com',
    avatar: '👤',
  },
};
