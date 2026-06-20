import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/training_db';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'Admin User';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+10000000000';

async function seedAdmin() {
  await mongoose.connect(MONGODB_URI);

  const UserModel: Model<User> = mongoose.model<User>(User.name, UserSchema);

  const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await UserModel.create({
    full_name: ADMIN_FULL_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    phone: ADMIN_PHONE,
    status: 'ACTIVE',
    role: 'admin',
  });

  console.log(`Admin user seeded: ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user:', error);
  process.exit(1);
});
