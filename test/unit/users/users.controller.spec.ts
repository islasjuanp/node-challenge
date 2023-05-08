import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';

import { User, UserDocument } from '../../../src/users/entities/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ImageService } from '../../../src/users/image.service';
import { Image, ImageDocument } from '../../../src/users/entities/image.schema';
import { MockImageService } from './image.service.mock';
import { getFakeFile, getFakeImage, getRandomRequest } from './data.utils';
import { NotFoundException } from '@nestjs/common';
import { createMockResponse } from '../../utils/express.util';

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
          useValue: { Model },
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
    jest.spyOn(userService, 'create').mockResolvedValue(null);
    jest.spyOn(imageService, 'upload').mockResolvedValue(image);

    const testFile = getFakeFile();

    const requestBody = getRandomRequest();
    await controller.create(requestBody, testFile);

    expect(userService.create).toBeCalledWith(requestBody, image);
  });

  it('update: Should be able to update an user (without image)', async () => {
    jest.spyOn(userService, 'update').mockResolvedValue(null);
    const requestBody = getRandomRequest();
    await controller.update('fakeId', requestBody, null);

    expect(userService.update).toBeCalledWith('fakeId', requestBody);
  });

  it('update: Should be able to update an user (with image)', async () => {
    const requestBody = getRandomRequest();
    const imageFile = getFakeFile();
    const image = getFakeImage() as ImageDocument;
    jest.spyOn(userService, 'update').mockResolvedValue(null);
    jest.spyOn(imageService, 'upload').mockResolvedValue(image);

    await controller.update('fakeId', requestBody, imageFile);

    expect(userService.update).toBeCalledWith('fakeId', requestBody, image);
    expect(imageService.upload).toBeCalledWith(imageFile);
  });

  it('findAll: Should be able to load users (page 1)', async () => {
    jest.spyOn(userService, 'findAll').mockResolvedValue([]);

    await controller.findAll({ page: 1, pageSize: 10 });

    expect(userService.findAll).toBeCalledTimes(1);
  });

  it('findOne: Should throw  NotFound exception when user %o', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue(null);

    expect(controller.findOne('fakeId')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(userService.findOne).toBeCalledWith('fakeId');
  });

  it('findImage: Should return the image for a given user', async () => {
    const response = createMockResponse();
    const imageId = new ObjectId('123456789012');
    const user = {
      name: 'John',
      lastName: 'Doe',
      address: 'Fake Street 123',
      profilePicture: {
        _id: imageId,
        filename: '',
        contentType: '',
        length: 0,
        uploadDate: new Date(),
      },
    };
    jest.spyOn(userService, 'findOne').mockResolvedValue(user as UserDocument);
    jest
      .spyOn(imageService, 'download')
      .mockResolvedValue(Buffer.from('fake buffer image'));

    controller.findImage('fakeId', response);

    expect(userService.findOne).toBeCalledWith('fakeId');
  });

  test.each([
    null,
    {},
    { name: 'John', lastName: 'Doe', address: 'Fake Street 123' },
  ])(
    'findImage: Should throw  NotFound exception when user %o has no picture',
    async (user) => {
      const response = createMockResponse();
      jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user as UserDocument);

      expect(controller.findImage('fakeId', response)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(userService.findOne).toBeCalledWith('fakeId');
    },
  );

  it('findImage: Should throw  NotFound exception when image is not found', async () => {
    const response = createMockResponse();
    const imageId = new ObjectId('123456789012');
    const user = {
      name: 'John',
      lastName: 'Doe',
      address: 'Fake Street 123',
      profilePicture: {
        _id: imageId,
        filename: '',
        contentType: '',
        length: 0,
        uploadDate: new Date(),
      },
    };
    jest.spyOn(userService, 'findOne').mockResolvedValue(user as UserDocument);
    jest.spyOn(imageService, 'download').mockResolvedValue(null);

    expect(controller.findImage('fakeId', response)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(userService.findOne).toBeCalledWith('fakeId');
  });
});
