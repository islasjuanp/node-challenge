import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './entities/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockAuthModel: Model<AuthDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Auth.name),
          useValue: Model,
        },
        AuthService,
      ],
    }).compile();

    mockAuthModel = module.get<Model<AuthDocument>>(getModelToken(Auth.name));
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when username/password are valid', async () => {
    const saltOrRounds = 10;
    const password = 'random_password';
    const hash = await bcrypt.hash(password, saltOrRounds);

    const spy = jest
      .spyOn(mockAuthModel, 'findOne') // <- spy on what you want
      .mockResolvedValue({ username: 'user1', password: hash } as AuthDocument);

    const result = await service.validateUser('user1', password);
    expect(result).toBeTruthy();
  });

  it('should return false when username is invalid', async () => {
    const spy = jest
      .spyOn(mockAuthModel, 'findOne') // <- spy on what you want
      .mockResolvedValue(null);

    const result = await service.validateUser('user1', 'password');
    expect(result).toBeFalsy();
  });

  it('should return false when password is invalid', async () => {
    const spy = jest
      .spyOn(mockAuthModel, 'findOne') // <- spy on what you want
      .mockResolvedValue({ username: 'user1', password: '' } as AuthDocument);

    const result = await service.validateUser('user1', 'password');
    expect(result).toBeFalsy();
  });
});
