import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { UsersModule } from 'users/users.module';
import { CoursesModule } from './courses/courses.module';
import { CategoriesModule } from './categories/categories.module';
import { GradesModule } from './grades/grades.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { AuthModule } from 'auth/auth.module';
import { StatisticsModule } from 'statistics/statistics.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/training_db',
    ),
    AuthModule,
    UsersModule,
    CoursesModule,
    CategoriesModule,
    GradesModule,
    EnrollmentModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
