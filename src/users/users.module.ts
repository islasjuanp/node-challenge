import { Module } from '@nestjs/common';
import { GridFSBucket } from 'mongodb';
import { Connection } from 'mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
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
  providers: [
    UsersService,
    ImageService,
    {
      provide: GridFSBucket,
      useFactory: (connection: Connection): GridFSBucket => {
        return new GridFSBucket(connection.db, { bucketName: 'uploads' });
      },
      inject: [getConnectionToken()],
    },
  ],
})
export class UsersModule {}
