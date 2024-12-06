import { SetMetadata } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ServiceResponse {
  constructor(
    public success: boolean,
    public data: object,
    public message: string,
    public code: number,
  ) {}
}

export class PagingDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  count?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}

export class PagingResponseDto<T> {
  public items: T[];
  public meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const Roles = (...roles: string[]) => {
  return SetMetadata('user_roles', roles);
};
