import { IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @Length(3, 1000)
  content: string;

  @IsString()
  @Length(0, 255)
  imageUrl: string;
}
