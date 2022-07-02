import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getNotifications(
    @User() { id }: UserEntity,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getUnseen(id);
  }

  @Put()
  @UseGuards(AuthGuard())
  async updateNotifications(@User() { id }: UserEntity): Promise<{
    message: string;
    updated: boolean;
  }> {
    return this.notificationService.updateSeen(id);
  }
}
