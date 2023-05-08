import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { LocalStrategy } from '../../../src/auth/local.strategy';
import { UnauthorizedException } from '@nestjs/common';

class TestLocalStrategy extends LocalStrategy {
  fail(...args: []) {
    console.debug(args);
  }
  success(...args: []) {
    console.debug(args);
  }
  error(err) {
    console.error(err);
  }
}

describe('LocalStrategy', () => {
  let strategy: TestLocalStrategy;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { validateUser: jest.fn() },
        },
        TestLocalStrategy,
      ],
    }).compile();

    strategy = module.get<TestLocalStrategy>(TestLocalStrategy);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate: should return the user when it is valid', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue(true);

    const result = await strategy.validate('user1', 'password');
    expect(result).toBeTruthy();
  });

  it('validate: should throw an exception when user is invalid', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue(false);

    expect(strategy.validate('user1', 'password')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  test.each([
    null,
    {},
    { authorization: '' },
    { authorization: 'Basic invalid_base64' },
  ])(
    'authenticate: should return false whith invalid header %o',
    async (headers) => {
      const spy = jest.spyOn(strategy, 'fail').mockImplementation(() => {});

      const result = strategy.authenticate({ headers }, {});
      expect(result).toBeFalsy();
      expect(spy).toBeCalledTimes(1);
    },
  );

  it('authenticate: should call validate when token is valid', async () => {
    const validateSpy = jest
      .spyOn(strategy, 'validate')
      .mockResolvedValue(true);

    jest.spyOn(strategy, 'success').mockImplementation(() => {});

    const headers = { authorization: 'Basic dXNlcjI6cGFzc3dvcmQ=' };
    strategy.authenticate({ headers }, {});

    expect(validateSpy).toBeCalledWith('user2', 'password', expect.anything());
  });
});
