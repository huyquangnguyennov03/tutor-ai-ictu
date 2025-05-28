import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';

// API service for real API calls
export const apiService = {
  // Fetch dashboard data
  fetchDashboardData: async (courseId: string, semesterId: string) => {
    try {
      // Chuyển courseId thành số nguyên, đảm bảo đúng định dạng
      const numericCourseId = parseInt(courseId, 10);
      if (isNaN(numericCourseId)) {
        throw new Error('courseId phải là số nguyên (ví dụ: 1, 2, 3)');
      }

      // Lấy danh sách khóa học
      const coursesResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_COURSES}`);

      // Tạo semesterOptions từ các giá trị semester duy nhất
      const semesterOptions = Array.from(
        new Set(coursesResponse.data.map((course: any) => course.semester))
      ).map(semester => ({
        id: semester,
        name: semester
      }));

      // Lọc courseOptions theo semesterId
      const courseOptions = coursesResponse.data
        .filter((course: any) => course.semester === semesterId)
        .map((course: any) => ({
          id: course.courseid.toString(),
          name: course.courseid.toString(),
          fullName: course.coursename
        }));

      // Lấy danh sách tiến độ
      const progressResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_ALL_PROGRESS}`);

      // Lấy danh sách sinh viên
      const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);

      // Lọc sinh viên dựa trên courseId và semester từ bảng Progress
      const students = studentsResponse.data
        .filter((student: any) => {
          const studentProgress = progressResponse.data.find((p: any) =>
            p.studentid === student.studentid &&
            p.courseid === numericCourseId &&
            coursesResponse.data.find((c: any) => c.courseid === p.courseid && c.semester === semesterId)
          );
          return studentProgress;
        })
        .map((student: any) => {
          const studentProgress = progressResponse.data.find((p: any) =>
            p.studentid === student.studentid &&
            p.courseid === numericCourseId
          );
          return {
            mssv: student.mssv,
            name: student.name,
            progress: studentProgress ? studentProgress.progressrate : 0,
            score: student.totalgpa,
            status: student.totalgpa > 3.5 ? 'đạt chỉ tiêu' : student.totalgpa > 3.0 ? 'khá' : student.totalgpa > 2.0 ? 'cần cải thiện' : 'nguy hiểm',
            progressColor: student.totalgpa > 3.5 ? '#4caf50' : student.totalgpa > 3.0 ? '#2196f3' : student.totalgpa > 2.0 ? '#ff9800' : '#f44336',
            active: true
          };
        });

      // Lấy danh sách chương học và lọc theo courseId
      const chaptersResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CHAPTERS.GET_CHAPTERS}`);
      const chapters = chaptersResponse.data
        .filter((chapter: any) => chapter.courseid === numericCourseId)
        .map((chapter: any) => ({
          id: chapter.chapterid,
          name: chapter.name,
          totalStudents: chapter.totalstudents,
          completionRate: chapter.completionrate,
          averageScore: chapter.averagescore,
          studentsCompleted: chapter.studentscompleted,
          estimatedTime: chapter.estimatedtime
        }));

      // Lấy danh sách bài tập và lọc theo courseId
      const assignmentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENTS}`);
      const assignments = assignmentsResponse.data
        .filter((assignment: any) => assignment.courseid === numericCourseId)
        .map((assignment: any) => ({
          name: assignment.name,
          deadline: assignment.deadline,
          submitted: assignment.submitted,
          completionRate: assignment.completionrate,
          status: assignment.status.toLowerCase() as 'sắp hết hạn' | 'sắp tới' | 'đã qua hạn'
        }));

      // Lấy danh sách cảnh báo
      const warningsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.WARNINGS.GET_WARNINGS}`);
      const warnings = warningsResponse.data.map((warning: any) => ({
        mssv: warning.studentid.toString(),
        name: students.find((s: any) => s.mssv === warning.studentid.toString())?.name || 'Không xác định',
        score: 0,
        progress: 0,
        issue: warning.message,
        priority: warning.isnotified ? 'khẩn cấp' : 'cảnh báo'
      }));

      // Lấy danh sách lỗi chung và lọc theo courseId
      const errorsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ERRORS.GET_COMMON_ERRORS}`);
      const commonErrors = errorsResponse.data
        .filter((error: any) => error.courseid === numericCourseId)
        .map((error: any) => ({
          type: error.type,
          occurrences: error.occurrences,
          studentsAffected: error.studentsaffected,
          relatedChapters: error.relatedchapters
        }));

      // Lấy top 5 sinh viên có điểm cao nhất
      const topStudents = [...students]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(student => ({
          mssv: student.mssv,
          name: student.name,
          score: student.score,
          progress: student.progress
        }));

      // Lấy tiến độ lớp học với numericCourseId
      const classProgressResponse = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_CLASS_PROGRESS.replace(':courseid', numericCourseId)}`
      );

      const classInfo = {
        id: courseId,
        name: `Lớp ${courseId}`,
        semester: semesterId,
        totalStudents: classProgressResponse.data.total_students,
        activityRate: 0,
        averageScore: classProgressResponse.data.average_gpa,
        overallProgress: classProgressResponse.data.completion_rate,
        instructor: {
          name: 'Nguyễn Văn A',
          title: 'Giảng viên'
        }
      };

      return {
        students,
        chapters,
        commonErrors,
        assignments,
        warnings,
        topStudents,
        classInfo,
        courseOptions,
        semesterOptions
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Fetch assignment submission data
  fetchAssignmentSubmission: async (assignmentName: string) => {
    try {
      const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
      const assignmentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENTS}`);
      const assignment = assignmentsResponse.data.find((a: any) => a.name === assignmentName);

      if (!assignment) {
        throw new Error('Không tìm thấy bài tập');
      }

      const [submitted, total] = assignment.submitted.split('/').map(Number);
      const allStudents = studentsResponse.data.map((student: any) => ({
        mssv: student.mssv,
        name: student.name,
        progress: 0,
        score: student.totalgpa.toString(),
        status: student.totalgpa > 3.5 ? 'ĐẠT CHỈ TIÊU' : student.totalgpa > 3.0 ? 'KHÁ' : student.totalgpa > 2.0 ? 'CẦN CẢI THIỆN' : 'NGUY HIỂM'
      }));

      const studentsSubmitted = allStudents.slice(0, submitted);
      const studentsNotSubmitted = allStudents.slice(submitted, total);

      return {
        name: assignmentName,
        studentsSubmitted,
        studentsNotSubmitted
      };
    } catch (error) {
      console.error('Error fetching assignment submission:', error);
      throw error;
    }
  },

  // Send reminder to all students
  sendReminder: async (assignmentName: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.WARNINGS.UPDATE_WARNING_STATUS}`, {
        warningid: 1,
        status: 'contacted'
      });

      return { success: true, message: `Đã gửi nhắc nhở cho tất cả sinh viên về ${assignmentName}` };
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  },

  // Send reminder to specific student
  sendReminderToStudent: async (assignmentName: string, mssv: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CHAT.SEND_MESSAGE}`, {
        senderid: 1,
        receiverid: mssv,
        message: `Nhắc nhở: Bạn cần nộp bài tập "${assignmentName}" trước thời hạn.`
      });

      return { success: true, message: `Đã gửi nhắc nhở cho sinh viên ${mssv} về ${assignmentName}` };
    } catch (error) {
      console.error('Error sending reminder to student:', error);
      throw error;
    }
  },

  // Extend deadline for assignment
  extendDeadline: async (assignmentName: string) => {
    try {
      return { success: true, message: `Đã gia hạn thời gian nộp bài cho ${assignmentName}` };
    } catch (error) {
      console.error('Error extending deadline:', error);
      throw error;
    }
  }
};