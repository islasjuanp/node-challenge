import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Image } from './entities/image.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto, profilePicture: Image) {
    const createdUser = new this.userModel({
      ...createUserDto,
      profilePicture,
    });
    return createdUser.save();
  }

  findAll(page: number = 1, pageSize: number = 10) {
    return this.userModel.find(
      {},
      {},
      { sort: { _id: 1 }, skip: (page - 1) * pageSize, limit: pageSize },
    );
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto, profilePicture?: Image) {
    const update = profilePicture ? {...updateUserDto, profilePicture } : updateUserDto

    return this.userModel.findOneAndUpdate({ id }, update);
  }
}
