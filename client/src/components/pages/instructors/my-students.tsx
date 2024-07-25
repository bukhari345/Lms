import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  getMyStudents,
  updateStudent,
} from "../../../api/endpoints/instructor";
import { useState, useEffect } from "react";
import usePagination from "../../../hooks/usePagination";
import { formatDate } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { Students } from "../../../api/types/student/student";
const TABLE_HEAD = ["Student", "Course", "Status", "Joined", "Actions"];

const MyStudents: React.FC = () => {
  const [students, setStudents] = useState<Students[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(students, ITEMS_PER_PAGE);

  const fetchStudents = async () => {
    try {
      const response = await getMyStudents();
      setStudents(response.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const openEditModal = (student: Students) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleUpdate = async () => {
    try {
      await updateStudent(selectedStudent?._id, selectedStudent);
      toast.success("Student updated successfully");
      fetchStudents(); // Refresh the students list
      closeModal();
    } catch (error) {
      toast.error("Failed to update student");
    }
  };

  const handleAddAssignment = () => {
    if (selectedStudent) {
      const newAssignments = [
        ...selectedStudent.assignments,
        { title: "", points: 0, maxPoints: 0 },
      ];
      setSelectedStudent({ ...selectedStudent, assignments: newAssignments });
    }
  };

  const handleAddQuiz = () => {
    if (selectedStudent) {
      const newQuizzes = [
        ...selectedStudent.quizzes,
        { title: "", score: 0, maxScore: 0 },
      ];
      setSelectedStudent({ ...selectedStudent, quizzes: newQuizzes });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="w-full flex justify-center items-center ">
      <div className="w-11/12 my-12 ">
        <div className="pb-10">
          <Card className="h-full w-full bg-gradient-to-b from-blue-100 to-blue-200">
            <CardHeader
              floated={false}
              shadow={false}
              className="rounded-none bg-gradient-to-b from-blue-100 to-blue-200"
            >
              <div className=" flex items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    Students list
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal">
                    See information about all students
                  </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
              </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={head}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {head}{" "}
                          {index !== TABLE_HEAD.length - 1 && (
                            <ChevronUpDownIcon
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                          )}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData?.map(
                    (
                      {
                        _id,
                        email,
                        firstName,
                        lastName,
                        course,
                        mobile,
                        isBlocked,
                        isGoogleUser,
                        dateJoined,
                        profileUrl,
                        profilePic,
                        assignments,
                        quizzes,
                      },
                      index
                    ) => {
                      const isLast = index === students.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={
                                  isGoogleUser ? profilePic?.url : profileUrl
                                }
                                alt={"image"}
                                size="sm"
                              />
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {firstName + " " + lastName}
                                </Typography>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >
                                  {email}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {course}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Chip
                                variant="ghost"
                                size="sm"
                                value={!isBlocked ? "active" : "blocked"}
                                color={isBlocked ? "red" : "green"}
                              />
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {formatDate(dateJoined)}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Button
                              size="sm"
                              color="blue"
                              onClick={() =>
                                openEditModal({
                                  _id,
                                  email,
                                  firstName,
                                  lastName,
                                  course,
                                  mobile,
                                  isBlocked,
                                  isGoogleUser,
                                  dateJoined,
                                  profileUrl,
                                  profilePic,
                                  assignments: assignments || [],
                                  quizzes: quizzes || [],
                                })
                              }
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <IconButton
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "outlined" : "text"}
                    color="blue-gray"
                    size="sm"
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </IconButton>
                ))}
              </div>
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Dialog open={isModalOpen} handler={closeModal}>
        <DialogHeader>Edit Student</DialogHeader>
        <DialogBody className="h-[32rem] overflow-scroll">
          {selectedStudent && (
            <div className="flex justify-center flex-col">
              {selectedStudent?.assignments.map(
                (assignment: any, index: number) => (
                  <div key={index} className="mb-4 flex flex-col gap-3">
                    <Input
                      label="Assignment Title"
                      className="mb-2"
                      value={assignment.title}
                      onChange={(e) => {
                        const newAssignments = [...selectedStudent.assignments];
                        newAssignments[index].title = e.target.value;
                        setSelectedStudent({
                          ...selectedStudent,
                          assignments: newAssignments,
                        });
                      }}
                    />
                    <Input
                      label="Points"
                      className="mb-2"
                      value={assignment.points}
                      onChange={(e) => {
                        const newAssignments = [...selectedStudent.assignments];
                        newAssignments[index].points = parseInt(
                          e.target.value,
                          10
                        );
                        setSelectedStudent({
                          ...selectedStudent,
                          assignments: newAssignments,
                        });
                      }}
                    />
                    <Input
                      label="Max Points"
                      className="mb-2"
                      value={assignment.maxPoints}
                      onChange={(e) => {
                        const newAssignments = [...selectedStudent.assignments];
                        newAssignments[index].maxPoints = parseInt(
                          e.target.value,
                          10
                        );
                        setSelectedStudent({
                          ...selectedStudent,
                          assignments: newAssignments,
                        });
                      }}
                    />
                  </div>
                )
              )}
              <Button
                onClick={handleAddAssignment}
                color="green"
                className="mb-4"
              >
                Add Assignment
              </Button>
              {selectedStudent?.quizzes.map((quiz: any, index: number) => (
                <div key={index} className="mb-4 flex flex-col gap-3">
                  <Input
                    label="Quiz Title"
                    className="mb-2"
                    value={quiz.title}
                    onChange={(e) => {
                      const newQuizzes = [...selectedStudent.quizzes];
                      newQuizzes[index].title = e.target.value;
                      setSelectedStudent({
                        ...selectedStudent,
                        quizzes: newQuizzes,
                      });
                    }}
                  />
                  <Input
                    label="Score"
                    className="mb-2"
                    value={quiz.score}
                    onChange={(e) => {
                      const newQuizzes = [...selectedStudent.quizzes];
                      newQuizzes[index].score = parseInt(e.target.value, 10);
                      setSelectedStudent({
                        ...selectedStudent,
                        quizzes: newQuizzes,
                      });
                    }}
                  />
                  <Input
                    label="Max Score"
                    className="mb-4"
                    value={quiz.maxScore}
                    onChange={(e) => {
                      const newQuizzes = [...selectedStudent?.quizzes];
                      newQuizzes[index].maxScore = parseInt(e.target.value, 10);
                      setSelectedStudent({
                        ...selectedStudent,
                        quizzes: newQuizzes,
                      });
                    }}
                  />
                </div>
              ))}
              <Button onClick={handleAddQuiz} color="green">
                Add Quiz
              </Button>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default MyStudents;
