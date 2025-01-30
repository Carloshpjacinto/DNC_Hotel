import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { userSelectFields } from '../utils/userSelectFields';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(body: CreateUserDTO): Promise<User> {
    body.password = await this.hashPassword(body.password);
    return await this.prisma.user.create({ data: body, select: userSelectFields });
  }

  async list() {
    return await this.prisma.user.findMany({select: userSelectFields});
  }

  async show(id: string) {
    await this.isIdExists(id);

    return await this.prisma.user.findUnique({ where: { id: Number(id) }, select: userSelectFields });
  }

  async update(id: string, body: UpdateUserDTO) {
    await this.isIdExists(id);

    if (body.password) body.password = await this.hashPassword(body.password);

    return await this.prisma.user.update({
      where: { id: Number(id) },
      data: body,
      select: userSelectFields
    });
  }

  async delete(id: string) {
    await this.isIdExists(id);
    return await this.prisma.user.delete({ where: { id: Number(id) }, select: userSelectFields});
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async isIdExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
