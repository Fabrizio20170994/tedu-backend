import { Test, TestingModule } from '@nestjs/testing';
import { UserAttendanceService } from './user-attendance.service';

describe('UserAttendanceService', () => {
  let service: UserAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAttendanceService],
    }).compile();

    service = module.get<UserAttendanceService>(UserAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
