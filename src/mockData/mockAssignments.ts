// src/mockData/mockAssignments.ts
import { Assignment } from '@/redux/slices/assignmentManagementSlice';

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Bài tập về Vòng lặp',
    course: 'Lập Trình C',
    chapter: 'Vòng lặp',
    deadline: '2025-07-25',
    description: 'Triển khai các thuật toán sử dụng vòng lặp for, while và do-while. Hoàn thành các bài tập trong file đính kèm.',
    materials: [
      { name: 'baitap_vonglap.pdf', url: '/materials/baitap_vonglap.pdf' },
      { name: 'huongdan_vonglap.pdf', url: '/materials/huongdan_vonglap.pdf' }
    ],
    isCompleted: false
  },
  {
    id: '2',
    title: 'Bài tập về Mảng và Con trỏ',
    course: 'Lập Trình C',
    chapter: 'Mảng & Chuỗi',
    deadline: '2025-07-28',
    description: 'Thực hành các thao tác với mảng một chiều, mảng hai chiều và chuỗi ký tự. Tìm hiểu mối quan hệ giữa mảng và con trỏ trong C.',
    materials: [
      { name: 'baitap_mang.pdf', url: '/materials/baitap_mang.pdf' }
    ],
    isCompleted: false
  },
  {
    id: '3',
    title: 'Bài tập về Kiểu dữ liệu',
    course: 'Lập Trình C',
    chapter: 'Biến & Kiểu dữ liệu',
    deadline: '2025-07-22',
    description: 'Tìm hiểu về các kiểu dữ liệu cơ bản trong C: int, float, double, char. Thực hành chuyển đổi giữa các kiểu dữ liệu.',
    materials: [
      { name: 'baitap_kieudulieu.pdf', url: '/materials/baitap_kieudulieu.pdf' },
      { name: 'thamkhao_kieudulieu.pdf', url: '/materials/thamkhao_kieudulieu.pdf' }
    ],
    isCompleted: false
  },
  {
    id: '4',
    title: 'Giới thiệu về ngôn ngữ C',
    course: 'Lập Trình C',
    chapter: 'Giới thiệu C',
    deadline: '2025-07-10',
    description: 'Tìm hiểu tổng quan về ngôn ngữ lập trình C, lịch sử phát triển và các ứng dụng. Cài đặt môi trường phát triển và viết chương trình C đầu tiên.',
    materials: [
      { name: 'gioithieu_c.pdf', url: '/materials/gioithieu_c.pdf' }
    ],
    score: 9,
    isCompleted: true
  },
  {
    id: '5',
    title: 'Bài tập về Câu điều kiện',
    course: 'Lập Trình C',
    chapter: 'Câu lệnh điều kiện',
    deadline: '2025-07-15',
    description: 'Thực hành sử dụng các câu lệnh điều kiện if, if-else, switch-case để giải quyết các bài toán đơn giản.',
    materials: [
      { name: 'baitap_dieukien.pdf', url: '/materials/baitap_dieukien.pdf' }
    ],
    score: 8,
    isCompleted: true
  },
  {
    id: '6',
    title: 'Bài tập về Hàm',
    course: 'Lập Trình C',
    chapter: 'Hàm',
    deadline: '2025-08-05',
    description: 'Thực hành định nghĩa và sử dụng hàm trong C. Tìm hiểu về tham số, đối số, giá trị trả về và phạm vi biến.',
    materials: [
      { name: 'baitap_ham.pdf', url: '/materials/baitap_ham.pdf' }
    ],
    isCompleted: false
  },
  {
    id: '7',
    title: 'Bài tập về Cấu trúc dữ liệu',
    course: 'Lập Trình C',
    chapter: 'Cấu trúc & Union',
    deadline: '2025-08-12',
    description: 'Thực hành sử dụng struct và union để tạo các cấu trúc dữ liệu tùy chỉnh. Xây dựng chương trình quản lý thông tin sinh viên.',
    materials: [
      { name: 'baitap_struct.pdf', url: '/materials/baitap_struct.pdf' }
    ],
    isCompleted: false
  },
  {
    id: '8',
    title: 'Bài tập về File',
    course: 'Lập Trình C',
    chapter: 'Thao tác File',
    deadline: '2025-08-20',
    description: 'Thực hành đọc và ghi file trong C. Xây dựng chương trình quản lý dữ liệu sử dụng file văn bản và file nhị phân.',
    materials: [
      { name: 'baitap_file.pdf', url: '/materials/baitap_file.pdf' }
    ],
    isCompleted: false
  },
  {
    id: '9',
    title: 'Bài tập về Đệ quy',
    course: 'Lập Trình C',
    chapter: 'Đệ quy',
    deadline: '2025-07-05',
    description: 'Tìm hiểu về đệ quy và ứng dụng trong giải quyết các bài toán. Thực hành viết hàm đệ quy và phân tích hiệu suất.',
    materials: [
      { name: 'baitap_dequy.pdf', url: '/materials/baitap_dequy.pdf' }
    ],
    score: 7,
    isCompleted: true
  },
  {
    id: '10',
    title: 'Bài tập về Tiền xử lý',
    course: 'Lập Trình C',
    chapter: 'Tiền xử lý',
    deadline: '2025-06-30',
    description: 'Tìm hiểu về các chỉ thị tiền xử lý trong C: #include, #define, #ifdef, #ifndef. Thực hành sử dụng macro và biên dịch có điều kiện.',
    materials: [
      { name: 'baitap_tienxuly.pdf', url: '/materials/baitap_tienxuly.pdf' }
    ],
    score: 9.5,
    isCompleted: true
  }
];

// Hàm mô phỏng API để lấy danh sách bài tập
export const fetchMockAssignments = (): Promise<Assignment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssignments);
    }, 800); // Giả lập độ trễ mạng
  });
};

// Hàm mô phỏng API để lấy chi tiết bài tập
export const fetchMockAssignmentDetail = (id: string): Promise<Assignment | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const assignment = mockAssignments.find(a => a.id === id);
      if (assignment) {
        resolve(assignment);
      } else {
        reject(new Error('Không tìm thấy bài tập'));
      }
    }, 500);
  });
};

// Hàm mô phỏng API để nộp bài tập
export const submitMockAssignment = (id: string, formData: FormData): Promise<{ id: string; success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Đã nộp bài tập ${id} với dữ liệu:`, formData);
      resolve({ id, success: true });
    }, 1000);
  });
};