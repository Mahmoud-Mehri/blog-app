import { PagingDto, PagingResponseDto } from 'src/common/types';
import { Post } from '../model/models';
import { IPostRepository } from '../model/repository.intf';
import { Injectable, Logger } from '@nestjs/common';
import { PostModel } from '../schema/post.schema';

// @Injectable()
export class PostRepository implements IPostRepository {
  private logger: Logger;
  constructor() {
    this.logger = new Logger('Post Repository');
  }

  private PostFromModel(post: PostModel): Post {
    if (!post) return null;

    return new Post(
      post.id.toString(),
      post.title,
      post.content,
      post.imageUrl,
      post.userId,
    );
  }

  private PostArrayFromModel(postList: PostModel[]): Post[] {
    if (!postList) return [];

    return postList.map((post) => {
      return this.PostFromModel(post);
    });
  }

  async createPost(postInfo: Partial<Post>): Promise<Post> {
    try {
      this.logger.debug('Before Creating:', JSON.stringify(postInfo));
      const obj = {
        title: postInfo.title,
        content: postInfo.content,
        imageUrl: postInfo.imageUrl,
        userId: postInfo.userId,
      };
      this.logger.debug('Before Creating 2:', postInfo.imageUrl);
      const newPost = await PostModel.create(
        {
          title: postInfo.title,
          content: postInfo.content,
          imageUrl: postInfo.imageUrl,
          userId: postInfo.userId,
        },
        { omitNull: true, returning: true },
      );
      this.logger.debug('After Creating:', JSON.stringify(newPost));

      return this.PostFromModel(newPost);
    } catch (err) {
      this.logger.error('Error on creating new post:', err);
      throw err;
    }
  }

  async updatePost(postId: string, postInfo: Partial<Post>): Promise<Post> {
    try {
      const id = parseInt(postId);
      const post = await PostModel.findByPk(id);
      if (!post) {
        return null;
      }

      const updatedPost = await post.update(
        {
          title: postInfo.title,
          content: postInfo.content,
          imageUrl: postInfo.imageUrl,
        },
        { omitNull: true, returning: true },
      );

      return this.PostFromModel(updatedPost);
    } catch (err) {
      this.logger.error('Error on updating post:', err);
      throw err;
    }
  }

  async deletePost(postId: string): Promise<Post> {
    try {
      const id = parseInt(postId);
      const post = await PostModel.findByPk(id);
      if (!post) {
        return null;
      }

      await post.destroy();

      return this.PostFromModel(post);
    } catch (err) {
      this.logger.error('Error on deleting post:', err);
      throw err;
    }
  }

  async getPostById(postId: string): Promise<Post> {
    try {
      const id = parseInt(postId);
      const post = await PostModel.findByPk(id);

      return this.PostFromModel(post);
    } catch (err) {
      this.logger.error('Error on getting post:', err);
      throw err;
    }
  }

  async getPostList(paging: PagingDto): Promise<PagingResponseDto<Post>> {
    try {
      const limit = paging.count;
      const offset = (paging.page - 1) * paging.page;
      const { rows, count } = await PostModel.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        items: this.PostArrayFromModel(rows),
        meta: {
          totalItems: count,
          itemsPerPage: limit,
          totalPages: Math.ceil(count / limit),
          currentPage: paging.page,
        },
      };
    } catch (err) {
      this.logger.error('Error on getting post list:', err);
      throw err;
    }
  }
}
