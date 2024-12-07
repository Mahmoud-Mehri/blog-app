import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as fsp from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import * as crypto from 'crypto';
import { IPostRepository } from './model/repository.intf';
import { CreatePostDto } from './dto/post.create.dto';
import { PagingDto, ServiceResponse } from 'src/common/types';
import { errorResponse, successResponse } from 'src/common/utils';
import { Post } from './model/models';
import { UpdatePostDto } from './dto/post.update.dto';

@Injectable()
export class PostService {
  private logger: Logger;
  constructor(
    @Inject('IPostRepository') private postRepository: IPostRepository,
  ) {
    this.logger = new Logger('Post Service');
  }

  async downloadImage(imageUrl: string): Promise<string | null> {
    try {
      let redirectCount = 0;
      const imageDir = path.join(process.cwd(), 'images');
      await fsp.mkdir(imageDir, { recursive: true });

      return new Promise((resolve, reject) => {
        const downloadWithRedirect = (url: string) => {
          const fileExt = path.extname(new URL(url).pathname);
          const uuid = crypto.randomUUID();
          const filename = `${uuid}${fileExt}`;
          const filePath = path.join(imageDir, filename);

          const client = url.startsWith('https') ? https : http;
          const request = client.get(url, (response) => {
            if ([301, 302, 307, 308].includes(response.statusCode)) {
              // Handling redirects
              redirectCount++;
              if (redirectCount > 3) {
                reject(new Error('Too many requests'));
                return;
              }
              this.logger.log(
                `Redirect - ${redirectCount}:`,
                response.headers.location,
              );

              return downloadWithRedirect(response.headers.location);
            }

            if (response.statusCode !== 200) {
              reject(
                new Error(
                  `Image Download Failed - ${response.statusCode} - ${response.statusMessage}`,
                ),
              );
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
              fileStream.close();
              resolve(filePath);
            });

            fileStream.on('error', (err) => {
              reject(err);
            });
          });

          request.on('error', (err) => {
            reject(err);
          });
        };

        downloadWithRedirect(imageUrl);
      });
    } catch (err) {
      this.logger.error('Image Download Error:', err);
      return null;
    }
  }

  async createPost(
    userId: string,
    postInfo: CreatePostDto,
  ): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      let localImageAddr: string | null = null;
      if (postInfo.imageUrl && postInfo.imageUrl.trim() !== '') {
        localImageAddr = await this.downloadImage(postInfo.imageUrl);
      }

      const post = new Post(
        null,
        postInfo.title,
        postInfo.content,
        localImageAddr,
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
    postInfo: UpdatePostDto,
  ): Promise<ServiceResponse> {
    try {
      // User permission can be checked here if not handled by Roles

      let localImageAddr: string | null = null;
      if (postInfo.imageUrl && postInfo.imageUrl.trim() !== '') {
        localImageAddr = await this.downloadImage(postInfo.imageUrl);
      }

      const post = new Post(
        null,
        postInfo.title,
        postInfo.content,
        localImageAddr,
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
