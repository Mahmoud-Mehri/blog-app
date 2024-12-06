import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/middlewares/auth.guard';
import { RoleGuard } from 'src/common/middlewares/role.guard';
import { PostService } from './post.service';
import { PagingDto, Roles } from 'src/common/types';
import { CreatePostDto } from './dto/post.create.dto';
import { Response } from 'express';

@Controller('posts')
@UseGuards(AuthGuard, RoleGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles('admin', 'author')
  async createPost(
    @Request() request: any,
    @Body() postInfo: CreatePostDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.user.id;
    const result = await this.postService.createPost(userId, postInfo);

    response.status(result.code).json(result);
  }

  @Put('/:id')
  @Roles('admin', 'author')
  async updatePost(
    @Request() request: any,
    @Body() postInfo: CreatePostDto,
    @Param('id') postId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.user.id;
    const result = await this.postService.updatePost(userId, postId, postInfo);

    response.status(result.code).json(result);
  }

  @Delete('/:id')
  @Roles('admin')
  async deletePost(
    @Request() request: any,
    @Param('id') postId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.user.id;
    const result = await this.postService.deletePost(userId, postId);

    response.status(result.code).json(result);
  }

  @Get('/:id')
  @Roles('admin', 'author', 'viewer')
  async getPost(
    @Request() request: any,
    @Param('id') postId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.user.id;
    const result = await this.postService.getPost(userId, postId);

    response.status(result.code).json(result);
  }

  @Get('')
  @Roles('admin', 'author', 'viewer')
  async getPostList(
    @Request() request: any,
    @Query() paging: PagingDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.user.id;
    const result = await this.postService.getPostList(userId, paging);

    response.status(result.code).json(result);
  }
}
