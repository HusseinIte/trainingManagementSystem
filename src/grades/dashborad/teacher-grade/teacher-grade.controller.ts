import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/authentication/jwt-auth.guard';
import { Roles } from '../../../auth/authorization/roles.decorator';
import { RolesGuard } from '../../../auth/authorization/roles.guard';
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
    @Req() req: { user?: { id?: string } },
    @Param('courseId') courseId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: TeacherAddGradeDto,
  ) {
    const teacherId = req.user?.id;
    return this.teacherGradeService.addGrade(
      teacherId as string,
      courseId,
      enrollmentId,
      dto,
    );
  }

  @Put('grades/:gradeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  updateGrade(
    @Req() req: { user?: { id?: string } },
    @Param('gradeId') gradeId: string,
    @Body() dto: TeacherUpdateGradeDto,
  ) {
    const teacherId = req.user?.id;
    return this.teacherGradeService.updateGrade(
      teacherId as string,
      gradeId,
      dto,
    );
  }

  @Get('courses/:courseId/grades')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  getGradesForCourse(
    @Req() req: { user?: { id?: string } },
    @Param('courseId') courseId: string,
  ) {
    const teacherId = req.user?.id;
    return this.teacherGradeService.getGradesForCourse(
      teacherId as string,
      courseId,
    );
  }
}
