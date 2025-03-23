import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GameService } from './game.service';
import { GetAllGameDto } from './dto/get-all.game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() query: GetAllGameDto) {
    return this.gameService.findAll(query)
  }
}
