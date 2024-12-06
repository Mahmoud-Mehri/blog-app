import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repositories/post.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';
import { DataBaseProvider } from 'src/common/dbprovider';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [PostController],
  providers: [
    PostService,
    DataBaseProvider,
    { provide: 'IPostRepository', useClass: PostRepository },
  ],
  exports: [],
})
export class PostModule {}
