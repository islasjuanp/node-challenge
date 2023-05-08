import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

const MB = 1000000;

export interface ImageValidatorOption {
  isRequired: boolean;
}
export class ImageValidatorPipe extends ParseFilePipe {
  constructor({ isRequired }: ImageValidatorOption) {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * MB }),
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
      fileIsRequired: isRequired,
    });
  }
}
