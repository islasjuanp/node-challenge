import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';
import { Image } from '../../../src/users/entities/image.schema';

export const getFakeImage = (): Image => {
  return {
    _id: new ObjectId(faker.random.alphaNumeric(12)),
    length: 1,
    filename: 'image.jpg',
    contentType: 'image/jpg',
    uploadDate: new Date('2023-05-05T19:53:23.845Z'),
  };
};

export const getRandomRequest = () => {
  return {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    address: faker.address.streetAddress(),
    profilePicture: '',
  };
};

export const getFakeFile = (): Express.Multer.File => {
  return {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test file buffer'),
  } as Express.Multer.File;
};

export const getFakeUser = () => {
  return { name: 'John', lastName: 'Doe', address: '123 Main St' };
};
