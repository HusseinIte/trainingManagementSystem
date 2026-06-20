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
import { AuthModule } from './auth/auth.module';
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { CategoriesController } from 'categories/categories.controller';
// import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/training_db',
    ),
    UsersModule,
    CoursesModule,
    CategoriesModule,
    GradesModule,
    EnrollmentModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
