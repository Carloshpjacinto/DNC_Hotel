import { Module } from '@nestjs/common';
import { CreateReservationsService } from './services/createReservations.service';
import { ReservationsController } from './infra/reservations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotel/hotel.module';
import { ReservationRepository } from './infra/reservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from './utils/repositoriesToken';
import { REPOSITORY_TOKEN_HOTEL } from '../hotel/utils/repositoriesTokens';
import { HotelsRepositories } from '../hotel/infra/hotels.repository';
import { FindAllReservationsService } from './services/findAllReservations.service';
import { FindByIdReservationsService } from './services/findByIdReservations.service';
import { FindByUserReservationsService } from './services/findByUserReservations.service';
import { UpdateStatusReservationsService } from './services/updateStatusReservations.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService,
    FindAllReservationsService,
    FindByIdReservationsService,
    FindByUserReservationsService,
    UpdateStatusReservationsService,
    {
      provide: REPOSITORY_TOKEN_RESERVATION,
      useClass: ReservationRepository,
    },
    {
      provide: REPOSITORY_TOKEN_HOTEL,
      useClass: HotelsRepositories,
    },
  ],
})
export class ReservationsModule {}
