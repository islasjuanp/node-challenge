import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { resolve } from 'path';
import { faker } from '@faker-js/faker';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const authTokenBase64 = Buffer.from('user1:password').toString('base64');
  let userId = 'fakeId';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('PATCH /users', () => {
    beforeEach((done) => {
      const imagePath = resolve(__dirname, 'files/img_avatar.jpg');
      request(app.getHttpServer())
        .post('/users')
        .set('authorization', `Basic ${authTokenBase64}`)
        .attach('profilePicture', imagePath)
        .field('name', faker.name.firstName())
        .field('lastName', faker.name.lastName())
        .field('address', faker.address.streetAddress())
        .end((err, res) => {
          if (err) done(err);
          userId = res.body._id;
          done();
        });
    });

    test.each([{ name: 'John', lastName: 'Doe', address: 'Fake street 123' }])(
      'should return 200 when valid request with body %o',
      (body) => {
        const imagePath = resolve(__dirname, 'files/img_avatar.jpg');
        return request(app.getHttpServer())
          .patch(`/users/${userId}`)
          .set('authorization', `Basic ${authTokenBase64}`)
          .attach('profilePicture', imagePath)
          .field('name', body.name)
          .field('lastName', body.lastName)
          .field('address', body.address)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(userId);
          });
      },
    );

    test.each([
      { name: 1 },
      { lastName: 1 },
      { address: 1 },
      { name: '' },
      { lastName: '' },
      { address: '' },
    ])('should return 400 when invalid request with body %o', (body) => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
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
        .patch(`/users/${userId}`)
        .set('content-type', 'application/json')
        .set('authorization', `Basic ${token}`)
        .send(body)
        .expect(401);
    });
  });
});
