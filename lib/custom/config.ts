/**
 * 学习搭子 - 自定义配置
 * 
 * 配置"学习搭子"后端API地址、端口、超时等参数
 */

export const config = {
  // 学习搭子后端API配置
  learningBuddy: {
    apiUrl: process.env.LEARNING_BUDDY_API_URL || 'http://localhost:8060',
    timeout: 30000, // 30秒超时
    retries: 3,
  },

  // OpenMAIC配置
  openmaic: {
    apiUrl: process.env.OPENMAIC_URL || 'http://localhost:3060',
    timeout: 60000, // 60秒超时（课堂生成可能较慢）
  },

  // 课堂生成模式配置
  classroom: {
    // 默认课堂时长（分钟）
    defaultDuration: 30,
    
    // 错题驱动模式默认配置
    errorDriven: {
      errorThreshold: 3, // 错题数阈值
      errorRateThreshold: 0.3, // 错误率阈值 30%
      autoTrigger: true, // 自动触发
      frequency: 'daily' as const, // 每日模式
    },
    
    // 教材驱动模式默认配置
    materialDriven: {
      studentUploadEnabled: false, // 学员上传权限（默认关闭）
    },
    
    // 自由模式默认配置
    free: {
      maxRequirementLength: 500, // 需求描述最大长度
    },
  },

  // 学科配置
  subjects: [
    { id: 'math', name: '数学', gradeRange: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { id: 'chinese', name: '语文', gradeRange: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { id: 'english', name: '英语', gradeRange: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { id: 'physics', name: '物理', gradeRange: ['8', '9', '10', '11', '12'] },
    { id: 'chemistry', name: '化学', gradeRange: ['9', '10', '11', '12'] },
    { id: 'biology', name: '生物', gradeRange: ['7', '8', '10', '11'] },
    { id: 'history', name: '历史', gradeRange: ['7', '8', '9', '10', '11', '12'] },
    { id: 'geography', name: '地理', gradeRange: ['7', '8', '10', '11'] },
    { id: 'politics', name: '道法', gradeRange: ['7', '8', '9', '10', '11', '12'] },
  ],

  // 年级配置
  grades: {
    primary: ['1', '2', '3', '4', '5', '6'],
    middle: ['7', '8', '9'],
    high: ['10', '11', '12'],
  },
};

export default config;
