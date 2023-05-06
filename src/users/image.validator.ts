import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

const MB = 1000000;

export class ImageValidatorPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * MB }),
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
      fileIsRequired: true,
    });
  }
}
