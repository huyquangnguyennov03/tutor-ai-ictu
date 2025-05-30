import * as XLSX from 'xlsx';
import { 
  Student, 
  Chapter, 
  Assignment, 
  StudentWarning, 
  ClassInfo,
  CourseOption,
  SemesterOption,
  CommonError,
  TopStudent,
  StudentNeedingSupport,
  AssignmentSubmission
} from '@/redux/slices/teacherDashboardSlice';

/**
 * Service for exporting dashboard data to Excel
 */
export const exportService = {
  /**
   * Export dashboard data to Excel
   * @param data Dashboard data to export
   * @param fileName Name of the exported file
   */
  exportToExcel: (
    data: {
      students: Student[];
      chapters: Chapter[];
      assignments: Assignment[];
      warnings: StudentWarning[];
      classInfo: ClassInfo | null;
      currentCourse: string;
      currentSemester: string;
      courseOptions: CourseOption[];
      semesterOptions: SemesterOption[];
      commonErrors: CommonError[];
      topStudents: TopStudent[];
      studentsNeedingSupport: StudentNeedingSupport[];
      assignmentSubmission: AssignmentSubmission | null;
    },
    fileName: string = 'dashboard-export.xlsx'
  ) => {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add class info sheet
    if (data.classInfo) {
      // Tính toán tỷ lệ hoạt động từ dữ liệu sinh viên nếu giá trị hiện tại là 0
      let activityRate = data.classInfo.activityRate;
      if (activityRate === 0 && data.students && data.students.length > 0) {
        // Tính tỷ lệ sinh viên có tiến độ > 0
        const activeStudents = data.students.filter(student => student.progress > 0);
        activityRate = Math.round((activeStudents.length / data.students.length) * 100);
      }

      const classInfoData = [
        ['Thông tin lớp học', ''],
        ['Tên lớp', data.classInfo.name],
        ['Học kỳ', data.classInfo.semester],
        ['Tổng số sinh viên', data.classInfo.totalStudents],
        ['Tỷ lệ hoạt động', `${activityRate}%`],
        ['Điểm trung bình', data.classInfo.averageScore],
        ['Tiến độ tổng thể', `${data.classInfo.overallProgress}%`],
        ['Giảng viên', `${data.classInfo.instructor.title} ${data.classInfo.instructor.name}`],
      ];

      // Add assistant info if available
      if (data.classInfo.assistant) {
        classInfoData.push(['Trợ giảng', `${data.classInfo.assistant.title} ${data.classInfo.assistant.name}`]);
      }

      const classInfoSheet = XLSX.utils.aoa_to_sheet(classInfoData);
      XLSX.utils.book_append_sheet(workbook, classInfoSheet, 'Thông tin lớp');
    }

    // Add students sheet
    if (data.students && data.students.length > 0) {
      const studentsData = [
        ['MSSV', 'Tên sinh viên', 'Lớp', 'Tiến độ (%)', 'Điểm hiện tại', 'Trạng thái']
      ];

      data.students.forEach(student => {
        studentsData.push([
          student.mssv,
          student.name,
          student.class || '',
          student.progress,
          student.score,
          student.status
        ]);
      });

      const studentsSheet = XLSX.utils.aoa_to_sheet(studentsData);
      XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Danh sách sinh viên');
    }

    // Add chapters sheet
    if (data.chapters && data.chapters.length > 0) {
      const chaptersData = [
        ['ID', 'Tên chương', 'Tổng số sinh viên', 'Tỷ lệ hoàn thành (%)', 'Điểm trung bình', 'Sinh viên đã hoàn thành', 'Thời gian trung bình (phút)']
      ];

      data.chapters.forEach(chapter => {
        chaptersData.push([
          chapter.id,
          chapter.name,
          chapter.totalStudents,
          chapter.completionRate,
          chapter.averageScore,
          chapter.studentsCompleted,
          chapter.estimatedTime
        ]);
      });

      const chaptersSheet = XLSX.utils.aoa_to_sheet(chaptersData);
      XLSX.utils.book_append_sheet(workbook, chaptersSheet, 'Tiến độ theo chương');
    }

    // Add assignments sheet
    if (data.assignments && data.assignments.length > 0) {
      const assignmentsData = [
        ['Tên bài tập', 'Hạn nộp', 'Đã nộp', 'Tỷ lệ hoàn thành (%)', 'Trạng thái']
      ];

      data.assignments.forEach(assignment => {
        assignmentsData.push([
          assignment.name,
          assignment.deadline,
          assignment.submitted,
          assignment.completionRate,
          assignment.status
        ]);
      });

      const assignmentsSheet = XLSX.utils.aoa_to_sheet(assignmentsData);
      XLSX.utils.book_append_sheet(workbook, assignmentsSheet, 'Bài tập & Nộp bài');
    }

    // Add warnings sheet - create from students with issues
    // Tạo cảnh báo từ danh sách sinh viên có vấn đề
    const warningsData = [
      ['MSSV', 'Tên sinh viên', 'Lớp', 'Điểm', 'Tiến độ (%)', 'Vấn đề', 'Mức độ', 'Ưu tiên']
    ];

    // Tạo cảnh báo từ sinh viên có điểm thấp
    const lowScoreStudents = data.students.filter(student => student.score < 2);
    lowScoreStudents.forEach(student => {
      warningsData.push([
        student.mssv,
        student.name,
        student.class || '',
        student.score,
        student.progress,
        'Điểm số thấp, cần cải thiện',
        'Trung bình',
        'cảnh báo'
      ]);
    });

    // Tạo cảnh báo từ sinh viên có tiến độ thấp
    const lowProgressStudents = data.students.filter(student => student.progress < 30 && !lowScoreStudents.includes(student));
    lowProgressStudents.forEach(student => {
      warningsData.push([
        student.mssv,
        student.name,
        student.class || '',
        student.score,
        student.progress,
        'Tiến độ học tập chậm',
        'Thấp',
        'thông tin'
      ]);
    });

    // Thêm cảnh báo từ danh sách cảnh báo gốc nếu có
    if (data.warnings && data.warnings.length > 0) {
      // Lọc cảnh báo chỉ của lớp hiện tại
      const currentClassWarnings = data.warnings.filter(warning => {
        return data.students.some(student => student.mssv === warning.mssv);
      });

      currentClassWarnings.forEach(warning => {
        // Tìm thông tin sinh viên từ danh sách sinh viên để lấy điểm và tiến độ chính xác
        const studentInfo = data.students.find(student => student.mssv === warning.mssv);
        
        // Chỉ thêm nếu chưa có trong danh sách
        const exists = warningsData.some(row => 
          row[0] === warning.mssv && row[5] === warning.issue
        );
        
        if (!exists) {
          warningsData.push([
            warning.mssv,
            warning.name,
            warning.class || '',
            studentInfo ? studentInfo.score : warning.score,
            studentInfo ? studentInfo.progress : warning.progress,
            warning.issue,
            warning.severity || 'Trung bình',
            warning.priority
          ]);
        }
      });
    }

    // Chỉ tạo sheet nếu có dữ liệu cảnh báo (ngoài header)
    if (warningsData.length > 1) {
      const warningsSheet = XLSX.utils.aoa_to_sheet(warningsData);
      XLSX.utils.book_append_sheet(workbook, warningsSheet, 'Cảnh báo & Nhắc nhở');
    }

    // Add common errors sheet
    if (data.commonErrors && data.commonErrors.length > 0) {
      const errorsData = [
        ['Loại lỗi', 'Số lần xuất hiện', 'Số SV gặp phải', 'Chương liên quan']
      ];

      data.commonErrors.forEach(error => {
        errorsData.push([
          error.type,
          error.occurrences,
          error.studentsAffected,
          error.relatedChapters
        ]);
      });

      const errorsSheet = XLSX.utils.aoa_to_sheet(errorsData);
      XLSX.utils.book_append_sheet(workbook, errorsSheet, 'Lỗi biên dịch phổ biến');
    }

    // Add top students sheet - filter for current class only
    if (data.topStudents && data.topStudents.length > 0) {
      const topStudentsData = [
        ['MSSV', 'Tên sinh viên', 'Điểm', 'Tiến độ (%)']
      ];

      // Lọc sinh viên xuất sắc chỉ của lớp hiện tại
      const currentClassTopStudents = data.topStudents.filter(student => {
        return data.students.some(s => s.mssv === student.mssv);
      });

      currentClassTopStudents.forEach(student => {
        // Tìm thông tin sinh viên từ danh sách sinh viên để lấy điểm và tiến độ chính xác
        const studentInfo = data.students.find(s => s.mssv === student.mssv);
        
        topStudentsData.push([
          student.mssv,
          student.name,
          studentInfo ? studentInfo.score : student.score,
          studentInfo ? studentInfo.progress : student.progress
        ]);
      });

      const topStudentsSheet = XLSX.utils.aoa_to_sheet(topStudentsData);
      XLSX.utils.book_append_sheet(workbook, topStudentsSheet, 'Sinh viên xuất sắc');
    }

    // Add students needing support sheet - filter for current class only
    if (data.studentsNeedingSupport && data.studentsNeedingSupport.length > 0) {
      const supportStudentsData = [
        ['MSSV', 'Tên sinh viên', 'Điểm', 'Tiến độ (%)', 'Vấn đề']
      ];

      // Lọc sinh viên cần hỗ trợ chỉ của lớp hiện tại
      const currentClassStudentsNeedingSupport = data.studentsNeedingSupport.filter(student => {
        return data.students.some(s => s.mssv === student.mssv);
      });

      currentClassStudentsNeedingSupport.forEach(student => {
        // Tìm thông tin sinh viên từ danh sách sinh viên để lấy điểm và tiến độ chính xác
        const studentInfo = data.students.find(s => s.mssv === student.mssv);
        
        supportStudentsData.push([
          student.mssv,
          student.name,
          studentInfo ? studentInfo.score : student.score,
          studentInfo ? studentInfo.progress : student.progress,
          student.issue
        ]);
      });

      const supportStudentsSheet = XLSX.utils.aoa_to_sheet(supportStudentsData);
      XLSX.utils.book_append_sheet(workbook, supportStudentsSheet, 'Sinh viên cần hỗ trợ');
    }

    // Add assignment submission details if available
    if (data.assignmentSubmission) {
      // Sheet for submitted students
      if (data.assignmentSubmission.studentsSubmitted && data.assignmentSubmission.studentsSubmitted.length > 0) {
        const submittedData = [
          ['Bài tập', data.assignmentSubmission.name],
          ['Deadline', data.assignmentSubmission.deadline],
          ['Tổng số sinh viên', data.assignmentSubmission.totalStudents],
          ['Số sinh viên đã nộp', data.assignmentSubmission.submittedCount],
          [''],
          ['MSSV', 'Tên sinh viên', 'Tiến độ (%)', 'Điểm', 'Trạng thái']
        ];

        data.assignmentSubmission.studentsSubmitted.forEach(student => {
          submittedData.push([
            student.mssv,
            student.name,
            student.progress,
            student.score,
            student.status
          ]);
        });

        const submittedSheet = XLSX.utils.aoa_to_sheet(submittedData);
        XLSX.utils.book_append_sheet(workbook, submittedSheet, 'SV đã nộp bài tập');
      }

      // Sheet for not submitted students
      if (data.assignmentSubmission.studentsNotSubmitted && data.assignmentSubmission.studentsNotSubmitted.length > 0) {
        const notSubmittedData = [
          ['Bài tập', data.assignmentSubmission.name],
          ['Deadline', data.assignmentSubmission.deadline],
          ['Tổng số sinh viên', data.assignmentSubmission.totalStudents],
          ['Số sinh viên chưa nộp', data.assignmentSubmission.notSubmittedCount],
          [''],
          ['MSSV', 'Tên sinh viên', 'Tiến độ (%)', 'Điểm', 'Trạng thái']
        ];

        data.assignmentSubmission.studentsNotSubmitted.forEach(student => {
          notSubmittedData.push([
            student.mssv,
            student.name,
            student.progress,
            student.score,
            student.status
          ]);
        });

        const notSubmittedSheet = XLSX.utils.aoa_to_sheet(notSubmittedData);
        XLSX.utils.book_append_sheet(workbook, notSubmittedSheet, 'SV chưa nộp bài tập');
      }
    }

    // Export the workbook
    XLSX.writeFile(workbook, fileName);
  }
};