import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageValidatorPipe } from './image.validator';

@Controller('users')
@UseGuards(AuthGuard('local'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(new ImageValidatorPipe()) file: Express.Multer.File,
  ) {
    const image = await this.imageService.upload(file);
    return this.usersService.create(createUserDto, image);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/image')
  async findImage(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    const profilePicture = await this.imageService.download(
      user.profilePicture._id,
    );

    res.set('Content-Type', 'image/png');
    res.send(profilePicture);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
