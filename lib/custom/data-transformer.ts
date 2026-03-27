/**
 * 学习搭子 - 数据转换器
 * 
 * 将"学习搭子"的数据格式转换为OpenMAIC课堂生成格式
 */

import { 
  LearningBuddyRequest, 
  OpenMAICClassroomRequest,
  ErrorItem 
} from './types';

/**
 * 将错题数据转换为OpenMAIC课堂请求
 */
export function transformErrorDrivenData(
  request: LearningBuddyRequest
): OpenMAICClassroomRequest {
  const { errorData, subject, grade } = request;
  
  if (!errorData || errorData.errors.length === 0) {
    throw new Error('错题数据为空，无法生成课堂');
  }
  
  // 分析错题，提取核心知识点
  const knowledgePoints = extractKnowledgePoints(errorData.errors);
  
  // 确定难度（根据错题难度分布）
  const difficulty = determineDifficulty(errorData.errors);
  
  // 生成课堂主题
  const topic = generateTopic(knowledgePoints, subject);
  
  // 生成学习目标
  const objectives = generateObjectives(errorData.errors, knowledgePoints);
  
  // 生成前置知识
  const prerequisites = generatePrerequisites(knowledgePoints);
  
  return {
    topic,
    subject: getSubjectName(subject),
    grade: getGradeName(grade),
    difficulty,
    duration: 30, // 默认30分钟
    objectives,
    prerequisites,
    content: generateContent(errorData.errors),
  };
}

/**
 * 将教材数据转换为OpenMAIC课堂请求
 */
export function transformMaterialDrivenData(
  request: LearningBuddyRequest
): OpenMAICClassroomRequest {
  const { materialData, subject, grade } = request;
  
  if (!materialData) {
    throw new Error('教材数据为空，无法生成课堂');
  }
  
  const topic = materialData.chapter 
    ? `${getSubjectName(subject)} - ${materialData.chapter}`
    : `${getSubjectName(subject)} - 新课讲解`;
  
  return {
    topic,
    subject: getSubjectName(subject),
    grade: getGradeName(grade),
    difficulty: 'medium',
    duration: 40, // 教材驱动默认40分钟
    objectives: [
      '理解本节课的核心概念',
      '掌握关键知识点',
      '能够应用所学知识解决问题',
    ],
    content: `教材来源: ${materialData.documentUrl}`,
  };
}

/**
 * 将自由模式需求转换为OpenMAIC课堂请求
 */
export function transformFreeModeData(
  request: LearningBuddyRequest
): OpenMAICClassroomRequest {
  const { requirement, subject, grade } = request;
  
  if (!requirement) {
    throw new Error('需求描述为空，无法生成课堂');
  }
  
  return {
    topic: extractTopic(requirement),
    subject: getSubjectName(subject),
    grade: getGradeName(grade),
    difficulty: 'medium',
    duration: 30,
    objectives: extractObjectives(requirement),
    content: requirement,
  };
}

/**
 * 根据模式自动选择转换方法
 */
export function transformToOpenMAIC(
  request: LearningBuddyRequest
): OpenMAICClassroomRequest {
  switch (request.mode) {
    case 'error_driven':
      return transformErrorDrivenData(request);
    case 'material_driven':
      return transformMaterialDrivenData(request);
    case 'free':
      return transformFreeModeData(request);
    default:
      throw new Error(`未知的课堂生成模式: ${request.mode}`);
  }
}

// ============ 辅助函数 ============

function extractKnowledgePoints(errors: ErrorItem[]): string[] {
  const points = new Set<string>();
  errors.forEach(error => {
    if (error.knowledgePoint) {
      points.add(error.knowledgePoint);
    }
  });
  return Array.from(points);
}

function determineDifficulty(errors: ErrorItem[]): 'easy' | 'medium' | 'hard' {
  const difficultyCount = { easy: 0, medium: 0, hard: 0 };
  errors.forEach(error => {
    difficultyCount[error.difficulty]++;
  });
  
  const max = Math.max(difficultyCount.easy, difficultyCount.medium, difficultyCount.hard);
  if (max === difficultyCount.hard) return 'hard';
  if (max === difficultyCount.medium) return 'medium';
  return 'easy';
}

function generateTopic(knowledgePoints: string[], subject: string): string {
  const subjectName = getSubjectName(subject);
  if (knowledgePoints.length === 0) {
    return `${subjectName}错题精讲`;
  }
  if (knowledgePoints.length === 1) {
    return `${subjectName} - ${knowledgePoints[0]}`;
  }
  return `${subjectName} - ${knowledgePoints.slice(0, 2).join('、')}等知识点精讲`;
}

function generateObjectives(errors: ErrorItem[], knowledgePoints: string[]): string[] {
  const objectives: string[] = [];
  
  // 根据错因生成目标
  const errorTypes = new Set(errors.map(e => e.errorType));
  
  if (errorTypes.has('concept')) {
    objectives.push('理解并掌握相关概念的定义和内涵');
  }
  if (errorTypes.has('calculation')) {
    objectives.push('提高计算准确性，掌握计算技巧');
  }
  if (errorTypes.has('logic')) {
    objectives.push('理清解题思路，掌握正确的分析方法');
  }
  if (errorTypes.has('careless')) {
    objectives.push('培养细心审题、规范答题的习惯');
  }
  
  // 添加知识点目标
  if (knowledgePoints.length > 0) {
    objectives.push(`掌握${knowledgePoints.slice(0, 3).join('、')}等知识点`);
  }
  
  return objectives.length > 0 ? objectives : ['掌握本节课的核心知识点'];
}

function generatePrerequisites(knowledgePoints: string[]): string[] {
  // 根据知识点生成前置知识（简化版本）
  return knowledgePoints.slice(0, 2).map(p => `已学习${p}的基础知识`);
}

function generateContent(errors: ErrorItem[]): string {
  const errorSummary = errors.slice(0, 5).map((e, i) => 
    `\n${i + 1}. ${e.questionContent.substring(0, 50)}... (错因: ${getErrorTypeName(e.errorType)})`
  ).join('');
  
  return `本节课针对以下错题进行讲解：${errorSummary}\n\n共${errors.length}道错题需要讲解。`;
}

function getSubjectName(subjectId: string): string {
  const subjectMap: Record<string, string> = {
    math: '数学',
    chinese: '语文',
    english: '英语',
    physics: '物理',
    chemistry: '化学',
    biology: '生物',
    history: '历史',
    geography: '地理',
    politics: '道法',
  };
  return subjectMap[subjectId] || subjectId;
}

function getGradeName(gradeId: string): string {
  const gradeNum = parseInt(gradeId);
  if (gradeNum >= 1 && gradeNum <= 6) {
    return `小学${gradeId}年级`;
  } else if (gradeNum >= 7 && gradeNum <= 9) {
    return `初中${gradeNum - 6}年级`;
  } else if (gradeNum >= 10 && gradeNum <= 12) {
    return `高中${gradeNum - 9}年级`;
  }
  return gradeId;
}

function getErrorTypeName(errorType: string): string {
  const errorTypeMap: Record<string, string> = {
    concept: '概念错误',
    calculation: '计算错误',
    logic: '思路错误',
    careless: '粗心',
  };
  return errorTypeMap[errorType] || errorType;
}

function extractTopic(requirement: string): string {
  // 简单提取主题（取前30个字符）
  return requirement.substring(0, 30) + (requirement.length > 30 ? '...' : '');
}

function extractObjectives(requirement: string): string[] {
  // 从需求中提取目标（简化版本）
  return [
    '理解本节课的核心概念',
    '掌握关键知识点',
    '能够应用所学知识解决问题',
  ];
}

export default {
  transformToOpenMAIC,
  transformErrorDrivenData,
  transformMaterialDrivenData,
  transformFreeModeData,
};
