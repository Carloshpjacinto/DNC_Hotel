import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async list() {
    return await this.userService.list();
  }

  @Get(':id')
  async show(@ParamId() id: number) {
    return await this.userService.show(id);
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: UpdateUserDTO) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  deleteUser(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
