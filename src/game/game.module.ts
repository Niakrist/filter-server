import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  imports: [PaginationModule],
  controllers: [GameController],
  providers: [GameService, PrismaService, PaginationService],
})
export class GameModule {}
