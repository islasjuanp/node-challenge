import { ObjectId } from 'mongodb';

export class MockImageService {
  upload = (file: Express.Multer.File) => jest.fn();
  download = (id: ObjectId) => jest.fn();
}
