import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/repositoriesToken';
import { IReservationRepository } from '../domain/repositories/IReservations.repository';

@Injectable()
export class FindAllReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute() {
    return await this.reservationRepository.findAll();
  }
}
