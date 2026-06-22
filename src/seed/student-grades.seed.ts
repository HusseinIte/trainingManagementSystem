import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import {
  Course,
  CourseSchema,
  CourseStatus,
} from '../courses/schemas/course.schema';
import {
  Enrollment,
  EnrollmentSchema,
} from '../enrollment/schemas/enrollment.schema';
import { Grade, GradesSchema } from '../grades/schemas/grade.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/training_db';

const STUDENT_EMAIL = 'student.grades@example.com';
const STUDENT_PASSWORD = 'Student@123';
const TEACHER_EMAIL = 'teacher.grades@example.com';
const CATEGORY_NAME = 'Programming';

async function seedStudentGrades() {
  await mongoose.connect(MONGODB_URI);

  const UserModel: Model<User> = mongoose.model<User>(User.name, UserSchema);
  const CategoryModel: Model<Category> = mongoose.model<Category>(
    Category.name,
    CategorySchema,
  );
  const CourseModel: Model<Course> = mongoose.model<Course>(
    Course.name,
    CourseSchema,
  );
  const EnrollmentModel: Model<Enrollment> = mongoose.model<Enrollment>(
    Enrollment.name,
    EnrollmentSchema,
  );
  const GradeModel: Model<Grade> = mongoose.model<Grade>('Grades', GradesSchema);

  const hashedPassword = await bcrypt.hash(STUDENT_PASSWORD, 10);

  const [student, teacher, category] = await Promise.all([
    UserModel.findOneAndUpdate(
      { email: STUDENT_EMAIL },
      {
        full_name: 'Student Grades Demo',
        email: STUDENT_EMAIL,
        password: hashedPassword,
        phone: '+963900000001',
        status: 'ACTIVE',
        role: 'student',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
    UserModel.findOneAndUpdate(
      { email: TEACHER_EMAIL },
      {
        full_name: 'Teacher Grades Demo',
        email: TEACHER_EMAIL,
        password: await bcrypt.hash('Teacher@123', 10),
        phone: '+963900000002',
        status: 'ACTIVE',
        role: 'teacher',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
    CategoryModel.findOneAndUpdate(
      { name: CATEGORY_NAME },
      {
        name: CATEGORY_NAME,
        description: 'Seeded category for student grades demo',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
  ]);

  if (!student || !teacher || !category) {
    throw new Error('Failed to prepare student seed dependencies');
  }

  const coursePayloads = [
    {
      title: 'Node.js Fundamentals',
      description: 'Backend fundamentals with Node.js',
      price: 120,
      capacity: 20,
      start_date: new Date('2026-05-01T00:00:00.000Z'),
      end_date: new Date('2026-05-25T00:00:00.000Z'),
      status: CourseStatus.COMPLETED,
      grade_value: 95,
      result: 'PASSED',
      notes: 'Excellent understanding of backend basics',
    },
    {
      title: 'MongoDB for Applications',
      description: 'Practical data modeling and queries',
      price: 110,
      capacity: 20,
      start_date: new Date('2026-04-01T00:00:00.000Z'),
      end_date: new Date('2026-04-20T00:00:00.000Z'),
      status: CourseStatus.COMPLETED,
      grade_value: 88,
      result: 'PASSED',
      notes: 'Very good project and clean queries',
    },
    {
      title: 'Algorithms Basics',
      description: 'Problem solving and core algorithms',
      price: 100,
      capacity: 20,
      start_date: new Date('2026-03-01T00:00:00.000Z'),
      end_date: new Date('2026-03-18T00:00:00.000Z'),
      status: CourseStatus.COMPLETED,
      grade_value: 67,
      result: 'FAILED',
      notes: 'Needs more practice in problem decomposition',
    },
  ] as const;

  for (const payload of coursePayloads) {
    const course = await CourseModel.findOneAndUpdate(
      { title: payload.title, teacher_id: teacher._id },
      {
        category_id: category._id,
        teacher_id: teacher._id,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        capacity: payload.capacity,
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: payload.status,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const enrollment = await EnrollmentModel.findOneAndUpdate(
      { student_id: student._id, course_id: course._id },
      {
        student_id: student._id,
        course_id: course._id,
        status: 'ACCEPTED',
        requested_date: payload.start_date,
        accepted_date: payload.start_date,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await GradeModel.findOneAndUpdate(
      { enrollment_id: enrollment._id },
      {
        enrollment_id: enrollment._id,
        grade_value: payload.grade_value,
        result: payload.result,
        notes: payload.notes,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  console.log(`Student grades seeded for: ${STUDENT_EMAIL}`);
  console.log(`Password: ${STUDENT_PASSWORD}`);

  await mongoose.disconnect();
}

seedStudentGrades().catch(async (error) => {
  console.error('Failed to seed student grades:', error);
  await mongoose.disconnect();
  process.exit(1);
});
