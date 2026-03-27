/**
 * 学习搭子 - 自定义类型定义
 * 
 * 定义三种课堂生成模式的类型接口
 */

// 错题数据项
export interface ErrorItem {
  questionId: string;
  questionContent: string;
  studentAnswer: string;
  correctAnswer: string;
  errorType: 'concept' | 'calculation' | 'logic' | 'careless';
  knowledgePoint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 教材数据
export interface MaterialData {
  documentUrl: string;
  documentType: 'pdf' | 'image' | 'docx';
  subject: string;
  grade: string;
  chapter?: string;
}

// 学习搭子请求
export interface LearningBuddyRequest {
  mode: 'error_driven' | 'material_driven' | 'free';
  studentId: string;
  subject: string;
  grade: string;
  errorData?: {
    errors: ErrorItem[];
    totalCount: number;
    correctRate: number;
  };
  materialData?: MaterialData;
  requirement?: string;
}

// OpenMAIC课堂生成请求
export interface OpenMAICClassroomRequest {
  topic: string;
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // 分钟
  objectives: string[];
  prerequisites?: string[];
  content?: string;
}

// 课堂配置
export interface ClassroomConfig {
  id: string;
  studentId: string;
  mode: 'error_driven' | 'material_driven' | 'free';
  
  // 错题驱动模式配置
  errorThreshold?: number; // 错题数阈值
  errorRateThreshold?: number; // 错误率阈值
  autoTrigger?: boolean; // 自动触发
  
  // 上课频次
  frequency: 'daily' | 'weekly';
  
  // 课堂时长（分钟）
  duration: number;
  
  // 适用学科
  subjects: string[];
  
  // 创建时间
  createdAt: string;
  updatedAt: string;
}

// API响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
