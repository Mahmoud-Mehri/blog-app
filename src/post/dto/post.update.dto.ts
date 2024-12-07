import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @IsOptional()
  @Length(3, 1000)
  content?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  imageUrl?: string;
}
