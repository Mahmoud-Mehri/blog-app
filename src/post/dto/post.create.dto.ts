import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 1000)
  content: string;

  @IsString()
  @Length(0, 255)
  imageUrl: string;
}
