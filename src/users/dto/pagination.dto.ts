import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  page = 1;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  @Max(20)
  pageSize = 10;
}
