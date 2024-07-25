import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { CreateLessonInterface } from '../../../types/lesson';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';
import { QuizDbInterface } from '@src/app/repositories/quizDbRepository';
import { LessonDbRepositoryInterface } from '@src/app/repositories/lessonDbRepository';
import * as ffprobePath from 'ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import path from 'path';

export const editLessonsU = async (
  media: Express.Multer.File[] | undefined,
  lessonId: string,
  lesson: CreateLessonInterface,
  lessonDbRepository: ReturnType<LessonDbRepositoryInterface>,
  cloudService: ReturnType<CloudServiceInterface>,
  quizDbRepository: ReturnType<QuizDbInterface>
) => {
  if (!lesson) {
    throw new AppError('Data is not provided', HttpStatusCodes.BAD_REQUEST);
  }

  let isStudyMaterialUpdated = false,
    isLessonVideoUpdated = false;

  const oldLesson = await lessonDbRepository.getLessonById(lessonId);

  const getVideoDuration = (filePath: string) =>
    new Promise<number>((resolve, reject) => {
      ffmpeg(filePath)
        .setFfprobePath(ffprobePath.path)
        .ffprobe((err, data) => {
          if (err) {
            console.error('Error while probing the video:', err);
            reject(err);
          } else {
            if (
              !data ||
              !data.format ||
              typeof data.format.duration !== 'number'
            ) {
              reject(new Error('No valid duration found in video metadata'));
            } else {
              resolve(data.format.duration);
            }
          }
        });
    });

  if (media?.length) {
    try {
      const videoFile = media.find((file) =>
        file.mimetype.startsWith('video/')
      );
      if (videoFile) {
        const tempFilePath = path.join(__dirname, 'temp_video.mp4');
        fs.writeFileSync(tempFilePath, videoFile.buffer);

        const videoDuration = await getVideoDuration(tempFilePath);
        fs.unlinkSync(tempFilePath); // Cleanup temporary file

        lesson.duration = videoDuration;
        isLessonVideoUpdated = true;
      }
    } catch (error) {
      console.error('Error while getting video duration:', error);
    }
  }

  lesson.media = [];

  if (media && media.length > 0) {
    const uploadPromises = media.map(async (file) => {
      if (file.mimetype === 'application/pdf') {
        const studyMaterial = `http://localhost:${process.env.PORT}/${file.filename}`;
        const data = { name: 'materialFile', key: studyMaterial };
        lesson.media.push(data);
        isStudyMaterialUpdated = true;
      } else {
        const lessonVideo = `http://localhost:${process.env.PORT}/${file.filename}`;
        const data = { name: 'lessonVideo', key: lessonVideo };
        lesson.media.push(data);
        isLessonVideoUpdated = true;
      }
    });

    await Promise.all(uploadPromises);
  }

  const response = await lessonDbRepository.editLesson(lessonId, lesson);
  if (!response) {
    throw new AppError('Failed to edit lesson', HttpStatusCodes.BAD_REQUEST);
  }

  await quizDbRepository.editQuiz(lessonId, { questions: lesson.questions });

  if (response) {
    if (isLessonVideoUpdated && oldLesson?.media) {
      const videoObject = response.media.find(
        (item: any) => item.name === 'lessonVideo'
      );
      if (videoObject) {
        // await cloudService.removeFile(videoObject.key);
      }
    }

    if (isStudyMaterialUpdated && oldLesson?.media) {
      const materialObject = response.media.find(
        (item: any) => item.name === 'materialFile'
      );
      if (materialObject) {
        // await cloudService.removeFile(materialObject.key);
      }
    }
  }
};
