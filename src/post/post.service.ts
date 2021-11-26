import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from '../course/course.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PostEntity } from './post.entity';
import { postDTO } from './dtos/post.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { UserCourseEntity } from '../user-course/user-course.entity';
import { CommentEntity } from '../comment/comment.entity';
import { postQualifiedDTO } from './dtos/postQualified.dto';
import {
  NotificationEntity,
  NOTIFICATION_TYPE,
} from '../notification/notification.entity';
import { PostFileEntity } from '../file/post-file/post-file.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserCourseEntity)
    private userCourseRepository: Repository<UserCourseEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(PostFileEntity)
    private postFileRepository: Repository<PostFileEntity>,
  ) {}

  /*async seed(){
        const curso1 = this.courseRepository.create({
            vacancies: 40,
            desc: 'Este es el curso de prueba',
            start_date: '2021-10-01T06:30:00',
            end_date: '2021-11-15T15:45:56',
        })
        await this.courseRepository.save(curso1);

        const post1 = this.postRepository.create({
            text: 'Esta es una publicación :)'
        });
        post1.course = curso1;
        await this.postRepository.save(post1);
        const post2 = this.postRepository.create({
            text: 'Esta también es una publicación :)'
        });
        post2.course = curso1;
        await this.postRepository.save(post2);
        const post3 = this.postRepository.create({
            text: 'Esta también es una publicación :)'
        });
        post3.course = curso1;
        await this.postRepository.save(post3);
    }*/

  async findAll(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async findAllCoursePostsById(
    user_id: number,
    course_id: number,
  ): Promise<PostEntity[]> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    const userCourse = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .getCount();
    if (course.teacher.id == user_id || userCourse > 0) {
      //Borré esto: .leftJoinAndSelect('post.comments', 'comments')
      return await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.files', 'files')
        .where('post.course_id = :courseId', { courseId: course_id })
        .getMany();
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  async create(
    user_id: number,
    course_id: number,
    data: Partial<postDTO>,
  ): Promise<PostEntity> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    const userCourse = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .getCount();
    if (course.teacher.id == user_id || userCourse > 0) {
      const user = await this.userRepository.findOneOrFail(user_id);
      const postToCreate = this.postRepository.create({
        text: data.text,
      });
      postToCreate.course = course;
      postToCreate.user = user;
      const post = await this.postRepository.save(postToCreate);
      if (data.files) {
        for (const file of data.files) {
          const fileToCreate = this.postFileRepository.create();
          fileToCreate.post = post;
          fileToCreate.key = file;
          await this.postFileRepository.save(fileToCreate);
        }
      }
      return await this.postRepository.findOne(post.id, {
        relations: ['files'],
      });
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  async findCoursePostById(
    user_id: number,
    course_id: number,
    post_id: number,
  ): Promise<PostEntity> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    const userCourse = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .getCount();
    if (course.teacher.id == user_id || userCourse > 0) {
      return await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.files', 'files')
        .where('post.id = :postId', { postId: post_id })
        .andWhere('post.course_id = :courseId', { courseId: course_id })
        .getOneOrFail();
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  async updateCoursePostById(
    user_id: number,
    course_id: number,
    post_id: number,
    data: Partial<postDTO>,
  ): Promise<{
    message: string;
    updated: boolean;
  }> {
    //await this.postRepository.update(id, data);
    const post = await this.postRepository.findOneOrFail(post_id, {
      relations: ['user'],
    });
    const userCourse = await this.userCourseRepository
      .createQueryBuilder('user_course')
      .where('user_course.user_id = :userId', { userId: user_id })
      .andWhere('user_course.course_id = :courseId', { courseId: course_id })
      .getCount();
    if (post.user.id == user_id) {
      const updateRes: UpdateResult = await this.postRepository.update(
        post_id,
        { text: data.text },
      );
      if (data.files) {
        for (const file of data.files) {
          const fileToCreate = this.postFileRepository.create();
          fileToCreate.post = post;
          fileToCreate.key = file;
          await this.postFileRepository.save(fileToCreate);
        }
      }
      if (updateRes.affected > 0) {
        //const studentScore = this.countPostAndCommentsPoints(user_id, course_id);
        return {
          message: `El post ${post_id} del curso ${course_id} ha sido actualizado correctamente`,
          updated: true,
        };
      }
      return {
        message: `El post ${post_id} del curso ${course_id} no pudo ser actualizado`,
        updated: false,
      };
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  async updateCoursePostQualificationById(
    user_id: number,
    course_id: number,
    post_id: number,
    data: postQualifiedDTO,
  ): Promise<{
    message: string;
    updated: boolean;
  }> {
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    if (course.teacher.id == user_id) {
      const post = await this.postRepository.findOneOrFail(post_id, {
        relations: ['user'],
      });
      if (post.user.id == course.teacher.id) {
        return {
          message: `El profesor del curso no puede calificar sus propias publicaciones`,
          updated: false,
        };
      }
      const updateRes: UpdateResult = await this.postRepository.update(
        post_id,
        data,
      );
      if (updateRes.affected > 0) {
        const sc = await this.countPostAndCommentsPoints(
          post.user.id,
          course_id,
        );
        await this.userCourseRepository
          .createQueryBuilder()
          .update('user_course')
          .set({ score: sc })
          .where('user_course.user_id = :userId', { userId: post.user.id })
          .andWhere('user_course.course_id = :courseId', {
            courseId: course_id,
          })
          .execute();
        // Crear Notificación
        await this.notificationRepository.save({
          post,
          user: post.user,
          text: `Tu publicación ha sido calificada`,
          type: NOTIFICATION_TYPE.COMMENT,
        });
        return {
          message: `La calificación del post ${post_id} ha sido actualizada correctamente (${data.qualified})`,
          updated: true,
        };
      }
      return {
        message: `La calificación del post ${post_id} no pudo ser actualizada`,
        updated: false,
      };
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  async deleteCoursePostById(
    user_id: number,
    course_id: number,
    post_id: number,
  ): Promise<{
    message: string;
    deleted: boolean;
  }> {
    //await this.postRepository.delete(id);
    const course = await this.courseRepository.findOneOrFail(course_id, {
      relations: ['teacher'],
    });
    const post = await this.postRepository.findOneOrFail(post_id, {
      relations: ['user'],
    });
    if (course.teacher.id == user_id || post.user.id == user_id) {
      /*const deleteRes: DeleteResult = await this.postRepository
            .createQueryBuilder()
            .delete()
            .from('post')
            .where('post.id = :postId', {postId: post_id})
            .andWhere('post.course_id = :courseId', {courseId: course_id})
            .andWhere('post.user_id = :userId', {userId: user_id})
            .execute();*/
      const deleteRes: DeleteResult = await this.postRepository.delete(post_id);
      if (deleteRes.affected > 0) {
        return {
          message: `El post ${post_id} del curso ${course_id} ha sido eliminado correctamente`,
          deleted: true,
        };
      }
      return {
        message: `El post ${post_id} del curso ${course_id} no pudo ser eliminado`,
        deleted: false,
      };
    } else {
      throw new UnauthorizedException(
        'Usuario no autorizado para esta operación',
      );
    }
  }

  /*
    async findPostCourseById(id: number): Promise<CourseEntity>{
        const post = await this.postRepository.findOneOrFail(id, {
            relations: ['course']
        });
        return post.course;
    }
    */

  /******************FUNCTIONS*********************/

  async countPostAndCommentsPoints(
    user_id: number,
    course_id: number,
  ): Promise<number> {
    const posts: number = await this.postRepository
      .createQueryBuilder('post')
      .where('post.user_id = :userId', { userId: user_id })
      .andWhere('post.course_id = :courseId', { courseId: course_id })
      .andWhere('post.qualified = :value', { value: true })
      .getCount();
    const comments: number = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.user_id = :userId', { userId: user_id })
      .andWhere('comment.qualified = :value', { value: true })
      .andWhere('post.course_id = :courseId', { courseId: course_id })
      .getCount();
    /*const commentsFiltered: CommentEntity[] = [];
        posts[0].forEach(post => {
            comments.forEach(comment => {
                if(post.id == comment.post.id){
                    commentsFiltered.push(comment);
                }
            });
        });*/
    /*for(let post of posts[0]){
            for(let comment of commentsRaw){
                if(post.id == comment.post.id){
                    commentsFiltered.push(comment);
                }
            }
        }*/
    return posts + comments;
  }
}
