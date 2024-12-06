import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FirebaseModule } from './firebase/firebase.module';
import { Reflector } from '@nestjs/core';
import { DataBaseProvider } from './common/dbprovider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: false,
      name: 'SEQUELIZE',
    }),
    Reflector,
    FirebaseModule,
    AuthModule,
    PostModule,
  ],
  controllers: [],
  providers: [DataBaseProvider],
})
export class AppModule {}
