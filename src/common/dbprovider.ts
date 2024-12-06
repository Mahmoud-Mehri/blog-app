import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { InitPostModel } from 'src/post/schema/post.schema';

@Injectable()
export class DataBaseProvider {
  private logger: Logger;
  constructor(
    @InjectConnection('SEQUELIZE') private sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger('Database Provider');

    try {
      InitPostModel(sequelize);
      const syncTables = configService.get<boolean>('DB_SYNC');
      this.logger.log('All database models initialized');

      if (syncTables) {
        sequelize.sync().then((seq) => {
          this.logger.log('Tables are synced');
        });
      }
    } catch (err) {
      this.logger.error('Error on initlizing DB models:', err);
    }
  }
}
