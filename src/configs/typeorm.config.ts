import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig : TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'dogbook7!',
  database: 'cafe_table',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true
} 