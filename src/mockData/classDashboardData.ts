import { 
  Student, 
  Chapter, 
  CommonError, 
  Assignment, 
  StudentWarning, 
  TopStudent, 
  ClassInfo,
  CourseOption,
  SemesterOption
} from '@/redux/slices/teacherDashboardSlice';

// Define course options
export const courseOptions: CourseOption[] = [
  { id: 'C01', name: 'C Programming - C01', fullName: 'C Programming' },
  { id: 'C02', name: 'C Programming - C02', fullName: 'C Programming' },
  { id: 'J01', name: 'Java Programming - J01', fullName: 'Java Programming' },
  { id: 'P01', name: 'Python - P01', fullName: 'Python' },
  { id: 'W01', name: 'Web Development - W01', fullName: 'Web Development' }
];

// Define semester options
export const semesterOptions: SemesterOption[] = [
  { id: 'SUM2024', name: 'Hè 2024' },
  { id: 'SEM12024', name: 'HK1 2024-2025' },
  { id: 'SEM22023', name: 'HK2 2023-2024' },
  { id: 'SEM12023', name: 'HK1 2023-2024' }
];

// Helper function to generate random status
const getRandomStatus = (): 'đạt chỉ tiêu' | 'nguy hiểm' | 'cần cải thiện' | 'khá' => {
  const statuses: ('đạt chỉ tiêu' | 'nguy hiểm' | 'cần cải thiện' | 'khá')[] = ['đạt chỉ tiêu', 'nguy hiểm', 'cần cải thiện', 'khá'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Helper function to get progress color based on progress value
const getProgressColor = (progress: number): string => {
  if (progress >= 80) return '#4caf50';
  if (progress >= 60) return '#2196f3';
  if (progress >= 40) return '#ff9800';
  return '#f44336';
};

// Generate students for each class
const generateStudents = (classId: string, count: number): Student[] => {
  const students: Student[] = [];

  for (let i = 1; i <= count; i++) {
    const progress = Math.floor(Math.random() * 100);
    const score = Math.floor(Math.random() * 10);
    const status = getRandomStatus();

    students.push({
      mssv: `${classId}${i.toString().padStart(3, '0')}`,
      name: `Sinh viên ${classId}-${i}`,
      progress,
      score,
      status,
      progressColor: getProgressColor(progress),
      active: progress > 50
    });
  }

  return students;
};

// Generate chapters for each class
const generateChapters = (classId: string): Chapter[] => {
  const chapters: Chapter[] = [];

  for (let i = 1; i <= 5; i++) {
    chapters.push({
      id: i,
      name: `Chương ${i}: ${getChapterName(classId, i)}`,
      totalStudents: 5,
      completionRate: Math.floor(Math.random() * 100),
      averageScore: Math.floor(Math.random() * 10),
      studentsCompleted: `${Math.floor(Math.random() * 5)}/5`,
      estimatedTime: Math.floor(Math.random() * 10) + 1
    });
  }

  return chapters;
};

// Helper function to get chapter names based on class
const getChapterName = (classId: string, chapterNumber: number): string => {
  const chapterNames: Record<string, string[]> = {
    'C01': ['Giới thiệu C', 'Biến và kiểu dữ liệu', 'Cấu trúc điều khiển', 'Mảng và con trỏ', 'Hàm và thư viện'],
    'C02': ['Giới thiệu C', 'Biến và kiểu dữ liệu', 'Cấu trúc điều khiển', 'Mảng và con trỏ', 'Hàm và thư viện'],
    'J01': ['Giới thiệu Java', 'Lập trình hướng đối tượng', 'Kế thừa và đa hình', 'Collections', 'Xử lý ngoại lệ'],
    'P01': ['Giới thiệu Python', 'Cấu trúc dữ liệu', 'Hàm và module', 'OOP trong Python', 'Thư viện và framework'],
    'W01': ['HTML cơ bản', 'CSS và Bootstrap', 'JavaScript', 'React', 'Backend với Node.js']
  };

  return chapterNames[classId]?.[chapterNumber - 1] || `Chương ${chapterNumber}`;
};

// Generate common errors for each class
const generateCommonErrors = (classId: string): CommonError[] => {
  const errors: CommonError[] = [];

  const errorTypes: Record<string, string[]> = {
    'C01': ['Lỗi cú pháp', 'Lỗi con trỏ', 'Lỗi memory leak', 'Lỗi biên dịch'],
    'C02': ['Lỗi cú pháp', 'Lỗi con trỏ', 'Lỗi memory leak', 'Lỗi biên dịch'],
    'J01': ['Lỗi NullPointerException', 'Lỗi casting', 'Lỗi thread', 'Lỗi IO'],
    'P01': ['Lỗi indentation', 'Lỗi import', 'Lỗi type', 'Lỗi syntax'],
    'W01': ['Lỗi CSS', 'Lỗi JavaScript', 'Lỗi responsive', 'Lỗi API']
  };

  for (let i = 0; i < 4; i++) {
    errors.push({
      type: errorTypes[classId]?.[i] || `Lỗi ${i + 1}`,
      occurrences: Math.floor(Math.random() * 20) + 5,
      studentsAffected: Math.floor(Math.random() * 5) + 1,
      relatedChapters: `Chương ${Math.floor(Math.random() * 5) + 1}`
    });
  }

  return errors;
};

// Generate assignments for each class
const generateAssignments = (classId: string): Assignment[] => {
  const assignments: Assignment[] = [];
  const statuses: ('sắp hết hạn' | 'sắp tới' | 'đã qua hạn')[] = ['sắp hết hạn', 'sắp tới', 'đã qua hạn'];

  for (let i = 1; i <= 3; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const submitted = `${Math.floor(Math.random() * 5)}/5`;
    const completionRate = parseInt(submitted.split('/')[0]) / 5 * 100;

    assignments.push({
      name: `Bài tập ${i} - ${classId}`,
      deadline: `${Math.floor(Math.random() * 30) + 1}/0${Math.floor(Math.random() * 3) + 7}/2024`,
      submitted,
      completionRate,
      status
    });
  }

  return assignments;
};

// Generate warnings for each class
const generateWarnings = (classId: string): StudentWarning[] => {
  const warnings: StudentWarning[] = [];
  const priorities: ('khẩn cấp' | 'cảnh báo' | 'thông tin')[] = ['khẩn cấp', 'cảnh báo', 'thông tin'];
  const issues = [
    'Không hoàn thành bài tập',
    'Điểm thấp',
    'Tiến độ chậm',
    'Vắng mặt nhiều buổi'
  ];

  for (let i = 1; i <= 3; i++) {
    const progress = Math.floor(Math.random() * 40);
    const score = Math.floor(Math.random() * 5);

    warnings.push({
      mssv: `${classId}${i.toString().padStart(3, '0')}`,
      name: `Sinh viên ${classId}-${i}`,
      score,
      progress,
      issue: issues[Math.floor(Math.random() * issues.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)]
    });
  }

  return warnings;
};

// Generate top students for each class
const generateTopStudents = (classId: string): TopStudent[] => {
  const topStudents: TopStudent[] = [];

  for (let i = 1; i <= 3; i++) {
    const progress = Math.floor(Math.random() * 30) + 70;
    const score = Math.floor(Math.random() * 3) + 7;

    topStudents.push({
      mssv: `${classId}${i.toString().padStart(3, '0')}`,
      name: `Sinh viên ${classId}-${i}`,
      score,
      progress
    });
  }

  return topStudents;
};

// Generate class info for each class
const generateClassInfo = (classId: string, semesterId: string): ClassInfo => {
  const courseOption = courseOptions.find(course => course.id === classId);
  const semesterOption = semesterOptions.find(semester => semester.id === semesterId);

  return {
    id: classId,
    name: courseOption?.name || '',
    semester: semesterOption?.name || '',
    totalStudents: 5,
    activityRate: Math.floor(Math.random() * 50) + 50,
    averageScore: Math.floor(Math.random() * 3) + 6,
    overallProgress: Math.floor(Math.random() * 40) + 60,
    instructor: {
      name: `Giảng viên ${classId}`,
      title: 'ThS.'
    },
    assistant: Math.random() > 0.5 ? {
      name: `Trợ giảng ${classId}`,
      title: 'KS.'
    } : undefined
  };
};

// Generate dashboard data for a specific class and semester
export const generateDashboardData = (classId: string, semesterId: string) => {
  return {
    students: generateStudents(classId, 5),
    chapters: generateChapters(classId),
    commonErrors: generateCommonErrors(classId),
    assignments: generateAssignments(classId),
    warnings: generateWarnings(classId),
    topStudents: generateTopStudents(classId),
    classInfo: generateClassInfo(classId, semesterId)
  };
};