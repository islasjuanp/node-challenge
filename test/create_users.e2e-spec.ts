import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { resolve } from 'path';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authTokenBase64 = Buffer.from('user1:password').toString('base64');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /users', () => {
    test.each([{ name: 'John', lastName: 'Doe', address: 'Fake street 123' }])(
      'should return 201 when valid request with body %o',
      (body) => {
        const imagePath = resolve(__dirname, 'files/img_avatar.jpg');
        return request(app.getHttpServer())
          .post('/users')
          .set('authorization', `Basic ${authTokenBase64}`)
          .attach('profilePicture', imagePath)
          .field('name', body.name)
          .field('lastName', body.lastName)
          .field('address', body.address)
          .expect(201);
      },
    );

    test.each([
      {},
      { name: 'John' },
      { name: 'John', lastName: 'Doe' },
      { lastName: 'Doe', address: 'Fake street 123' },
      { lastName: 'Doe' },
      { name: 'John', address: 'Fake street 123' },
      { address: 'Fake street 123' },
      { name: 'John', lastName: 'Doe', address: 'Fake street 123' },
    ])('should return 400 when invalid request with body %o', (body) => {
      return request(app.getHttpServer())
        .post('/users')
        .set('content-type', 'application/json')
        .set('authorization', `Basic ${authTokenBase64}`)
        .send(body)
        .expect(400);
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
        .post('/users')
        .set('content-type', 'application/json')
        .set('authorization', `Basic ${token}`)
        .send(body)
        .expect(401);
    });
  });
});
