import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config({
  path: `./env/.${process.env.NODE_ENV}.env`,
});

export class ConfigService {
  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrations: ['dist/migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
      migrationsTableName: 'migrations',
    };
  }
}
