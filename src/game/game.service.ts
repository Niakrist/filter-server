import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { EnumGameSort, GetAllGameDto } from './dto/get-all.game.dto';
import { Genres, Prisma } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private paginationServices: PaginationService
  ) { }

  async findAll(dto: GetAllGameDto) {
    return this.prisma.game.findMany()
  }

  private getSortOption(sort: EnumGameSort): Prisma.GameOrderByWithRelationInput[] {
    switch (sort) {
      case EnumGameSort.LOW_PRICE:
        return [{ price: 'asc' }]
      case EnumGameSort.HIGH_PRICE:
        return [{ price: 'desc' }]
      case EnumGameSort.OLDEST:
        return [{ price: 'asc' }]
      default:
        return [{ price: 'desc' }]
    }
  }

  private getSearchTermFilter(searchTerm: string): Prisma.GameWhereInput {
    return {
      OR: [
        {
          title: { // поиск по названию игры
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          publisher: { // поиск по опубликовавшему
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          developer: { // поиск по разрабочику
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      ]
    }
  }
    
  private getRatingFilter(rating: number): Prisma.GameWhereInput {
    return {
      rating: {
        gte: rating // gte это равно или больше
      }
    }
  }

  private getPriceFilter(
    minPrice?: number,
    maxPrice?: number
  ): Prisma.GameWhereInput {
    let priceFilter: Prisma.NestedFloatFilter | undefined = undefined
  
    if (minPrice) {
      priceFilter = {
        ...priceFilter,
        gte: minPrice
      }
    }
    if (maxPrice) {
      priceFilter = {
        ...priceFilter,
        lte: maxPrice
      }
    }
    return {
      price: priceFilter
    }  
  }


  // Данные с query парметров будут приходить так: 'action|rpg|adventure'
  private getGenreFilter(genres: string): Prisma.GameWhereInput {
    const genresArray = genres.split('|') as Genres[] 
  
    return {
      genres: {
        hasSome: genresArray
      }
    }
  
  }

}