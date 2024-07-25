import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CreateLessonInterface } from '../../../types/lesson';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';
import { QuizDbInterface } from '@src/app/repositories/quizDbRepository';
import { LessonDbRepositoryInterface } from '@src/app/repositories/lessonDbRepository';
import * as ffprobePath from 'ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

export const addLessonsU = async (
  media: Express.Multer.File[] | any | undefined,
  courseId: string | undefined,
  instructorId: string | undefined,
  lesson: CreateLessonInterface,
  lessonDbRepository: ReturnType<LessonDbRepositoryInterface>,
  cloudService: ReturnType<CloudServiceInterface>,
  quizDbRepository: ReturnType<QuizDbInterface>
) => {
  if (!courseId) {
    throw new AppError(
      'Please provide a course id',
      HttpStatusCodes.BAD_REQUEST
    );
  }

  if (!instructorId) {
    throw new AppError(
      'Please provide an instructor id',
      HttpStatusCodes.BAD_REQUEST
    );
  }

  if (!lesson) {
    throw new AppError('Data is not provided', HttpStatusCodes.BAD_REQUEST);
  }

  //   const tempFilePath = './temp_video.mp4';
  //   const videoFile = media[0];

  const getVideoDuration = (filePath: string) =>
    new Promise<any>((resolve, reject) => {
      ffmpeg(filePath)
        .setFfprobePath(ffprobePath.path)
        .ffprobe((err, data) => {
          if (err) {
            console.error('Error while probing the video:', err);
            reject(err);
          } else {
            resolve(data.format.duration);
          }
        });
    });

  let mediaData = [];

  if (media?.length > 0) {
    try {
      const mediaPromises = media.map(async (file: Express.Multer.File) => {
        const tempFilePath = file.path;
        const duration = await getVideoDuration(tempFilePath);
        fs.unlinkSync(tempFilePath); // Cleanup temporary file
        return {
          originalName: file.originalname,
          mimeType: file.mimetype,
          duration
        };
      });

      mediaData = await Promise.all(mediaPromises);

      // Calculate total duration if multiple files are provided
      const totalDuration = mediaData.reduce(
        (acc, curr) => acc + curr.duration,
        0
      );
      lesson.duration = totalDuration;
      lesson.media = mediaData;
    } catch (error) {
      console.error('Error while getting video duration:', error);
    }
  }

  const lessonId = await lessonDbRepository.addLesson(
    courseId,
    instructorId,
    lesson
  );
  if (!lessonId) {
    throw new AppError('Data is not provided', HttpStatusCodes.BAD_REQUEST);
  }
  const quiz = {
    courseId,
    lessonId: lessonId.toString(),
    questions: lesson.questions
  };
  await quizDbRepository.addQuiz(quiz);
};
