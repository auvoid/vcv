import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join, resolve } from 'path';

config({ path: resolve(__dirname, '../../../../.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [join(__dirname, 'dist/entities/**/*.js')],
  migrations: [join(__dirname, 'dist/migrations/**/*.ts')],
  ssl:
    process.env.ENV_TYPE !== 'dev'
      ? {
          rejectUnauthorized: false,
          ca: process.env.DB_CA_CERT,
        }
      : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
