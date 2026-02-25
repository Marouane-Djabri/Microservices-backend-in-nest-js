import {
  Controller,
  Param,
  Get,
  Inject,
  HttpException,
  HttpStatus,
  Put,
  Post,
  ParseIntPipe,
  Delete,
  Res,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy, Payload } from '@nestjs/microservices';
import {
  UpdateProfProfileDto,
  UpdateProfDiplomeDto,
} from 'src/common/DTO/updateProfProfile.dto';
import { Response } from 'express';

@Controller('prof')
export class ProfProfileController {
  constructor(@Inject('USERS_SERVICE') private usersService: ClientProxy) {}
  @Get(':profId/profile')
  async getProfile(
    @Param('profId', ParseIntPipe) profId: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-profile', { profId }),
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

  @Put(':prof_id/profile')
  async updateProfile(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Payload() payload: UpdateProfProfileDto,
    @Res() res: Response,
  ) {
    payload.id = prof_id;
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-update-profile', payload),
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

  @Put(':prof_id/diplome/:diplome_id')
  async updateProfDiplome(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Param('diplome_id', ParseIntPipe) diplome_id: number,
    @Payload() payload: UpdateProfDiplomeDto,
    @Res() res: Response,
  ) {
    payload.profId = prof_id;
    payload.id = diplome_id;
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-update-diplome', payload),
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
        message: 'failed to update diploma',
        error: error.message,
      });
    }
  }

  @Post(':prof_id/diplome')
  async addProfDiplome(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Payload() payload: UpdateProfDiplomeDto,
    @Res() res: Response,
  ) {
    payload.profId = prof_id;
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-add-diplome', payload),
      );
      if (response.success === true) {
        return res.status(201).json({
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
        message: 'failed to add diploma',
        error: error.message,
      });
    }
  }

    @Delete(':prof_id/diplome/:diplome_id')
  async deleteProfDiplome(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Param('diplome_id', ParseIntPipe) diplome_id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-delete-diplome', {
          profId: prof_id,
          diplomeId: diplome_id,
        }),
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
        message: 'failed to delete diploma',
        error: error.message,
      });
    }
  }

  @Get(':profId/inspec')
  async getInspecOfProf(@Param('profId') profId: string, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-get-inspec', {
          profId: parseInt(profId, 10),
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
      return {
        status: 'FAILURE',
        success: false,
        error: error.message,
      };
    }
  }
}
