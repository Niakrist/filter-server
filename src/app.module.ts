import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'; 
import { GameModule } from './game/game.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    GameModule,
    PaginationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
