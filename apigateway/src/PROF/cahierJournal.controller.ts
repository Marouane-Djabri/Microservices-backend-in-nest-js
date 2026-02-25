import { Controller, Inject, Param, Post, Body, Put, Patch, Get, Delete, BadRequestException, UseGuards, ParseIntPipe, Res } from "@nestjs/common";
import { ClientProxy, Payload } from "@nestjs/microservices";
import { Response } from "express";
import { firstValueFrom } from "rxjs";
import { newPaperDTO, editPaperDTO } from "src/common/DTO/cahierJournal.dto";

@Controller('prof')
export class CahierJournalController {

  constructor(
    @Inject('FILE_SERVICE') private readonly fileService: ClientProxy,
  ) { }

  @Post(':prof_id/cahier-journal')
  async createPaperCJ(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Body() payload: newPaperDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(this.fileService.send('create-paper-CJ', { prof_id, payload }));
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
        message: 'failed to create cahier journal entry',
        error: error.message,
      });
    }
  }

  @Get(':prof_id/cahier-journal')
  async getCahierJournal(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(this.fileService.send('get-cahier-journal', { prof_id }));
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
        message: 'failed to retrieve cahier journal entries',
        error: error.message,
      });
    }
  }


  @Delete(':prof_id/cahier-journal/:id')
  async deletePaperCJ(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(this.fileService.send('delete-paper-CJ', { prof_id, id }));
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
        message: 'failed to delete cahier journal entry',
        error: error.message,
      });
    }
  }

  @Put(':prof_id/cahier-journal/:id')
  async editPaperCJ(
    @Param('prof_id', ParseIntPipe) prof_id: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: editPaperDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(this.fileService.send('edit-paper-CJ', { prof_id, id, body }));
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
        message: 'failed to edit cahier journal entry',
        error: error.message,
      });
    }
  }
}

