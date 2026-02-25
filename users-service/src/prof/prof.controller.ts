import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ProfService } from './prof.service';
import { updatePlanningDto } from 'src/common/DTO/updatePlanning.dto';
import { newPaperDTO, editPaperDTO } from 'src/common/DTO/cahierJournal.dto';
import { UpdateProfProfileDto } from 'src/common/DTO/updateProfProfile.dto';
import { createPlanningDTO } from 'src/common/DTO/createPlanning.dto';
import { errorMonitor } from 'events';
import { ServiceResponse } from 'src/common/sharedTypes/response.types';
import { Prof } from 'src/common/sharedTypes/model.types';

interface createNewPaperCJPayload {
  prof_id: number;
  data: newPaperDTO;
}

@Controller()
export class ProfCotnroller {
  constructor(private readonly prService: ProfService) {}
  @MessagePattern('prof-profile')
  async getProfProfile(
    @Payload() payload: { profId: number },
  ): Promise<ServiceResponse<Prof>> {
    try {
      return await this.prService.getProfProfile(payload.profId);
    } catch (error) {
      throw new Error(`Failed to get prof profile: ${error.message}`);
    } finally {
      console.log('Prof profile fetch attempted for ID:', payload.profId);
    }
  }

  @MessagePattern('prof-update-profile')
  async updateProfProfile(
    @Payload() payload: UpdateProfProfileDto,
  ): Promise<ServiceResponse<any>> {
    try {
      return this.prService.updateProfProfile(payload);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  @MessagePattern('prof-get-inspec')
  async getInspecOfProf(
    @Payload() payload: { profId: number },
  ): Promise<ServiceResponse<number | null>> {
    try {
      return await this.prService.getInspecOfProf(payload.profId);
    } catch (error) {
      throw new Error(`Failed to get inspections: ${error.message}`);
    }
  }

  @MessagePattern('prof-add-planning')
  async addPlanning(
    @Payload() payload: { profId: number; data: createPlanningDTO },
  ): Promise<ServiceResponse<any>> {
    console.log('Received payload for adding planning:', payload);
    const profId = +payload.profId;
    try {
      return await this.prService.addPlanning(profId, payload.data);
    } catch (error) {
      throw new Error(`Failed to create a new planning: ${error.message}`);
    } finally {
      console.log('Planning addition attempt attempted for ID:', profId);
    }
  }

  @MessagePattern('perso-planning')
  async getProfPlanning(@Payload() payload: { paramId: number }): Promise<ServiceResponse<any[]>> {
    const id = +payload.paramId;
    try {
      return await this.prService.getProfPlanning(id);
    } catch (error) {
      throw new Error(`Failed to get planning: ${error.message}`);
    } finally {
      console.log('Planning fetch attempt attempted for ID:', id);
    }
  }

  @MessagePattern('perso-edit-planning')
  async editPlanning(@Payload() data: any): Promise<ServiceResponse<any>> {
    try {
      return await this.prService.editPlanning(data);
    } catch (error) {
      throw new Error(`Failed to edit planning: ${error.message}`);
    } finally {
      console.log('Planning edit attempt attempted for ID:', data.profId);
    }
  }

  @MessagePattern('prof-delete-planning')
  async deletePlanning(@Payload() payload: { planningId: number }): Promise<ServiceResponse<any>> {
    const id = +payload.planningId;
    try {
      return await this.prService.deletePlanning(id);
    } catch (error) {
      throw new Error(`Failed to delete planning: ${error.message}`);
    } finally {
      console.log('Planning deletion attempt attempted for ID:', id);
    }
  }

  @MessagePattern('new-paper-CJ')
  async createNewPaperCJ(@Payload() payload: createNewPaperCJPayload): Promise<ServiceResponse<any>> {
    try {
      const { prof_id, data } = payload;
      return this.prService.createNewPaperCJ(prof_id, data);
    } catch (error) {
      throw new Error(`Failed to create new paper CJ: ${error.message}`);
    } finally {
      console.log('Paper CJ creation attempted for prof ID:', payload.prof_id);
    }
  }

  @MessagePattern('edit-paper-CJ')
  async modifyPaperCahierJournale(
    @Payload() payload: { id_feuille: number; data: editPaperDTO },
  ): Promise<ServiceResponse<any>> {
    try {
      const { id_feuille, data } = payload;
      return this.prService.modifyPaperCahierJournale(id_feuille, data);
    } catch (error) {
      throw new Error(`Failed to modify paper CJ: ${error.message}`);
    } finally {
      console.log(
        'Paper CJ modification attempted for ID:',
        payload.id_feuille,
      );
    }
  }

  @MessagePattern('get-paper-CJ')
  async getPaperCahierJournal(@Payload() payload: { prof_id: number }): Promise<ServiceResponse<any[]>> {
    try {
      const { prof_id } = payload;
      return this.prService.getPaperCahierJournal(prof_id);
    } catch (error) {
      throw new Error(`Failed to get paper CJ: ${error.message}`);
    } finally {
      console.log('Paper CJ fetch attempted for prof ID:', payload.prof_id);
    }
  }

  @MessagePattern('delete-paper-CJ')
  async deletePaperCahierJournal(
    @Payload() payload: { prof_id: number; date: any },
  ): Promise<ServiceResponse<any>> {
    try {
      const { prof_id, date } = payload;
      return this.prService.deletePaperCahierJournal(prof_id, date);
    } catch (error) {
      throw new Error(`Failed to delete paper CJ: ${error.message}`);
    } finally {
      console.log('Paper CJ deletion attempted for prof ID:', payload.prof_id);
    }
  }

  @MessagePattern('prof-update-diplome')
  async updateProfDiplome(
    @Payload()
    payload: {
      profId: number;
      id: number;
      nom?: string;
      dateObtention?: Date;
      lieu?: string;
    },
  ): Promise<ServiceResponse<any>> {
    try {
      return this.prService.updateProfDiplome(payload);
    } catch (error) {
      throw new Error(`Failed to update diploma: ${error.message}`);
    }
  }

  @MessagePattern('prof-add-diplome')
  async addProfDiplome(
    @Payload()
    payload: {
      profId: number;
      nom: string;
      dateObtention: Date;
      lieu: string;
    },
  ): Promise<ServiceResponse<any>> {
    try {
      return this.prService.addProfDiplome(payload);
    } catch (error) {
      throw new Error(`Failed to add diploma: ${error.message}`);
    }
  }

  @MessagePattern('prof-delete-diplome')
  async deleteProfDiplome(
    @Payload() payload: { profId: number; diplomeId: number },
  ): Promise<ServiceResponse<any>> {
    const { profId, diplomeId } = payload;
    try {
      return this.prService.deleteProfDiplome(profId, diplomeId);
    } catch (error) {
      throw new Error(`Failed to delete diploma: ${error.message}`);
    }
  }
}
