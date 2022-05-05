import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterCafeModule } from './register-cafe/register-cafe.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: async () =>
    Object.assign(await getConnectionOptions(), {
      autoLoadEntities: true,
    }),
  }), RegisterCafeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
