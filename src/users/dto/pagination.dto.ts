import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  @Max(20)
  pageSize: number = 10;
}
