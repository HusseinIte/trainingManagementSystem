import { Test, TestingModule } from '@nestjs/testing';
import { TeacherGradeService } from './teacher-grade.service';

describe('TeacherGradeService', () => {
  let service: TeacherGradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherGradeService],
    }).compile();

    service = module.get<TeacherGradeService>(TeacherGradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
