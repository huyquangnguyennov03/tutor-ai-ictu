import * as XLSX from 'xlsx';
import { 
  Student, 
  Chapter, 
  Assignment, 
  StudentWarning, 
  ClassInfo,
  CourseOption,
  SemesterOption
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
    },
    fileName: string = 'dashboard-export.xlsx'
  ) => {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add class info sheet
    if (data.classInfo) {
      const classInfoData = [
        ['Thông tin lớp học', ''],
        ['Tên lớp', data.classInfo.name],
        ['Học kỳ', data.classInfo.semester],
        ['Tổng số sinh viên', data.classInfo.totalStudents],
        ['Tỷ lệ hoạt động', `${data.classInfo.activityRate}%`],
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

    // Add warnings sheet
    if (data.warnings && data.warnings.length > 0) {
      const warningsData = [
        ['MSSV', 'Tên sinh viên', 'Lớp', 'Điểm', 'Tiến độ (%)', 'Vấn đề', 'Loại cảnh báo', 'Mức độ', 'Ưu tiên']
      ];

      data.warnings.forEach(warning => {
        warningsData.push([
          warning.mssv,
          warning.name,
          warning.class || '',
          warning.score,
          warning.progress,
          warning.issue,
          warning.warningtype || '',
          warning.severity || '',
          warning.priority
        ]);
      });

      const warningsSheet = XLSX.utils.aoa_to_sheet(warningsData);
      XLSX.utils.book_append_sheet(workbook, warningsSheet, 'Cảnh báo & Nhắc nhở');
    }

    // Export the workbook
    XLSX.writeFile(workbook, fileName);
  }
};