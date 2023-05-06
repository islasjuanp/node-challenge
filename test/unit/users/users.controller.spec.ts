import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';

import { User } from '../../../src/users/entities/user.schema';
import { Model } from 'mongoose';
import { ImageService } from '../../../src/users/image.service';
import { Image } from '../../../src/users/entities/image.schema';
import { MockImageService } from './image.service.mock';
import { getFakeFile, getFakeImage, getRandomRequest } from './data.utils';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: ImageService,
          useValue: new MockImageService(),
        },
        UsersService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create: Should be able to create an user', async () => {
    const image: Image = getFakeImage();
    const userCreateSpy = jest
      .spyOn(userService, 'create')
      .mockResolvedValue(null);
    const imageUploadSpy = jest
      .spyOn(imageService, 'upload')
      .mockResolvedValue(image);

    const testFile = getFakeFile();

    const requestBody = getRandomRequest();
    await controller.create(requestBody, testFile);

    expect(userService.create).toBeCalledWith(requestBody, image);
  });

  it('update: Should be able to update an user', async () => {
    const spy = jest.spyOn(userService, 'update').mockResolvedValue(null);

    const requestBody = getRandomRequest();
    await controller.update('fakeId', requestBody);

    expect(userService.update).toBeCalledWith('fakeId', requestBody);
  });

  it('findAll: Should be able to load users', async () => {
    const spy = jest.spyOn(userService, 'findAll').mockResolvedValue([]);

    await controller.findAll();

    expect(userService.findAll).toBeCalledTimes(1);
  });

  it('findOne: Should be able to load a given users', async () => {
    const spy = jest.spyOn(userService, 'findOne').mockResolvedValue(null);

    await controller.findOne('fakeId');

    expect(userService.findOne).toBeCalledWith('fakeId');
  });
});
