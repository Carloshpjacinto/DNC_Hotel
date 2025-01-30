import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(body: CreateUserDTO): Promise<User> {
    return await this.prisma.user.create({ data: body });
  }

  async list() {
    return await this.prisma.user.findMany();
  }

  async show(id: string) {
    return await this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async update(id: string, body: UpdateUserDTO) {
    return await this.prisma.user.update({
      where: { id: Number(id) },
      data: body,
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id: Number(id) } });
  }
}
