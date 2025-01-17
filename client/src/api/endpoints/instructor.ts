import {
  updateProfileService,
  changePasswordService,
  getMyStudentsService,
  getInstructorDetailsService,
} from "../services/instructor";
import { PasswordInfo } from "../types/student/student";
import END_POINTS from "../../constants/endpoints";
import { editStudentDetailService } from "api/services/student";

export const changePassword = (passwordInfo: PasswordInfo) => {
  return changePasswordService(
    END_POINTS.INSTRUCTOR_CHANGE_PASSWORD,
    passwordInfo
  );
};

export const updateProfile = (profileInfo: FormData) => {
  return updateProfileService(
    END_POINTS.INSTRUCTOR_UPDATE_PROFILE,
    profileInfo
  );
};

export const getMyStudents = () => {
  return getMyStudentsService(END_POINTS.GET_MY_STUDENTS);
};

export const updateStudent = (studentId: any, profileInfo: any) => {
  return editStudentDetailService(
    END_POINTS.MY_STUDENTS_UPDATE,
    studentId,
    profileInfo
  );
};
export const getInstructorDetails = () => {
  return getInstructorDetailsService(END_POINTS.GET_INSTRUCTOR_DETAILS);
};
