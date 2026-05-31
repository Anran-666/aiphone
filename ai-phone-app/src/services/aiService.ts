
interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

export class AIService {
  private config: AIConfig = {
    apiKey: 'sk-5575ff5443b442ec9c368288547df318', // DeepSeek API Key
    baseUrl: 'https://api.deepseek.com/v1', // DeepSeek API地址
    model: 'deepseek-chat' // DeepSeek模型
  };

  private systemPrompt = `你是智联（ZhiLian），AI Phone的智能助手。
你的特点：
1. 友好、聪明、善解人意
2. 擅长处理日程、天气、导航等日常事务
3. 说话简洁明了，富有亲和力
4. 会主动理解用户的需求并提供帮助`;

  setApiKey(key: string) {
    this.config.apiKey = key;
  }

  async chat(messages: Message[]): Promise<AIResponse> {
    try {
      // 如果没有配置API密钥，使用模拟响应
      if (!this.config.apiKey) {
        return this.getMockResponse(messages[messages.length - 1].content);
      }

      const allMessages = [
        { role: 'system', content: this.systemPrompt },
        ...messages
      ];

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: allMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const data = await response.json();
      console.log('API响应:', data);
      return {
        content: data.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('AI服务错误:', error);
      // 出错时使用模拟响应
      return this.getMockResponse(messages[messages.length - 1].content);
    }
  }

  private getMockResponse(userMessage: string): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    const patterns = [
      {
        keywords: ['天气', '下雨', '晴天', '温度'],
        response: '今天天气晴朗，气温22-28度，紫外线中等。建议带伞防晒哦！'
      },
      {
        keywords: ['会议', '日程', '预约', '安排'],
        response: '好的！我来帮您安排。请告诉我：会议主题、时间和参与人员，我会自动为您设置提醒。'
      },
      {
        keywords: ['导航', '路线', '去', '位置', '地址'],
        response: '已为您规划最佳路线！预计25分钟到达，当前路况良好。需要开启实时导航吗？'
      },
      {
        keywords: ['音乐', '听歌', '播放', '歌单'],
        response: '为您播放精选音乐！已根据您的心情推荐放松歌单。'
      },
      {
        keywords: ['累了', '休息', '困', '疲惫'],
        response: '您看起来有点累了！建议休息15分钟。需要我帮您设置休息提醒吗？我还可以播放舒缓音乐~'
      },
      {
        keywords: ['你好', '早上好', '下午好', '晚上好', '嗨'],
        response: '你好呀！我是智联，很高兴能帮到你。今天想做些什么呢？'
      },
      {
        keywords: ['时间', '几点', '日期', '今天'],
        response: `现在是${new Date().toLocaleTimeString('zh-CN')}，${new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}。`
      },
      {
        keywords: ['拍照', '相机', '照片', '相册'],
        response: '相机已准备好！需要AI自动场景识别吗？我可以帮您识别：人像、夜景、美食、风景等。'
      },
      {
        keywords: ['帮助', '能做什么', '功能'],
        response: '我可以帮您做很多事哦！📱 日程管理 🌤️ 天气查询 🗺️ 智能导航 🎵 音乐推荐 📷 AI拍照... 还有更多功能等你探索！'
      }
    ];

    // 尝试数学计算 - 支持各种格式
    // 提取数字和运算符
    const mathExpression = userMessage.replace(/[^0-9+\-*/.]/g, '');
    if (mathExpression.length > 0 && /[+\-*/]/.test(mathExpression)) {
      try {
        const result = eval(mathExpression);
        return { content: `${mathExpression} = ${result}`, success: true };
      } catch {
        // 计算失败，继续匹配其他模式
      }
    }

    for (const pattern of patterns) {
      if (pattern.keywords.some(kw => lowerMessage.includes(kw))) {
        return { content: pattern.response, success: true };
      }
    }

    return { 
      content: '好的，我明白了！让我想想怎么帮你...', 
      success: true 
    };
  }
}

export const aiService = new AIService();
