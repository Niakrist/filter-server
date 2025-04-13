import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { EnumGameSort, GetAllGameDto } from './dto/get-all.game.dto';
import { AgeRating, Genres, Platform, Prisma } from '@prisma/client';
import { convertToNumber } from 'src/utils/convert-tonumber';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private paginationServices: PaginationService
  ) { }


  async findAll(dto: GetAllGameDto = {}) {

    const { perPage, skip } = this.paginationServices.getPagination(dto)
    const filters = this.createFilter(dto)

    const games = await this.prisma.game.findMany({
      where: filters,
      orderBy: this.getSortOption(dto.sort ?? EnumGameSort.NEWEST),
      skip,
      take: perPage
    })

    return {
      games,
      length: await this.prisma.game.count({ where: filters })
    }
  }

  private createFilter(dto: GetAllGameDto): Prisma.GameWhereInput {
    const filters: Prisma.GameWhereInput[] = [];
    if (dto.searchTerm) {
      filters.push(this.getSearchTermFilter(dto.searchTerm))
    }
    if (dto.rating) {
      filters.push(this.getRatingFilter(+dto.rating))
    }
    if (dto.minPrice || dto.maxPrice) {
      filters.push(this.getPriceFilter(
        dto.minPrice ? convertToNumber(dto.minPrice) : undefined,
        dto.maxPrice ? convertToNumber(dto.maxPrice) : undefined
      ))
    }
    if (dto.genres) {
      filters.push(this.getGenreFilter(dto.genres));
    }
    if (dto.platform) {
      filters.push(this.getPlatformFilter(dto.platform))
    }
    if (dto.isAdultOnly !== undefined) {
      filters.push(this.getAdultOnlyFilter(dto.isAdultOnly))
    }
    return filters.length ? { AND: filters } : {}
  }


  private getSortOption(sort: EnumGameSort): Prisma.GameOrderByWithRelationInput[] {
    switch (sort) {
      case EnumGameSort.LOW_PRICE:
        return [{ price: 'asc' }]
      case EnumGameSort.HIGH_PRICE:
        return [{ price: 'desc' }]
      case EnumGameSort.OLDEST:
        return [{ relaseDate: 'asc' }]
      default:
        return [{ relaseDate: 'desc' }]
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
    if (minPrice || maxPrice) {
      priceFilter = {}; // Initialize the object
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

    return {}

  }


  // Данные с query парметров будут приходить так: 'action|rpg|adventure'
  private getGenreFilter(genres: string): Prisma.GameWhereInput {
    const genresArray = genres.split('|') as Genres[]
    return {
      genres: {
        hasEvery: genresArray
      }
    }
  }

  private getPlatformFilter(platform: Platform): Prisma.GameWhereInput {
    return {
      platforms: {
        hasSome: [platform]
      }
    }
  }

  private getAdultOnlyFilter(isAdultOnlyProps: string): Prisma.GameWhereInput {
    const isAdultOnly = isAdultOnlyProps === 'true'
    return {
      ageRating: {
        in: isAdultOnly ? [AgeRating.M, AgeRating.AO, AgeRating.E, AgeRating.E10plus, AgeRating.T] : [AgeRating.E, AgeRating.E10plus, AgeRating.T]
      }
    }
  }

}