import { Controller, Post, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { CreateReservationsService } from '../services/createReservations.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { FindByIdReservationsService } from '../services/findByIdReservations.service';
import { ReservationStatus, Role } from '@prisma/client';
import { UpdateStatusReservationsService } from '../services/updateStatusReservations.service';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorators';

@UseGuards(AuthGuard, RoleGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
    private readonly updateStatusReservationsService: UpdateStatusReservationsService,
  ) {}

  @Roles(Role.USER)
  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDto) {
    return this.createReservationsService.create(id, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Get('user')
  findByUser(@User('id') id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  updateStatus(
    @ParamId() id: number,
    @Body('status') status: ReservationStatus,
  ) {
    return this.updateStatusReservationsService.execute(id, status);
  }
}
