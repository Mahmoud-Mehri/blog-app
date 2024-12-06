import { PagingDto, PagingResponseDto } from 'src/common/types';
import { Post } from '../model/models';

export interface IPostRepository {
  createPost(postInfo: Partial<Post>): Promise<Post>;
  updatePost(postId: string, postInfo: Partial<Post>): Promise<Post>;
  deletePost(postId: string): Promise<Post>;

  getPostById(postId: string): Promise<Post>;
  getPostList(paging: PagingDto): Promise<PagingResponseDto<Post>>;
}
