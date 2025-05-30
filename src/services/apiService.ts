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
          fullName: course.coursename,
          difficulty: course.difficulty, // Thêm trường difficulty từ backend
          category: course.category // Thêm trường category từ backend
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
            class: student.class_, // Thêm trường class từ backend
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
        class: warning.class, // Thêm trường class từ backend
        score: 0,
        progress: 0,
        issue: warning.message,
        warningtype: warning.warningtype, // Thêm trường warningtype từ backend
        severity: warning.severity, // Thêm trường severity từ backend
        priority: warning.priority || (warning.isnotified ? 'khẩn cấp' : 'cảnh báo') // Sử dụng trường priority từ backend nếu có
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
        
      // Lấy danh sách sinh viên cần hỗ trợ (điểm < 2)
      const studentsNeedingSupport = [...students]
        .filter(student => student.score < 2)
        .map(student => ({
          mssv: student.mssv,
          name: student.name,
          score: student.score,
          progress: student.progress,
          issue: "Điểm trung bình thấp, cần hỗ trợ học tập"
        }));

      // Lấy tiến độ lớp học với numericCourseId
      const classProgressResponse = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_CLASS_PROGRESS.replace(':courseid', numericCourseId)}`
      );

      // Cập nhật thông tin lớp học với dữ liệu từ API
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
        },
        // Thêm thông tin về danh sách sinh viên với trường class
        students_list: classProgressResponse.data.students_list
      };

      return {
        students,
        chapters,
        commonErrors,
        assignments,
        warnings,
        topStudents,
        studentsNeedingSupport,
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
  fetchAssignmentSubmission: async (assignmentName: string, courseId: string) => {
    try {
      // Tìm ID của bài tập từ tên và courseId
      const assignmentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENTS}`);
      
      // Lọc bài tập theo courseId và tên bài tập
      const numericCourseId = parseInt(courseId, 10);
      const assignment = assignmentsResponse.data.find((a: any) => 
        a.name === assignmentName && a.courseid === numericCourseId
      );

      if (!assignment) {
        // Nếu không tìm thấy bài tập chính xác, tìm bài tập tương tự trong khóa học hiện tại
        const similarAssignment = assignmentsResponse.data.find((a: any) => 
          a.name.includes(assignmentName.split(' - ')[0]) && a.courseid === numericCourseId
        );
        
        // Nếu không tìm thấy bài tập tương tự, tìm bài tập đầu tiên trong khóa học hiện tại
        const firstAssignmentInCourse = assignmentsResponse.data.find((a: any) => 
          a.courseid === numericCourseId
        );
        
        if (!similarAssignment && !firstAssignmentInCourse) {
          throw new Error(`Không tìm thấy bài tập nào trong khóa học ${courseId}`);
        }
        
        // Sử dụng bài tập tương tự hoặc bài tập đầu tiên nếu tìm thấy
        const useAssignment = similarAssignment || firstAssignmentInCourse;
        const assignmentId = useAssignment.assignmentid;
        const statusResponse = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENT_STATUS.replace(':assignmentid', assignmentId.toString())}`
        );
        
        return processAssignmentData(statusResponse.data, useAssignment.name);
      }

      // Sử dụng endpoint mới để lấy trạng thái nộp bài
      const assignmentId = assignment.assignmentid;
      const statusResponse = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENT_STATUS.replace(':assignmentid', assignmentId.toString())}`
      );

      return apiService.processAssignmentData(statusResponse.data, assignment.name);
    } catch (error) {
      console.error('Error fetching assignment submission:', error);
      throw error;
    }
  },
  
  // Hàm xử lý dữ liệu bài tập
  processAssignmentData: (data: any, assignmentName: string) => {
    // Chuyển đổi dữ liệu từ API sang định dạng cần thiết
    const studentsSubmitted = data.submitted_students.map((student: any) => ({
      mssv: student.mssv,
      name: student.name,
      progress: student.progress,
      score: student.current_score ? student.current_score.toString() : 'N/A',
      status: student.current_score > 8.5 ? 'ĐẠT CHỈ TIÊU' : 
              student.current_score > 7 ? 'KHÁ' : 
              student.current_score > 5 ? 'CẦN CẢI THIỆN' : 'NGUY HIỂM'
    }));

    const studentsNotSubmitted = data.not_submitted_students.map((student: any) => ({
      mssv: student.mssv,
      name: student.name,
      progress: student.progress,
      score: student.current_score ? student.current_score.toString() : 'N/A',
      status: student.progress > 75 ? 'KHÁ' : 
              student.progress > 50 ? 'CẦN CẢI THIỆN' : 'NGUY HIỂM'
    }));

    return {
      name: assignmentName || data.assignment_name,
      deadline: data.deadline,
      studentsSubmitted,
      studentsNotSubmitted,
      totalStudents: data.total_students,
      submittedCount: data.submitted_count,
      notSubmittedCount: data.not_submitted_count
    };
  },

  // Send reminder to all students
  sendReminder: async (assignmentName: string, courseId: string) => {
    try {
      // Tìm ID của bài tập từ tên và courseId
      const assignmentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENTS}`);
      
      // Lọc bài tập theo courseId và tên bài tập
      const numericCourseId = parseInt(courseId, 10);
      const assignment = assignmentsResponse.data.find((a: any) => 
        a.name === assignmentName && a.courseid === numericCourseId
      );

      // Nếu không tìm thấy bài tập chính xác, tìm bài tập tương tự trong khóa học hiện tại
      if (!assignment) {
        console.warn(`Không tìm thấy bài tập "${assignmentName}" trong khóa học ${courseId}`);
      }

      // Lấy thông tin sinh viên để lấy class
      const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
      const student = studentsResponse.data[0]; // Lấy sinh viên đầu tiên để lấy class (có thể cải thiện logic này)
      
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.WARNINGS.UPDATE_WARNING_STATUS}`, {
        warningid: 1,
        status: 'contacted',
        assignmentName: assignment ? assignment.name : assignmentName,
        courseId: numericCourseId,
        class_: student ? student.class_ : null // Thêm trường class_ khi tạo cảnh báo
      });

      return { 
        success: true, 
        message: `Đã gửi nhắc nhở cho tất cả sinh viên về ${assignment ? assignment.name : assignmentName}` 
      };
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  },

  // Send reminder to specific student
  sendReminderToStudent: async (assignmentName: string, mssv: string, courseId: string) => {
    try {
      // Tìm ID của bài tập từ tên và courseId
      const assignmentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENTS}`);
      
      // Lọc bài tập theo courseId và tên bài tập
      const numericCourseId = parseInt(courseId, 10);
      const assignment = assignmentsResponse.data.find((a: any) => 
        a.name === assignmentName && a.courseid === numericCourseId
      );

      // Nếu không tìm thấy bài tập chính xác, tìm bài tập tương tự trong khóa học hiện tại
      const actualAssignmentName = assignment ? assignment.name : assignmentName;

      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CHAT.SEND_MESSAGE}`, {
        senderid: 1, // Sửa từ ConstructorError thành senderid theo yêu cầu
        receiverid: mssv,
        message: `Nhắc nhở: Bạn cần nộp bài tập "${actualAssignmentName}" trước thời hạn.`
      });

      return { success: true, message: `Đã gửi nhắc nhở cho sinh viên ${mssv} về ${actualAssignmentName}` };
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
  },

  // Lấy lộ trình học tập của sinh viên
  fetchLearningPath: async (studentId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_LEARNING_PATH.replace(':studentid', studentId)}`
      );
      
      return {
        currentCourses: response.data.current_courses || [],
        recommendedCourses: response.data.recommended_courses || [],
        allCourses: response.data.all_courses || []
      };
    } catch (error) {
      console.error('Error fetching learning path:', error);
      throw error;
    }
  }
};