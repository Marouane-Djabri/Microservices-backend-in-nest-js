import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  Patch,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { first, firstValueFrom } from 'rxjs';
import { updatePlanningDto } from 'src/common/DTO/updatePlanning.dto';
import { createPlanningDTO } from 'src/common/DTO/createPlanning.dto';

@Controller('prof')
export class ProfController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
  ) {}
  @Post(':prof_id/planning')
  async ajouterPlanning(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Body() payload: createPlanningDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-add-planning', {
          profId: prof_id,
          data: payload,
        }),
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
        message: 'failed to add planning',
        error: error.message,
      });
    }
  }
  @Get(':prof_id/planning')
  async getPlanning(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('perso-planning', { paramId: prof_id }),
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
        message: 'failed to get planning',
        error: error.message,
      });
    }
  }
  @Put(':prof_id/planning')
  async editPlanning(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Body() payload: updatePlanningDto,
    @Res() res: Response,
  ) {
    const data = { ...payload, profId: prof_id };
    try {
      const response = await firstValueFrom(
        this.usersService.send('perso-edit-planning', data),
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
        message: 'failed to edit planning',
        error: error.message,
      });
    }
  }

  @Delete(':prof_id/planning/:planning_id')
  async deletePlanning(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Param('planning_id', ParseIntPipe) planning_id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.usersService.send('prof-delete-planning', { planningId: planning_id }),
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
        message: 'failed to delete planning',
        error: error.message,
      });
    }
  }
}
