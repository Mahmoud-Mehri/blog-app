import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from './model/repository.intf';
import { CreatePostDto } from './dto/post.create.dto';
import { PagingDto, ServiceResponse } from 'src/common/types';
import { errorResponse, successResponse } from 'src/common/utils';
import { Post } from './model/models';

@Injectable()
export class PostService {
  constructor(
    @Inject('IPostRepository') private postRepository: IPostRepository,
  ) {}

  async createPost(
    userId: string,
    postInfo: CreatePostDto,
  ): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      const post = new Post(
        null,
        postInfo.title,
        postInfo.content,
        postInfo.imageUrl,
        userId,
      );
      const newPost = await this.postRepository.createPost(post);

      return successResponse(newPost, HttpStatus.CREATED);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async updatePost(
    userId: string,
    postId: string,
    postInfo: CreatePostDto,
  ): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      const post = new Post(
        null,
        postInfo.title,
        postInfo.content,
        postInfo.imageUrl,
        null,
      );
      const updatedPost = await this.postRepository.updatePost(postId, post);
      if (!updatedPost) {
        return errorResponse('Post Not Found!', HttpStatus.NOT_FOUND);
      }

      return successResponse(updatedPost);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async deletePost(userId: string, postId: string): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      const deletedPost = await this.postRepository.deletePost(postId);

      if (!deletedPost) {
        return errorResponse('Post Not Found!', HttpStatus.NOT_FOUND);
      }
      return successResponse(null);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async getPost(userId: string, postId: string): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      const post = await this.postRepository.getPostById(postId);

      if (!post) {
        return errorResponse('Post Not Found!', HttpStatus.NOT_FOUND);
      }
      return successResponse(post);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async getPostList(
    userId: string,
    paging: PagingDto,
  ): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      const postList = await this.postRepository.getPostList(paging);
      return successResponse(postList);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }
}
