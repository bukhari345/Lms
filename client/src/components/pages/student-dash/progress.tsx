import { getAllStudents } from "api/endpoints/student-management";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectStudent } from "redux/reducers/studentSlice";

const Progress = () => {
  const student = useSelector(selectStudent);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      const studentsWithProgress = response?.data.map((student: any) => {
        const totalAssignmentsPoints = student.assignments.reduce(
          (acc: any, assignment: any) => acc + assignment.points,
          0
        );
        const totalAssignmentsMaxPoints = student.assignments.reduce(
          (acc: any, assignment: any) => acc + assignment.maxPoints,
          0
        );
        const totalQuizzesScore = student.quizzes.reduce(
          (acc: any, quiz: any) => acc + quiz.score,
          0
        );
        const totalQuizzesMaxScore = student.quizzes.reduce(
          (acc: any, quiz: any) => acc + quiz.maxScore,
          0
        );

        const totalPoints = totalAssignmentsPoints + totalQuizzesScore;
        const totalMaxPoints = totalAssignmentsMaxPoints + totalQuizzesMaxScore;

        const progress =
          totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0;

        return { ...student, progress };
      });
      setStudents(studentsWithProgress);
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  const totalAssignmentsPoints = student?.studentDetails?.assignments?.reduce(
    (acc: any, assignment: any) => acc + assignment.points,
    0
  );
  const totalAssignmentsMaxPoints =
    student?.studentDetails?.assignments?.reduce(
      (acc: any, assignment: any) => acc + assignment.maxPoints,
      0
    );

  const progress =
    totalAssignmentsMaxPoints > 0
      ? (totalAssignmentsPoints / totalAssignmentsMaxPoints) * 100
      : 0;
  return (
    <div className="container mx-auto h-[70rem]">
      <h1 className="text-4xl mb-8">Your Progress </h1>

      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h2 className="text-2xl">
            Student Name:{" "}
            {student.studentDetails?.firstName +
              " " +
              student.studentDetails?.lastName}
          </h2>
          <span className="bg-yellow-500 text-lg px-3 py-1 rounded-full">
            Class Position: 2
          </span>
        </div>
        <div className="p-6 bg-gray-100">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <h4 className="text-xl mb-4">Assignments</h4>
              <ul className="list-none">
                {student.studentDetails?.assignments.map((assignment: any) => (
                  <li className="bg-white p-3 mb-2 shadow rounded-lg">
                    {assignment?.title} : {assignment?.points}
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full ml-2">
                      {assignment?.maxPoints}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <h4 className="text-xl mb-4">Quizzes</h4>
              <ul className="list-none">
                {student.studentDetails?.quizzes.map((assignment: any) => (
                  <li className="bg-white p-3 mb-2 shadow rounded-lg">
                    {assignment?.title} : {assignment?.score}
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full ml-2">
                      {assignment?.maxScore}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/3 px-3">
              <h4 className="text-xl mb-4">Progress</h4>
              <div className="w-24">
                <CircularProgressbar
                  value={Math.round(progress)}
                  text={`${Math.round(progress)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h2 className="text-2xl">Other Class Members</h2>
        </div>
        <div className="p-6 bg-gray-100">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Assignments</th>
                <th className="px-4 py-2">Quizzes</th>
                <th className="px-4 py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((member: any, index: any) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border px-4 py-2">
                    {member?.firstName + " " + member?.lastName}
                  </td>
                  <td className="border px-4 py-2">
                    {member?.assignments
                      ?.map((item: any) => item?.points || 0)
                      .join(", ")}
                  </td>
                  <td className="border px-4 py-2">
                    {member?.quizzes
                      ?.map((item: any) => item?.score || 0)
                      .join(", ")}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="w-16 mx-auto">
                      <CircularProgressbar
                        value={Math.round(member?.progress)}
                        text={`${Math.round(member?.progress)}%`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Progress;
