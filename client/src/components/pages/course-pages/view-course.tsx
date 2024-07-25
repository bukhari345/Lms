import React, { useState } from "react";
import CustomBreadCrumbs from "../../common/bread-crumbs";
import { Link, useLocation } from "react-router-dom";
import { Button, Chip } from "@material-tailwind/react";
import { getIndividualCourse } from "../../../api/endpoints/course/course";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CourseInterface } from "../../../types/course";
import { formatToINR } from "../../../utils/helpers";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BiVideo } from "react-icons/bi";
import { IoBookSharp } from "react-icons/io5";
import useApiData from "../../../hooks/useApiCall";
import { getLessonsByCourse } from "../../../api/endpoints/course/lesson";
import { useDispatch } from "react-redux";
import { setCourse } from "../../../redux/reducers/courseSlice";
import { useSelector } from "react-redux";
import { selectStudentId } from "../../../redux/reducers/studentSlice";
import { MdDone } from "react-icons/md";
import PaymentConfirmationModal from "./payment-confirmation-modal";
import { selectIsLoggedIn } from "../../../redux/reducers/authSlice";
import LoginConfirmation from "../../common/login-confirmation-modal";
import PdfViewer from "./pdf-viewer";
import ViewCourseShimmer from "components/shimmer/view-course-shimmer";

const ViewCourseStudent: React.FC = () => {
  const params = useParams();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const courseId: string | undefined = params.courseId;
  const [openPaymentConfirmation, setOpenPaymentConfirmation] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const studentId = useSelector(selectStudentId);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [loginConfirmation, setLoginConfirmation] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [successToastShown, setSuccessToastShown] = useState(false);

  const fetchCourse = async (courseId: string): Promise<CourseInterface> => {
    try {
      const course = await getIndividualCourse(courseId);
      return course?.data?.data as CourseInterface;
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      throw error;
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const lessons = await getLessonsByCourse(courseId);
      return lessons.data;
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      throw error;
    }
  };

  const { data, isLoading, refreshData } = useApiData(fetchCourse, courseId);
  const { data: lessons, isLoading: isLessonsLoading } = useApiData(
    fetchLessons,
    courseId
  );

  const course: CourseInterface | null = data;
  course && dispatch(setCourse({ course }));

  const handleToggle = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleEnroll = () => {
    if (!isLoggedIn) {
      setLoginConfirmation(true);
    } else {
      setOpenPaymentConfirmation(true);
    }
  };

  const location = useLocation();
  if (isLoading || isLessonsLoading) {
    return <ViewCourseShimmer />;
  }

  if (location.hash === "#success" && !successToastShown) {
    toast.success("Successfully enrolled into the course", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    setSuccessToastShown(true);
  }

  const enrolled = course?.coursesEnrolled.includes(studentId ?? "");
  console.log("🚀 ~ course:", course);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-full min-h-screen text-white">
      <LoginConfirmation
        confirm={loginConfirmation}
        setConfirm={setLoginConfirmation}
      />
      <PaymentConfirmationModal
        open={openPaymentConfirmation}
        setUpdated={refreshData}
        courseDetails={{
          price: course?.price ?? 0,
          overview: course?.description ?? "",
          isPaid: course?.isPaid ?? false,
        }}
        setOpen={setOpenPaymentConfirmation}
      />
      <div className="flex flex-col p-5">
        <CustomBreadCrumbs paths={location.pathname} />
      </div>
      <div className="flex flex-col items-center px-5 py-10">
        <div className="max-w-5xl w-full">
          <div className="relative mb-6 rounded-lg overflow-hidden shadow-lg">
            <img
              className="w-full h-64 object-cover"
              src={course?.thumbnail}
              alt="Course Thumbnail"
            />
            <div className="absolute top-3 right-3 bg-blue-500 text-white px-4 py-2 text-sm rounded-tl-lg rounded-br-lg shadow-md">
              Bestseller
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-4xl font-bold mb-4">{course?.title}</h2>
            <p className="text-gray-200 text-lg mb-6">{course?.description}</p>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold mr-4">Difficulty:</h3>
              <div
                className={`rounded-full px-2 py-1 text-sm font-semibold text-white ${
                  course?.level === "easy"
                    ? "bg-green-500"
                    : course?.level === "medium"
                    ? "bg-orange-500"
                    : course?.level === "hard"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {course?.level}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <h4 className="text-xl font-semibold">Instructor</h4>
                <p className="text-gray-200">John Doe</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold">Duration</h4>
                <p className="text-gray-200">{course?.duration} weeks</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold">Price</h4>
                {course?.isPaid ? (
                  <p className="text-gray-200">
                    {formatToINR(course?.price ?? 0)}
                  </p>
                ) : (
                  <Chip variant="ghost" color="green" size="sm" value="Free" />
                )}
              </div>
            </div>
            <div className="mb-8">
              <h4 className="text-2xl font-semibold mb-2">Syllabus</h4>
              <ul className="text-gray-700 bg-white rounded-lg shadow-lg overflow-hidden">
                <li
                  className={`p-6 border-b cursor-pointer ${
                    expandedIndex === 0 ? "bg-purple-100" : "hover:bg-purple-50"
                  }`}
                  onClick={() => handleToggle(0)}
                >
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">&#9679;</span>
                    <span>Module 1: Introduction to the Course</span>
                    {expandedIndex === 0 ? (
                      <FaAngleUp className="ml-auto" />
                    ) : (
                      <FaAngleDown className="ml-auto" />
                    )}
                  </div>
                </li>
                {expandedIndex === 0 && (
                  <li>
                    <ul>
                      <Link
                        to={course?.guidelines ?? ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <li className="p-6 border-b flex items-center cursor-pointer hover:bg-purple-50">
                          <IoBookSharp className="mr-2 text-blue-500" />
                          <span className="flex-1">Important guidelines</span>
                        </li>
                      </Link>
                      {showPdf && (
                        <PdfViewer pdfUrl={course?.guidelines ?? ""} />
                      )}
                    </ul>
                  </li>
                )}
                <li
                  className={`p-6 border-b cursor-pointer ${
                    expandedIndex === 1 ? "bg-purple-100" : "hover:bg-purple-50"
                  }`}
                  onClick={() => handleToggle(1)}
                >
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">&#9679;</span>
                    <span>Module 2: Advanced Techniques</span>
                    {expandedIndex === 1 ? (
                      <FaAngleUp className="ml-auto" />
                    ) : (
                      <FaAngleDown className="ml-auto" />
                    )}
                  </div>
                </li>
                {expandedIndex === 1 && (
                  <li>
                    <ul>
                      {lessons.map((lesson: any) => (
                        <Link
                          to={`watch-lessons/${lesson._id}`}
                          key={lesson._id}
                        >
                          <li className="p-6 border-b flex items-center cursor-pointer hover:bg-purple-50">
                            <BiVideo className="mr-2 text-blue-500" />
                            <span className="flex-1">{lesson.title}</span>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
            <div className="mb-8">
              <h4 className="text-2xl font-semibold mb-2">About this course</h4>
              <div className="text-gray-200 bg-gray-800 p-6 rounded-lg shadow-lg break-words">
                {course?.about}
              </div>
            </div>
            <div className="mb-8">
              <h4 className="text-2xl font-semibold mb-2">Requirements</h4>
              <ul className="text-gray-200 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {course?.requirements.map((item, index) => (
                  <li className="p-3 border-b last:border-none" key={index}>
                    <span className="text-blue-500 mr-2">&#9679;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-end">
              <Button
                disabled={enrolled}
                color={enrolled ? `green` : "blue"}
                className="rounded-full flex items-center justify-center"
                onClick={handleEnroll}
              >
                {enrolled ? (
                  <>
                    <span className="mr-1">Enrolled</span>
                    <MdDone className="text-lg" />
                  </>
                ) : (
                  <span>Enroll Now</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseStudent;
