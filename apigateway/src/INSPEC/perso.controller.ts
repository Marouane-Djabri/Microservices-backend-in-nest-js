import {
  Controller,
  Get,
  Param,
  Inject,
  UseGuards,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { IsInspec } from 'src/guards/my.guards';
import { Response } from 'express';

@Controller('inspec')
export class InspecPersonnelController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
  ) {}
  @Get(':inspec_id/circonscription/etablissement')
  async getMesCirconscription(
    @Param('inspec_id', ParseIntPipe) inspec_id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('inspec-circonscription-etablissement', {
          inspecId: inspec_id,
        }),
      );
      if (response.success === true) {
        return res.status(200).json({
          status: 'success',
          success: true,
          data: response.data,
        });
      } else if (response.success === false) {
        return res.status(404).json({
          status: 'success',
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 'failure',
        success: false,
        message: 'failed to fetch etablissements',
        error: error.message,
      });
    }
  }

  @UseGuards(IsInspec)
  @Get(':inspec_id/prof')
  async getInspecProfesseur(
    @Param('inspec_id', ParseIntPipe) inspec_id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('inspec-professeur', { inspecId: inspec_id }),
      );
      if (response.success === true) {
        return res.status(200).json({
          status: 'success',
          success: true,
          data: response.data,
        });
      } else if (response.success === false) {
        return res.status(404).json({
          status: 'success',
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 'failure',
        success: false,
        message: 'failed to fetch professors',
        error: error.message,
      });
    }
  }
}
