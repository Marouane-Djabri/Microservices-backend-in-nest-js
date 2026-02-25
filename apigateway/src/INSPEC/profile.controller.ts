import {
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { updateInspecPorfileDto } from 'src/common/DTO/updateInspecProfile.dto';
import { IsInspec } from 'src/guards/my.guards';
import { Response } from 'express';

@Controller('inspec')
export class InspecProfileController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
  ) {}

  @UseGuards(IsInspec)
  @Get(':inspec_id/profile')
  async getProfileInspec(
    @Param('inspec_id', ParseIntPipe) inspecId: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('inspec-profile', { inspecId }),
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
        message: 'failed to fetch profile',
        error: error.message,
      });
    }
  }

  @UseGuards(IsInspec)
  @Put(':inspec_id/profile')
  async updateInspecProfile(
    @Param('inspec_id', ParseIntPipe) inspec_id: number,
    @Payload() payload: updateInspecPorfileDto,
    @Res() res: Response,
  ) {
    payload.id = inspec_id;
    try {
      const response = await firstValueFrom(
        this.usersService.send('inspec-update-profile', payload),
      );
      if (response.success === true) {
        return res.status(200).json({
          status: 'success',
          success: true,
          data: response.data,
        });
      } else if (response.success === false) {
        return res.status(400).json({
          status: 'success',
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 'failure',
        success: false,
        message: 'failed to update profile',
        error: error.message,
      });
    }
  }
}
