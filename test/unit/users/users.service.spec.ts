import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../../../src/users/entities/user.schema';
import { Model } from 'mongoose';
import { getFakeImage, getFakeUser } from './data.utils';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        UsersService,
      ],
    }).compile();

    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll: should return all users (page 1)', async () => {
    const user = getFakeUser();
    const spy = jest.spyOn(mockUserModel, 'find').mockResolvedValue([user]);

    const result = await service.findAll(1, 10);

    expect(result).toEqual([user]);
    expect(spy).toBeCalledWith(
      {},
      {},
      { skip: 0, limit: 10, sort: { _id: 1 } },
    );
  });

  it('findAll: should return all users (page 2)', async () => {
    const user = getFakeUser();
    const spy = jest.spyOn(mockUserModel, 'find').mockResolvedValue([user]);

    const result = await service.findAll(2, 20);

    expect(result).toEqual([user]);
    expect(spy).toBeCalledWith(
      {},
      {},
      { skip: 20, limit: 20, sort: { _id: 1 } },
    );
  });

  it('findOne: should return a given user', async () => {
    const user = getFakeUser();
    const spy = jest.spyOn(mockUserModel, 'findById').mockResolvedValue(user);

    const result = await service.findOne('fakeId');

    expect(result).toEqual(user);
    expect(spy).toBeCalledWith('fakeId');
  });

  test.each([
    { name: 'Jane' },
    { lastName: 'Doe' },
    { address: 'Fake Street 456' },
  ])('update: should update a given user with fields %o', async (newFields) => {
    const user = getFakeUser();
    const spy = jest
      .spyOn(mockUserModel, 'findOneAndUpdate')
      .mockResolvedValue(user);

    const result = await service.update('fakeId', newFields);

    expect(result).toEqual(user);
    expect(spy).toBeCalledWith({ _id: 'fakeId' }, newFields);
  });

  it('update: should update a given user with fields and image', async () => {
    const user = getFakeUser();
    const profilePicture = getFakeImage();
    const newFields = { name: 'John' };
    const spy = jest
      .spyOn(mockUserModel, 'findOneAndUpdate')
      .mockResolvedValue(user);

    const result = await service.update('fakeId', newFields, profilePicture);

    expect(result).toEqual(user);
    expect(spy).toBeCalledWith(
      { _id: 'fakeId' },
      { ...newFields, profilePicture },
    );
  });
});
