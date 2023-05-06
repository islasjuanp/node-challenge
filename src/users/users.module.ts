import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { ImageService } from './image.service';
import { MulterModule } from '@nestjs/platform-express';
import { Image, ImageSchema } from './entities/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    MulterModule.register({
      dest: '/tmp/uploads',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ImageService],
})
export class UsersModule {}
