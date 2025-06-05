import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class FindByOwnerHotelsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async execute(id: number) {
    await this.redis.del(REDIS_HOTEL_KEY);
    return await this.hotelRepositories.findHotelByOwner(id);
  }
}
