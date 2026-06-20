import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';
import { RolesGuard } from 'auth/authorization/roles.guard';
import { Roles } from 'auth/authorization/roles.decorator';
import { StatisticsService } from './statistics.service';

@Controller('admin/statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('teachers')
  async getTeacherStatistics() {
    return {
      status: 'success',
      data: await this.statisticsService.getTeacherStatistics(),
    };
  }

  @Get('enrollments')
  async getEnrollmentStatistics(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const { data, total } =
      await this.statisticsService.getEnrollmentStatistics(from, to);

    return {
      status: 'success',
      period: {
        from: from ?? null,
        to: to ?? null,
      },
      data,
      total,
    };
  }

  @Get('courses')
  async getCourseStatistics(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const stats = await this.statisticsService.getCourseStatistics(from, to);

    return {
      status: 'success',
      period: {
        from: from ?? null,
        to: to ?? null,
      },
      data: stats.data,
      total: stats.total,
    };
  }

  @Get('summary')
  async getSummaryStatistics() {
    return {
      status: 'success',
      data: await this.statisticsService.getSummaryStatistics(),
    };
  }
}
