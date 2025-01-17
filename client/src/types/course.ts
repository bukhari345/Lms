export interface CourseInterface {
  _id: string;
  title: string;
  instructorId: string;
  duration: number;
  category: string;
  level: string;
  tags: string[];
  price: number;
  about: string;
  description: string;
  introduction: string;
  syllabus: string[];
  requirements: string[];
  thumbnail: string;
  guidelines: string;
  coursesEnrolled: any[];
  rating: number;
  isVerified: boolean;
  completionStatus: number;
  createdAt: string;
  isPaid: boolean;
  __v: number;
}

export interface Media {
  key: string;
  name: string;
  _id: string;
}
