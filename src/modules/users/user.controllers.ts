import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { Role, User as UserType } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorators';
import { UserMatchGuard } from 'src/shared/guards/userMatch.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async list(@User() user: UserType) {
    console.log(user);
    return await this.userService.list();
  }

  @Get(':id')
  async show(@User() user: UserType, @ParamId() id: number) {
    console.log(user);
    return await this.userService.show(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async createUser(@User() user: UserType, @Body() body: CreateUserDTO) {
    console.log(user);
    return await this.userService.createUser(body);
  }

  @UseGuards(UserMatchGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  updateUser(
    @User() user: UserType,
    @ParamId() id: number,
    @Body() body: UpdateUserDTO,
  ) {
    console.log(user);
    return this.userService.update(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  deleteUser(@User() user: UserType, @ParamId() id: number) {
    console.log(user);
    return this.userService.delete(id);
  }
}
