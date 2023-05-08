import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  @ApiProperty()
  page = 1;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Min(1)
  @Max(20)
  @ApiProperty()
  pageSize = 10;
}
