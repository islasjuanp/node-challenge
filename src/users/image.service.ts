import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Image } from './entities/image.schema';
import { createReadStream } from 'fs';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @InjectModel(Image.name) private imageModel: Model<Image>,
    private bucket: GridFSBucket,
  ) {}

  async upload(file: Express.Multer.File): Promise<Image> {
    const uploadStream = this.bucket.openUploadStream(file.originalname);
    const readStream = createReadStream(file.path);

    await new Promise((resolve, reject) => {
      readStream.pipe(uploadStream).on('finish', resolve).on('error', reject);
    });

    const fileInfo = await this.bucket.find({ _id: uploadStream.id }).next();

    return new this.imageModel({
      _id: uploadStream.id,
      filename: fileInfo.filename,
      contentType: fileInfo.contentType,
      length: fileInfo.length,
      uploadDate: fileInfo.uploadDate,
    });
  }

  async download(id: ObjectId): Promise<Buffer> {
    this.logger.log(`Downloading image with id: ${id}`);
    const downloadStream = this.bucket.openDownloadStream(id);
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      downloadStream.on('data', (chunk) => chunks.push(chunk));
      downloadStream.on('error', reject);
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
  }
}
