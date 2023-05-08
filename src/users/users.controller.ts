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
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageValidatorPipe } from './image.validator';
import { PaginationDTO } from './dto/pagination.dto';

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
  findAll(@Query() query: PaginationDTO) {
    return this.usersService.findAll(query.page, query.pageSize);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':id/image')
  async findImage(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);

    if (!user || !user.profilePicture) {
      throw new NotFoundException('Image not found');
    }

    const profilePicture = await this.imageService.download(
      user.profilePicture._id,
    );

    if (!profilePicture) {
      throw new NotFoundException('Image not found');
    }

    res.set('Content-Type', 'image/png');
    res.send(profilePicture);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
