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
import {
  ApiConsumes,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiSecurity('basic')
@UseGuards(AuthGuard('local'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized Request.' })
  @UseInterceptors(FileInterceptor('profilePicture'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(new ImageValidatorPipe({ isRequired: true }))
    file: Express.Multer.File,
  ) {
    const image = await this.imageService.upload(file);
    return this.usersService.create(createUserDto, image);
  }

  @Get()
  @ApiConsumes('application/json')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Returns users information.' })
  @ApiResponse({ status: 401, description: 'Unauthorized Request.' })
  findAll(@Query() query: PaginationDTO) {
    return this.usersService.findAll(query.page, query.pageSize);
  }

  @Get(':id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'Returns user information.' })
  @ApiResponse({ status: 401, description: 'Unauthorized Request.' })
  @ApiResponse({ status: 404, description: 'User was not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':id/image')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'Returns user image.' })
  @ApiResponse({ status: 401, description: 'Unauthorized Request.' })
  @ApiResponse({ status: 404, description: 'User image was not found' })
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
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized Request.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(new ImageValidatorPipe({ isRequired: false }))
    file: Express.Multer.File,
  ) {
    if (file) {
      const image = await this.imageService.upload(file);
      return this.usersService.update(id, updateUserDto, image);
    }

    return this.usersService.update(id, updateUserDto);
  }
}
