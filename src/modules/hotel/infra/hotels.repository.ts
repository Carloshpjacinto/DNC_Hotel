import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDto, id: number): Promise<Hotel> {
    data.ownerId = id;
    return this.prisma.hotel.create({ data });
  }

  async findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel
      .findUnique({
        where: { id: Number(id) },
        include: { owner: true },
      })
      .then((hotel) => {
        if (hotel.owner.avatar) {
          hotel.owner.avatar = `${process.env.APP_API_URL}/user-avatar/${hotel.owner.avatar}`;
        }

        return hotel;
      });
  }
  findHotelByName(name: string): Promise<Hotel[] | null> {
    return this.prisma.hotel.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  async findHotels(offSet: number, limit: number): Promise<Hotel[]> {
    return this.prisma.hotel
      .findMany({
        take: limit,
        skip: offSet,
        include: { owner: true },
      })
      .then((hotels) => {
        hotels.forEach((reservation) => {
          if (reservation.owner.avatar) {
            reservation.owner.avatar = `${process.env.APP_API_URL}/user-avatar/${reservation.owner.avatar}`;
          }
        });

        return hotels;
      });
  }

  countHotels(): Promise<number> {
    return this.prisma.hotel.count();
  }

  findHotelByOwner(ownerId: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({ where: { ownerId } });
  }

  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({ where: { id }, data });
  }
  deleteHotel(id: number): Promise<Hotel> {
    return this.prisma.hotel.delete({ where: { id } });
  }
}
