// src/mockData/mockLearningPath.ts

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  isCompleted: boolean;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
  contentUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  completedModules: number;
  totalModules: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in weeks
  icon: 'book' | 'layers' | 'code' | 'school';
  category: string;
  instructor: string;
  rating: number;
  enrolledStudents: number;
  language: string;
  lastUpdated: string;
  modules: Module[];
  prerequisites?: string[];
  skills?: string[];
  isEnrolled: boolean;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Nhập môn Lập trình',
    description: 'Học các kiến thức cơ bản về lập trình với JavaScript',
    completedModules: 6,
    totalModules: 8,
    level: 'Beginner',
    duration: 4,
    icon: 'code',
    category: 'Lập trình',
    instructor: 'Nguyễn Văn A',
    rating: 4.7,
    enrolledStudents: 1250,
    language: 'Tiếng Việt',
    lastUpdated: '2024-06-15',
    isEnrolled: true,
    modules: [
      {
        id: '1-1',
        title: 'Giới thiệu về lập trình',
        description: 'Tìm hiểu về lập trình và các khái niệm cơ bản',
        duration: 45,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/1/modules/1'
      },
      {
        id: '1-2',
        title: 'Biến và kiểu dữ liệu',
        description: 'Học cách khai báo biến và các kiểu dữ liệu cơ bản',
        duration: 60,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/1/modules/2'
      },
      {
        id: '1-3',
        title: 'Cấu trúc điều khiển',
        description: 'Tìm hiểu về các cấu trúc điều khiển: if, else, switch',
        duration: 75,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/1/modules/3'
      },
      {
        id: '1-4',
        title: 'Vòng lặp',
        description: 'Học cách sử dụng vòng lặp for, while, do-while',
        duration: 90,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/1/modules/4'
      },
      {
        id: '1-5',
        title: 'Hàm',
        description: 'Tìm hiểu về hàm và cách sử dụng hàm trong lập trình',
        duration: 60,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/1/modules/5'
      },
      {
        id: '1-6',
        title: 'Mảng',
        description: 'Học cách sử dụng mảng để lưu trữ nhiều giá trị',
        duration: 75,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/1/modules/6'
      },
      {
        id: '1-7',
        title: 'Đối tượng',
        description: 'Tìm hiểu về đối tượng và lập trình hướng đối tượng cơ bản',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/1/modules/7'
      },
      {
        id: '1-8',
        title: 'Bài tập tổng hợp',
        description: 'Thực hành tất cả các kiến thức đã học',
        duration: 120,
        isCompleted: false,
        type: 'assignment',
        contentUrl: '/courses/1/modules/8'
      }
    ],
    prerequisites: ['Không yêu cầu kiến thức nền tảng'],
    skills: ['JavaScript cơ bản', 'Tư duy lập trình', 'Giải quyết vấn đề']
  },
  {
    id: '2',
    title: 'Phát triển Web Cơ bản',
    description: 'HTML, CSS và JavaScript để xây dựng trang web',
    completedModules: 4,
    totalModules: 10,
    level: 'Intermediate',
    duration: 6,
    icon: 'book',
    category: 'Phát triển Web',
    instructor: 'Trần Thị B',
    rating: 4.5,
    enrolledStudents: 980,
    language: 'Tiếng Việt',
    lastUpdated: '2024-05-20',
    isEnrolled: true,
    modules: [
      {
        id: '2-1',
        title: 'Giới thiệu về phát triển web',
        description: 'Tìm hiểu về cách hoạt động của web và các công nghệ liên quan',
        duration: 60,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/2/modules/1'
      },
      {
        id: '2-2',
        title: 'HTML cơ bản',
        description: 'Học cách sử dụng HTML để tạo cấu trúc trang web',
        duration: 90,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/2/modules/2'
      },
      {
        id: '2-3',
        title: 'CSS cơ bản',
        description: 'Tìm hiểu về CSS để tạo kiểu cho trang web',
        duration: 90,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/2/modules/3'
      },
      {
        id: '2-4',
        title: 'JavaScript cơ bản',
        description: 'Học cách sử dụng JavaScript để tạo tương tác cho trang web',
        duration: 120,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/2/modules/4'
      },
      {
        id: '2-5',
        title: 'Responsive Web Design',
        description: 'Tìm hiểu cách tạo trang web hiển thị tốt trên mọi thiết bị',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/2/modules/5'
      },
      {
        id: '2-6',
        title: 'Flexbox và Grid',
        description: 'Học cách sử dụng Flexbox và Grid để bố trí trang web',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/2/modules/6'
      },
      {
        id: '2-7',
        title: 'DOM Manipulation',
        description: 'Tìm hiểu cách thao tác với DOM bằng JavaScript',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/2/modules/7'
      },
      {
        id: '2-8',
        title: 'Xử lý sự kiện',
        description: 'Học cách xử lý sự kiện người dùng trên trang web',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/2/modules/8'
      },
      {
        id: '2-9',
        title: 'Gọi API',
        description: 'Tìm hiểu cách gọi API từ trang web',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/2/modules/9'
      },
      {
        id: '2-10',
        title: 'Dự án cuối khóa',
        description: 'Xây dựng một trang web hoàn chỉnh',
        duration: 180,
        isCompleted: false,
        type: 'assignment',
        contentUrl: '/courses/2/modules/10'
      }
    ],
    prerequisites: ['Kiến thức cơ bản về lập trình'],
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
  },
  {
    id: '3',
    title: 'Phát triển React Nâng cao',
    description: 'Xây dựng ứng dụng phức tạp với React và Redux',
    completedModules: 1,
    totalModules: 12,
    level: 'Advanced',
    duration: 8,
    icon: 'layers',
    category: 'Phát triển Web',
    instructor: 'Lê Văn C',
    rating: 4.8,
    enrolledStudents: 750,
    language: 'Tiếng Việt',
    lastUpdated: '2024-06-01',
    isEnrolled: true,
    modules: [
      {
        id: '3-1',
        title: 'Giới thiệu về React',
        description: 'Tìm hiểu về React và cách hoạt động của nó',
        duration: 60,
        isCompleted: true,
        type: 'video',
        contentUrl: '/courses/3/modules/1'
      },
      {
        id: '3-2',
        title: 'Components và Props',
        description: 'Học cách tạo và sử dụng components trong React',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/2'
      },
      {
        id: '3-3',
        title: 'State và Lifecycle',
        description: 'Tìm hiểu về state và vòng đời của component',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/3'
      },
      {
        id: '3-4',
        title: 'Xử lý sự kiện',
        description: 'Học cách xử lý sự kiện trong React',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/4'
      },
      {
        id: '3-5',
        title: 'Conditional Rendering',
        description: 'Tìm hiểu cách render có điều kiện trong React',
        duration: 45,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/5'
      },
      {
        id: '3-6',
        title: 'Lists và Keys',
        description: 'Học cách render danh sách trong React',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/6'
      },
      {
        id: '3-7',
        title: 'Forms',
        description: 'Tìm hiểu cách xử lý forms trong React',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/7'
      },
      {
        id: '3-8',
        title: 'React Router',
        description: 'Học cách sử dụng React Router để tạo ứng dụng đa trang',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/8'
      },
      {
        id: '3-9',
        title: 'Redux',
        description: 'Tìm hiểu về Redux và cách quản lý state trong ứng dụng lớn',
        duration: 120,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/9'
      },
      {
        id: '3-10',
        title: 'Redux Middleware',
        description: 'Học cách sử dụng middleware trong Redux',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/10'
      },
      {
        id: '3-11',
        title: 'Testing',
        description: 'Tìm hiểu cách viết test cho ứng dụng React',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/3/modules/11'
      },
      {
        id: '3-12',
        title: 'Dự án cuối khóa',
        description: 'Xây dựng một ứng dụng React hoàn chỉnh với Redux',
        duration: 240,
        isCompleted: false,
        type: 'assignment',
        contentUrl: '/courses/3/modules/12'
      }
    ],
    prerequisites: ['HTML, CSS, JavaScript', 'Kiến thức cơ bản về React'],
    skills: ['React', 'Redux', 'React Router', 'Testing']
  },
  {
    id: '4',
    title: 'Cấu trúc dữ liệu và Giải thuật',
    description: 'Kiến thức thiết yếu cho khoa học máy tính',
    completedModules: 0,
    totalModules: 15,
    level: 'Advanced',
    duration: 10,
    icon: 'school',
    category: 'Khoa học máy tính',
    instructor: 'Phạm Thị D',
    rating: 4.9,
    enrolledStudents: 620,
    language: 'Tiếng Việt',
    lastUpdated: '2024-04-10',
    isEnrolled: true,
    modules: [
      {
        id: '4-1',
        title: 'Giới thiệu về cấu trúc dữ liệu',
        description: 'Tìm hiểu về cấu trúc dữ liệu và tầm quan trọng của nó',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/1'
      },
      {
        id: '4-2',
        title: 'Mảng và Danh sách liên kết',
        description: 'Học về mảng và danh sách liên kết',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/2'
      },
      {
        id: '4-3',
        title: 'Ngăn xếp và Hàng đợi',
        description: 'Tìm hiểu về ngăn xếp và hàng đợi',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/3'
      },
      {
        id: '4-4',
        title: 'Cây',
        description: 'Học về cấu trúc dữ liệu cây',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/4'
      },
      {
        id: '4-5',
        title: 'Đồ thị',
        description: 'Tìm hiểu về cấu trúc dữ liệu đồ thị',
        duration: 120,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/5'
      },
      {
        id: '4-6',
        title: 'Bảng băm',
        description: 'Học về bảng băm và ứng dụng',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/6'
      },
      {
        id: '4-7',
        title: 'Giới thiệu về giải thuật',
        description: 'Tìm hiểu về giải thuật và phân tích độ phức tạp',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/7'
      },
      {
        id: '4-8',
        title: 'Thuật toán sắp xếp',
        description: 'Học về các thuật toán sắp xếp phổ biến',
        duration: 120,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/8'
      },
      {
        id: '4-9',
        title: 'Thuật toán tìm kiếm',
        description: 'Tìm hiểu về các thuật toán tìm kiếm',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/9'
      },
      {
        id: '4-10',
        title: 'Quy hoạch động',
        description: 'Học về kỹ thuật quy hoạch động',
        duration: 120,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/10'
      },
      {
        id: '4-11',
        title: 'Thuật toán tham lam',
        description: 'Tìm hiểu về thuật toán tham lam',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/11'
      },
      {
        id: '4-12',
        title: 'Chia để trị',
        description: 'Học về kỹ thuật chia để trị',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/12'
      },
      {
        id: '4-13',
        title: 'Thuật toán đồ thị',
        description: 'Tìm hiểu về các thuật toán trên đồ thị',
        duration: 120,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/13'
      },
      {
        id: '4-14',
        title: 'Thuật toán xâu',
        description: 'Học về các thuật toán xử lý xâu',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/4/modules/14'
      },
      {
        id: '4-15',
        title: 'Dự án cuối khóa',
        description: 'Giải quyết các bài toán phức tạp sử dụng cấu trúc dữ liệu và giải thuật',
        duration: 180,
        isCompleted: false,
        type: 'assignment',
        contentUrl: '/courses/4/modules/15'
      }
    ],
    prerequisites: ['Kiến thức cơ bản về lập trình', 'Toán rời rạc'],
    skills: ['Cấu trúc dữ liệu', 'Giải thuật', 'Phân tích độ phức tạp', 'Tối ưu hóa']
  },
  {
    id: '5',
    title: 'Machine Learning Cơ bản',
    description: 'Nhập môn về học máy và các thuật toán phổ biến',
    completedModules: 0,
    totalModules: 10,
    level: 'Intermediate',
    duration: 8,
    icon: 'school',
    category: 'Trí tuệ nhân tạo',
    instructor: 'Hoàng Văn E',
    rating: 4.6,
    enrolledStudents: 850,
    language: 'Tiếng Việt',
    lastUpdated: '2024-05-15',
    isEnrolled: false,
    modules: [
      {
        id: '5-1',
        title: 'Giới thiệu về Machine Learning',
        description: 'Tìm hiểu về học máy và các ứng dụng',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/1'
      },
      {
        id: '5-2',
        title: 'Hồi quy tuyến tính',
        description: 'Học về thuật toán hồi quy tuyến tính',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/2'
      },
      {
        id: '5-3',
        title: 'Hồi quy Logistic',
        description: 'Tìm hiểu về thuật toán hồi quy logistic',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/3'
      },
      {
        id: '5-4',
        title: 'Cây quyết định',
        description: 'Học về thuật toán cây quyết định',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/4'
      },
      {
        id: '5-5',
        title: 'Support Vector Machines',
        description: 'Tìm hiểu về SVM',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/5'
      },
      {
        id: '5-6',
        title: 'Clustering',
        description: 'Học về các thuật toán phân cụm',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/6'
      },
      {
        id: '5-7',
        title: 'Giảm chiều dữ liệu',
        description: 'Tìm hiểu về các phương pháp giảm chiều dữ liệu',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/7'
      },
      {
        id: '5-8',
        title: 'Xử lý dữ liệu',
        description: 'Học cách xử lý và chuẩn bị dữ liệu',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/8'
      },
      {
        id: '5-9',
        title: 'Đánh giá mô hình',
        description: 'Tìm hiểu cách đánh giá hiệu suất mô hình',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/5/modules/9'
      },
      {
        id: '5-10',
        title: 'Dự án cuối khóa',
        description: 'Xây dựng một ứng dụng machine learning hoàn chỉnh',
        duration: 180,
        isCompleted: false,
        type: 'assignment',
        contentUrl: '/courses/5/modules/10'
      }
    ],
    prerequisites: ['Kiến thức cơ bản về lập trình Python', 'Đại số tuyến tính', 'Xác suất thống kê'],
    skills: ['Python', 'Numpy', 'Pandas', 'Scikit-learn', 'Machine Learning']
  },
  {
    id: '6',
    title: 'Phát triển ứng dụng di động với React Native',
    description: 'Xây dựng ứng dụng di động đa nền tảng với React Native',
    completedModules: 0,
    totalModules: 12,
    level: 'Intermediate',
    duration: 8,
    icon: 'layers',
    category: 'Phát triển Di động',
    instructor: 'Nguyễn Thị F',
    rating: 4.7,
    enrolledStudents: 720,
    language: 'Tiếng Việt',
    lastUpdated: '2024-06-10',
    isEnrolled: false,
    modules: [
      {
        id: '6-1',
        title: 'Giới thiệu về React Native',
        description: 'Tìm hiểu về React Native và cách hoạt động',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/1'
      },
      {
        id: '6-2',
        title: 'Cài đặt môi trường',
        description: 'Học cách cài đặt môi trường phát triển React Native',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/2'
      },
      {
        id: '6-3',
        title: 'Components cơ bản',
        description: 'Tìm hiểu về các components cơ bản trong React Native',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/3'
      },
      {
        id: '6-4',
        title: 'Styling',
        description: 'Học cách tạo kiểu cho ứng dụng React Native',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/4'
      },
      {
        id: '6-5',
        title: 'Navigation',
        description: 'Tìm hiểu về navigation trong React Native',
        duration: 120,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/5'
      },
      {
        id: '6-6',
        title: 'State Management',
        description: 'Học cách quản lý state trong ứng dụng React Native',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/6'
      },
      {
        id: '6-7',
        title: 'API Integration',
        description: 'Tìm hiểu cách tích hợp API vào ứng dụng',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/7'
      },
      {
        id: '6-8',
        title: 'Lưu trữ dữ liệu',
        description: 'Học cách lưu trữ dữ liệu trong ứng dụng',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/8'
      },
      {
        id: '6-9',
        title: 'Animations',
        description: 'Tìm hiểu về animations trong React Native',
        duration: 90,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/9'
      },
      {
        id: '6-10',
        title: 'Push Notifications',
        description: 'Học cách triển khai push notifications',
        duration: 75,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/10'
      },
      {
        id: '6-11',
        title: 'Testing',
        description: 'Tìm hiểu cách viết test cho ứng dụng React Native',
        duration: 60,
        isCompleted: false,
        type: 'video',
        contentUrl: '/courses/6/modules/11'
      },
      {
        id: '6-12',
        title: 'Dự án cuối khóa',
        description: 'Xây dựng một ứng dụng di động hoàn chỉnh với React Native',
        duration: 180,
        isCompleted: false,
        type: 'assignment',
        contentUrl: '/courses/6/modules/12'
      }
    ],
    prerequisites: ['JavaScript', 'React cơ bản'],
    skills: ['React Native', 'JavaScript', 'Mobile Development', 'API Integration']
  }
];

// Hàm mô phỏng API để lấy tất cả các khóa học
export const fetchAllCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCourses);
    }, 800); // Giả lập độ trễ mạng
  });
};

// Hàm mô phỏng API để lấy các khóa học đang học
export const fetchInProgressCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inProgressCourses = mockCourses.filter(course => 
        course.isEnrolled && course.completedModules > 0 && course.completedModules < course.totalModules
      );
      resolve(inProgressCourses);
    }, 600);
  });
};

// Hàm mô phỏng API để lấy các khóa học được đề xuất
export const fetchRecommendedCourses = (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Khóa học được đề xuất: chưa đăng ký hoặc đã đăng ký nhưng chưa học hoặc hoàn thành ít hơn 30%
      const recommendedCourses = mockCourses.filter(course => 
        !course.isEnrolled || 
        (course.isEnrolled && (
          course.completedModules === 0 || 
          (course.completedModules / course.totalModules) < 0.3
        ))
      );
      resolve(recommendedCourses);
    }, 700);
  });
};

// Hàm mô phỏng API để lấy chi tiết khóa học
export const fetchCourseDetails = (courseId: string): Promise<Course | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = mockCourses.find(c => c.id === courseId);
      if (course) {
        resolve(course);
      } else {
        reject(new Error('Không tìm thấy khóa học'));
      }
    }, 500);
  });
};

// Hàm mô phỏng API để cập nhật tiến độ khóa học
export const updateCourseProgress = (
  courseId: string, 
  moduleId: string
): Promise<{ courseId: string; completedModules: number }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const courseIndex = mockCourses.findIndex(c => c.id === courseId);
      
      if (courseIndex === -1) {
        reject(new Error('Không tìm thấy khóa học'));
        return;
      }
      
      const course = { ...mockCourses[courseIndex] };
      const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
      
      if (moduleIndex === -1) {
        reject(new Error('Không tìm thấy module'));
        return;
      }
      
      // Đánh dấu module là đã hoàn thành
      course.modules[moduleIndex].isCompleted = true;
      
      // Cập nhật số lượng module đã hoàn thành
      const completedModules = course.modules.filter(m => m.isCompleted).length;
      
      resolve({
        courseId,
        completedModules
      });
    }, 600);
  });
};

// Hàm mô phỏng API để đăng ký khóa học
export const enrollCourse = (courseId: string): Promise<{ success: boolean; courseId: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const courseIndex = mockCourses.findIndex(c => c.id === courseId);
      
      if (courseIndex === -1) {
        reject(new Error('Không tìm thấy khóa học'));
        return;
      }
      
      resolve({
        success: true,
        courseId
      });
    }, 800);
  });
};