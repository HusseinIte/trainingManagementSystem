import { Test, TestingModule } from '@nestjs/testing';
import { TeacherGradeController } from './teacher-grade.controller';

describe('TeacherGradeController', () => {
  let controller: TeacherGradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherGradeController],
    }).compile();

    controller = module.get<TeacherGradeController>(TeacherGradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
