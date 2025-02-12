import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../utils/repositoriesTokens';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(page: number = 1, limit: number = 10) {

    let data:any;

    const offSet = (page - 1) * limit;

    const total = await this.hotelRepositories.countHotels();

    const dataRedis = await this.redis.get(REDIS_HOTEL_KEY);

    if(!dataRedis){

      console.log("Não existe mas vou salvar")
      data = await this.hotelRepositories.findHotels(offSet, limit);
      await this.redis.set(REDIS_HOTEL_KEY, JSON.stringify(data));

      return {
        total,
        page,
        per_page: limit,
        data,
      };
    }else{

      data = JSON.parse(dataRedis);

      return {
        total,
        page,
        per_page: limit,
        data,
      };
    }
  }
}
