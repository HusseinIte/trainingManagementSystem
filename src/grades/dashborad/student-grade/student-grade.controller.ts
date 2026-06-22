import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/authentication/jwt-auth.guard';
import { CurrentUser } from '../../../auth/common/decorators/current-user.decorator';
import { Roles } from '../../../auth/authorization/roles.decorator';
import { RolesGuard } from '../../../auth/authorization/roles.guard';
import { GradesService } from '../../grades.service';

@Controller('students/me')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentGradeController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('grades')
  @Roles('student')
  getMyGrades(@CurrentUser('id') studentId: string) {
    return this.gradesService.getStudentGrades(studentId);
  }
}
