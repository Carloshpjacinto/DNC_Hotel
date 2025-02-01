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
import { User as UserType } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async list(@User() user: UserType) {
    console.log(user)
    return await this.userService.list();
  }

  @Get(':id')
  async show(@User() user: UserType, @ParamId() id: number) {
    console.log(user)
    return await this.userService.show(id);
  }

  @Post()
  async createUser(@User() user: UserType, @Body() body: CreateUserDTO) {
    console.log(user)
    return await this.userService.createUser(body);
  }

  @Patch(':id')
  updateUser(@User() user: UserType, @ParamId() id: number, @Body() body: UpdateUserDTO) {
    console.log(user)
    return this.userService.update(id, body);
  }

  @Delete(':id')
  deleteUser(@User() user: UserType, @ParamId() id: number) {
    console.log(user)
    return this.userService.delete(id);
  }
}
