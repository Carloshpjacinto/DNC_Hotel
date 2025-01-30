import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(body: any): Promise<User> {
    return this.prisma.user.create({ data: body });
  }

  list() {
    return this.prisma.user.findMany();
  }

  show(id: string) {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }
}
