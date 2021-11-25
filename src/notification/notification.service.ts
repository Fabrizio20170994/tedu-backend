import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async getUnseen(userId: number): Promise<NotificationEntity[]> {
    const user = await this.userRepository.findOne(userId);

    return await this.notificationRepository.find({
      where: { user, seen: false },
      relations: ['message', 'post', 'comment'],
      order: { created: 'DESC' },
    });
  }
}
