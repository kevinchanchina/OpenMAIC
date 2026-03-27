/**
 * 学习搭子 - API适配器
 * 
 * 对接"学习搭子"后端API，获取错题数据、教材数据、学员信息等
 */

import { LearningBuddyRequest, ApiResponse, ClassroomConfig } from './types';
import config from './config';

const LEARNING_BUDDY_API = config.learningBuddy.apiUrl;
const TIMEOUT = config.learningBuddy.timeout;

/**
 * 通用请求方法
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${LEARNING_BUDDY_API}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, error: '请求超时' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: '未知错误' };
  }
}

/**
 * 获取学员错题数据
 */
export async function getStudentErrors(
  studentId: string,
  subject: string
): Promise<ApiResponse<{
  errors: LearningBuddyRequest['errorData']['errors'];
  totalCount: number;
  correctRate: number;
}>> {
  return request(`/api/students/${studentId}/errors?subject=${subject}`);
}

/**
 * 获取学员课堂配置
 */
export async function getClassroomConfig(
  studentId: string
): Promise<ApiResponse<ClassroomConfig>> {
  return request(`/api/classroom/config?studentId=${studentId}`);
}

/**
 * 更新学员课堂配置
 */
export async function updateClassroomConfig(
  studentId: string,
  configData: Partial<ClassroomConfig>
): Promise<ApiResponse<ClassroomConfig>> {
  return request(`/api/classroom/config`, {
    method: 'PUT',
    body: JSON.stringify({ studentId, ...configData }),
  });
}

/**
 * 获取教材内容
 */
export async function getMaterialContent(
  documentUrl: string
): Promise<ApiResponse<{ content: string; metadata: Record<string, unknown> }>> {
  return request(`/api/materials/content?url=${encodeURIComponent(documentUrl)}`);
}

/**
 * 发送课堂生成请求到学习搭子后端
 */
export async function requestClassroomGeneration(
  request: LearningBuddyRequest
): Promise<ApiResponse<{ classroomId: string; status: string }>> {
  return request('/api/classroom/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export default {
  getStudentErrors,
  getClassroomConfig,
  updateClassroomConfig,
  getMaterialContent,
  requestClassroomGeneration,
};
