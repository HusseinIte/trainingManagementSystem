import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';
import { Roles } from 'auth/authorization/roles.decorator';
import { RolesGuard } from 'auth/authorization/roles.guard';
import { TeacherAddGradeDto } from '../../dto/teacher-add-grade.dto';
import { TeacherGradeService } from './teacher-grade.service';

@Controller('teachers/me/courses/:courseId/enrollments/:enrollmentId')
export class TeacherGradeController {
  constructor(private readonly teacherGradeService: TeacherGradeService) {}

  @Post('grade')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  createGrade(
    @Req() req: any,
    @Param('courseId') courseId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: TeacherAddGradeDto,
  ) {
    return this.teacherGradeService.addGrade(
      req.user?.id,
      courseId,
      enrollmentId,
      dto,
    );
  }
}
