import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { AuthSchema } from '../src/auth/entities/auth.schema';
import { UserSchema } from '../src/users/entities/user.schema';

async function seedDatabase() {
  const uri = process.env.MONGO_URI;
  const client = await mongoose.connect(uri);

  const AuthModel = mongoose.model('auths', AuthSchema);
  const UserModel = mongoose.model('users', UserSchema);
  const auth = await AuthModel.create({
    username: 'user1',
    // password: 'password'
    password: '$2b$10$FJd6N6l/s/uMuflEoCFyuuS9B.c0MZ7yGsU/CCoFRU4jcfRy8cYB6',
  });
  await auth.save();

  for (let i = 1; i < 100; i++) {
    const user = await UserModel.create({
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: faker.address.streetAddress(),
    });
    await user.save();
  }
}

seedDatabase()
  .then(() => {
    console.log('Seed was executed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
