import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const authTokenBase64 = Buffer.from('user1:password').toString('base64');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('GET /users', () => {
    it('should return 200 and a list of users %o', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('content-type', 'application/json')
        .set('authorization', `Basic ${authTokenBase64}`)
        .send({})
        .expect(200)
        .expect((response) => {
          expect(response.body.length).toBeGreaterThan(0);

          response.body.forEach((user) => {
            expect(typeof user.name).toBe('string');
            expect(typeof user.lastName).toBe('string');
            expect(typeof user.address).toBe('string');
          });
        });
    });

    test.each([
      { page: -1, pageSize: 10 },
      { page: 0, pageSize: 10 },
      { page: 'a', pageSize: 10 },
      { page: 1, pageSize: 100 },
      { page: 1, pageSize: -1 },
      { page: 1, pageSize: 'a' },
    ])(
      'should return 400 when pagination information is not valid %o',
      ({ page, pageSize }) => {
        const body = {
          name: 'John',
          lastName: 'Doe',
          address: 'Fake street 123',
        };
        return request(app.getHttpServer())
          .get(`/users?page=${page}&pageSize=${pageSize}`)
          .set('content-type', 'application/json')
          .set('authorization', `Basic ${authTokenBase64}`)
          .send(body)
          .expect(400);
      },
    );
  });

  test.each([
    '',
    'invlaid_base64_token',
    Buffer.from('user_invalid:password').toString('base64'),
    Buffer.from('user_invalid:password_invalid').toString('base64'),
    Buffer.from('user2:password_invalid').toString('base64'),
  ])('should return 401 when auth token %s is invalid', (token) => {
    const body = {
      name: 'John',
      lastName: 'Doe',
      address: 'Fake street 123',
    };
    return request(app.getHttpServer())
      .get('/users')
      .set('content-type', 'application/json')
      .set('authorization', `Basic ${token}`)
      .send(body)
      .expect(401);
  });
});
