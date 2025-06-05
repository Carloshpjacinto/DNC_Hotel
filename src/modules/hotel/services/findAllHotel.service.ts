import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';
import { Hotel } from '@prisma/client';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const offSet = (page - 1) * limit;

    const total = await this.hotelRepositories.countHotels();

    const dataRedis = await this.redis.get(REDIS_HOTEL_KEY);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let data = JSON.parse(dataRedis);

    if (!data) {
      console.log('Não existe mas vou salvar');
      data = await this.hotelRepositories.findHotels(offSet, limit);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      data = data.map((hotel: Hotel) => {
        if (hotel.image) {
          hotel.image = `${process.env.APP_API_URL}/hotel-image/${hotel.image}`;
        }

        return hotel;
      });

      await this.redis.set(REDIS_HOTEL_KEY, JSON.stringify(data));

      return {
        total,
        page,
        per_page: limit,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data = JSON.parse(dataRedis);

      return {
        total,
        page,
        per_page: limit,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
      };
    }
  }
}
