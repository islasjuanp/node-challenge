import { ObjectId } from 'mongodb';

export class MockImageService {
  upload = (_file: Express.Multer.File) => jest.fn();
  download = (_id: ObjectId) => jest.fn();
}
