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

  async updateSeen(userId: number): Promise<{
    message: string;
    updated: boolean;
  }> {
    const notifications = (await this.getUnseen(userId)).map(
      (notification) => notification.id,
    );

    if (notifications.length < 1) {
      return {
        message: 'No hay notificaciones por actualizar',
        updated: false,
      };
    }

    const res = await this.notificationRepository.update(notifications, {
      seen: true,
    });

    if (res.affected < 0) {
      return {
        message: 'Las notificaciones no pudieron ser actualizadas',
        updated: false,
      };
    }

    return {
      message: 'Las notificaciones fueron actualizadas',
      updated: true,
    };
  }
}
