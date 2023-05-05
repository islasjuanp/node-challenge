import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Model } from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        UsersService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create: Should be able to create an user', async () => {
    const spy = jest.spyOn(service, 'create').mockResolvedValue(null);

    const requestBody = {
      name: '',
      lastName: '',
      address: '',
      profilePicture: '',
    };
    await controller.create(requestBody);

    expect(service.create).toBeCalledWith(requestBody);
  });

  it('update: Should be able to update an user', async () => {
    const spy = jest.spyOn(service, 'update').mockResolvedValue(null);

    const requestBody = {
      name: '',
      lastName: '',
      address: '',
      profilePicture: '',
    };
    await controller.update('fakeId', requestBody);

    expect(service.update).toBeCalledWith('fakeId', requestBody);
  });

  it('findAll: Should be able to load users', async () => {
    const spy = jest.spyOn(service, 'findAll').mockResolvedValue([]);

    await controller.findAll();

    expect(service.findAll).toBeCalledTimes(1);
  });

  it('findOne: Should be able to load a given users', async () => {
    const spy = jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await controller.findOne('fakeId');

    expect(service.findOne).toBeCalledWith('fakeId');
  });
});
