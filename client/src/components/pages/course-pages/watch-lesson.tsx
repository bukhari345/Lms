import React, { useState, useEffect } from "react";
import VideoPlayer from "./video-player";
import AboutLesson from "./about-lesson";
import Quizzes from "./quizzes-page";
import Discussion from "./discussion-page";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getLessonById,
  getLessonsByCourse,
} from "../../../api/endpoints/course/lesson";
import { ApiResponseLesson } from "../../../api/types/apiResponses/ap-response-lesson";
import { Media } from "../../../api/types/apiResponses/ap-response-lesson";
import { BiVideo } from "react-icons/bi";
import { useSelector } from "react-redux";
import { selectStudentId } from "../../../redux/reducers/studentSlice";
import { selectCourse } from "../../../redux/reducers/courseSlice";
import ShimmerEffectWatchLessons from "../../shimmer/watch-lessons-shimmer";
import ShimmerVideoPlayer from "../../shimmer/shimmer-video-player";

const WatchLessons: React.FC = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [isLoadingAllLessons, setIsLoadingAllLessons] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [lesson, setLesson] = useState<ApiResponseLesson | null>(null);
  const [allLessons, setAllLessons] = useState<Array<ApiResponseLesson>>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const { lessonId, courseId } = useParams();
  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(
    lessonId
  );
  const studentId = useSelector(selectStudentId);
  const currentCourse = useSelector(selectCourse);
  let isCoursePurchased = false;

  if (currentCourse) {
    isCoursePurchased = currentCourse.coursesEnrolled.includes(studentId);
  }

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const fetchLessonsByCourse = async (courseId: string) => {
    try {
      setIsLoadingAllLessons(true);
      const response = await getLessonsByCourse(courseId);
      setAllLessons(response?.data);
      setIsLoadingAllLessons(false);
    } catch (error: any) {
      setIsLoadingAllLessons(false);
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const fetchLesson = async (lessonId: string) => {
    try {
      setIsLoadingLesson(true);
      const response = await getLessonById(lessonId);
      setLesson(response?.data);
      // const key = response?.data?.media.find(
      //   (media: Media) => media.name === "lessonVideo"
      // )?.key;

      // if (!key) {
      //   console.warn("No video key found for lesson:", lessonId);
      // }

      setVideoKey(currentCourse?.introduction ?? null);
      setIsLoadingLesson(false);
    } catch (error: any) {
      setIsLoadingLesson(false);
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  console.log(
    "🚀 ~ fetchLesson ~ currentCourse.introduction:",
    currentCourse?.introduction
  );

  useEffect(() => {
    if (currentLessonId) {
      fetchLesson(currentLessonId);
    }
  }, [currentLessonId, currentCourse]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    if (courseId) {
      fetchLessonsByCourse(courseId);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [courseId]);

  let content = null;

  if (selectedItemIndex === 0) {
    content = <AboutLesson about={lesson?.description ?? ""} />;
  } else if (selectedItemIndex === 1) {
    content = <Discussion lessonId={currentLessonId ?? ""} />;
  } else {
    content = <Quizzes lessonId={lessonId} />;
  }

  if (isLoadingAllLessons || isLoadingLesson) {
    return <ShimmerEffectWatchLessons />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen pb-16 bg-gray-100">
      <div className="flex flex-col md:w-3/4 w-full overflow-y-auto">
        {isLoadingLesson ? (
          <ShimmerVideoPlayer />
        ) : (
          <>
            <div className="h-2/3 bg-black">
              <VideoPlayer
                videoKey={videoKey}
                isCoursePurchased={isCoursePurchased}
              />
            </div>
            <div className="bg-white shadow-md rounded-tl-lg rounded-tr-lg p-4">
              <ul className="flex justify-around border-b-2 mb-4">
                <li
                  className={`cursor-pointer p-2 ${
                    selectedItemIndex === 0
                      ? "border-b-4 border-purple-500"
                      : ""
                  }`}
                  onClick={() => handleItemClick(0)}
                >
                  About
                </li>
                <li
                  className={`cursor-pointer p-2 ${
                    selectedItemIndex === 1
                      ? "border-b-4 border-purple-500"
                      : ""
                  }`}
                  onClick={() => handleItemClick(1)}
                >
                  Discussion
                </li>
                <li
                  className={`cursor-pointer p-2 ${
                    selectedItemIndex === 2
                      ? "border-b-4 border-purple-500"
                      : ""
                  }`}
                  onClick={() => handleItemClick(2)}
                >
                  Quizzes
                </li>
              </ul>
              <div className="p-4">{content}</div>
            </div>
          </>
        )}
      </div>
      <div className="w-full md:w-1/4 bg-white shadow-lg overflow-y-auto">
        <h1 className="font-semibold text-xl text-blue-gray-800 border-b border-gray-300 p-4">
          Lessons
        </h1>
        <ul>
          <li
            onClick={() => {
              setCurrentLessonId(currentCourse?._id);
            }}
            className={`p-4 border-b flex items-center cursor-pointer ${
              currentCourse?._id === currentLessonId
                ? "bg-purple-100"
                : "hover:bg-purple-50"
            }`}
          >
            <BiVideo className="mr-2 text-purple-500" />
            <span className="text-sm text-gray-700">
              Episode 00 - Introduction to the course
            </span>
          </li>

          {allLessons.map((lesson, index) => (
            <li
              key={lesson._id}
              onClick={() => {
                setCurrentLessonId(lesson._id);
              }}
              className={`p-4 border-b flex items-center cursor-pointer ${
                lesson._id === currentLessonId
                  ? "bg-purple-100"
                  : "hover:bg-purple-50"
              }`}
            >
              <BiVideo className="mr-2 text-purple-500" />
              <span className="text-sm text-gray-700">
                Episode 0{index + 1} - {lesson.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WatchLessons;
