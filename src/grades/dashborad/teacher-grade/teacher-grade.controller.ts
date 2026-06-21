import { Body, Controller, Param, Post, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';
import { Roles } from 'auth/authorization/roles.decorator';
import { RolesGuard } from 'auth/authorization/roles.guard';
import { TeacherAddGradeDto } from '../../dto/teacher-add-grade.dto';
import { TeacherUpdateGradeDto } from '../../dto/teacher-update-grade.dto';
import { TeacherGradeService } from './teacher-grade.service';

@Controller('teachers/me')
export class TeacherGradeController {
  constructor(private readonly teacherGradeService: TeacherGradeService) {}

  @Post('courses/:courseId/enrollments/:enrollmentId/grade')
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

  @Post('grades/:gradeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  updateGrade(
    @Req() req: any,
    @Param('gradeId') gradeId: string,
    @Body() dto: TeacherUpdateGradeDto,
  ) {
    return this.teacherGradeService.updateGrade(req.user?.id, gradeId, dto);
  }

  @Get('courses/:courseId/grades')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  getGradesForCourse(
    @Req() req: any,
    @Param('courseId') courseId: string,
  ) {
    return this.teacherGradeService.getGradesForCourse(req.user.id, courseId);
  }
}

