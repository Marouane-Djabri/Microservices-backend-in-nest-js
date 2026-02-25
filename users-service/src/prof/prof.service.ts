import { Injectable } from '@nestjs/common';
import { updatePlanningDto } from 'src/common/DTO/updatePlanning.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { newPaperDTO, editPaperDTO } from 'src/common/DTO/cahierJournal.dto';
import { UpdateProfProfileDto } from 'src/common/DTO/updateProfProfile.dto';
import { createPlanningDTO } from 'src/common/DTO/createPlanning.dto';
import { ServiceResponse } from 'src/common/sharedTypes/response.types';
import { Prof } from '../common/sharedTypes/model.types';
import { SourceCode } from 'eslint';
interface createNewPaperCJPayload {
  prof_id: number;
  data: newPaperDTO;
}

@Injectable()
export class ProfService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfProfile(id: number): Promise<ServiceResponse<Prof>> {
    try {
      const response = await this.prisma.prof.findUnique({
        where: {
          id: id,
        },
        include: {
          etablissement: true,
          profDiplome: true,
        },
      });
      if (response === null) {
        return { success: false, error: 'failed to find the user profile' };
      }
      return { success: true, data: response as unknown as Prof };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getInspecOfProf(
    profId: number,
  ): Promise<ServiceResponse<number | null>> {
    try {
      const prof = await this.prisma.prof.findFirst({
        where: {
          id: profId,
        },
        include: {
          etablissement: true,
        },
      });
      if (prof === null) {
        return { success: false, error: 'Prof not found' };
      }
      const circonscription = prof.etablissement?.circonscriptionId;
      if (circonscription === undefined || null) {
        return { success: false, error: 'circonscription not found' };
      }
      const inspecId = await this.prisma.inspec.findFirst({
        where: {
          circonscriptionId: circonscription,
        },
      });
      if (inspecId === null || inspecId === undefined) {
        return { success: false, error: 'inspec not found' };
      }
      return { success: true, data: inspecId.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addPlanning(
    profId: number,
    payload: createPlanningDTO,
  ): Promise<ServiceResponse<any>> {
    console.log('the recieved data', payload);
    const data: any = {};
    if (payload.classe) data.classe = payload.classe;
    if (payload.creneau) data.creneau = payload.creneau;
    if (payload.jour) data.jour = payload.jour;
    if (payload.salle) data.salle = payload.salle;
    if (payload.type) data.type = payload.type;
    data.profId = profId;
    try {
      const newPlanning = await this.prisma.planning.create({
        data: data,
      });
      return { success: true, data: newPlanning };
    } catch (error) {
      console.error('Error in addPlanning:', error);
      return {
        success: false,
        error: `Failed to add/update planning for professor ${profId} on ${payload.jour} at ${payload.creneau}: ${error.message}`,
      };
    }
  }
  async getProfPlanning(prof_id: number): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.prisma.planning.findMany({
        where: {
          profId: prof_id,
        },
      });
      console.log('the fetched planning  : ', response);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve planning for professor ${prof_id}: ${error.message}`,
      };
    }
  }

  async editPlanning(data: any): Promise<ServiceResponse<any>> {
    const donnee: any = {};
    if (data.classe) donnee.classe = data.classe;
    if (data.creneau) donnee.creneau = data.creneau;
    if (data.jour) donnee.jour = data.jour;
    if (data.salle) donnee.salle = data.salle;
    if (data.type) donnee.type = data.type;
    try {
      const updatedPlanning = await this.prisma.planning.update({
        where: {
          id: data.id,
        },
        data: donnee,
      });
      return { success: true, data: updatedPlanning };
    } catch (error) {
      return {
        success: false,
        error: `Failed to edit planning with ID ${data.id}: ${error.message}`,
      };
    }
  }

  async deletePlanning(id: number): Promise<ServiceResponse<any>> {
    try {
      const deletedPlanning = await this.prisma.planning.delete({
        where: {
          id: id,
        },
      });
      return { success: true, data: deletedPlanning };
    } catch (error) {
      console.error('Error deleting planning:', error);
      return {
        success: false,
        error: `Failed to delete planning with ID ${id}: ${error.message}`,
      };
    }
  }
  async createNewPaperCJ(
    prof_id: number,
    data: newPaperDTO,
  ): Promise<ServiceResponse<any>> {
    try {
      const donnéé: any = {};
      donnéé.date = data.date;
      if (data.classe) donnéé.classe = data.classe;
      if (data.description) {
        donnéé.description = JSON.parse(data.description);
      }
      if (data.observation) donnéé.observation = JSON.parse(data.observation);
      donnéé.profId = prof_id;
      donnéé.id = `${prof_id}#${data.date}`;
      const newPaper = await this.prisma.cahierJournal.create({
        data: donnéé,
      });
      return { success: true, data: newPaper };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create new cahier journal entry for professor ${prof_id} on ${data.date}: ${error.message}`,
      };
    }
  }

  async modifyPaperCahierJournale(
    id_feuille: number,
    payload: editPaperDTO,
  ): Promise<ServiceResponse<any>> {
    try {
      const data: any = {};
      if (payload.classe) data.classe = payload.classe;
      if (payload.description) {
        const jsonDescription = `"${payload.description}"`;
        data.description = JSON.parse(jsonDescription);
      }
      if (payload.observation) {
        const jsonObservation = `"${payload.observation}"`;
        data.observation = JSON.parse(jsonObservation);
      }
      const updatedPaper = await this.prisma.cahierJournal.update({
        where: {
          id: id_feuille,
        },
        data: data,
      });
      return { success: true, data: updatedPaper };
    } catch (error) {
      return {
        success: false,
        error: `Failed to modify cahier journal entry with ID ${id_feuille}: ${error.message}`,
      };
    }
  }

  async getPaperCahierJournal(
    prof_id: number,
  ): Promise<ServiceResponse<any[]>> {
    try {
      const papers = await this.prisma.cahierJournal.findMany({
        where: {
          profId: prof_id,
        },
      });
      return { success: true, data: papers };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve cahier journal entries for professor ${prof_id}: ${error.message}`,
      };
    }
  }

  async deletePaperCahierJournal(
    prof_id: number,
    date: any,
  ): Promise<ServiceResponse<any>> {
    try {
      const deletedPapers = await this.prisma.cahierJournal.deleteMany({
        where: {
          profId: prof_id,
          date: date,
        },
      });
      return { success: true, data: deletedPapers };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete cahier journal entries for professor ${prof_id} on date ${date}: ${error.message}`,
      };
    }
  }

  async updateProfProfile(
    payload: UpdateProfProfileDto,
  ): Promise<ServiceResponse<any>> {
    const { id, etablissementId, ...otherData } = payload;
    try {
      const updateData: any = { ...otherData };
      if (etablissementId !== undefined) {
        if (etablissementId === null) {
          updateData.etablissement = { disconnect: true };
        } else {
          updateData.etablissement = { connect: { id: etablissementId } };
        }
      }
      const response = await this.prisma.prof.update({
        where: { id: payload.id },
        data: updateData,
      });
      if (response !== null && response !== undefined) {
        return {
          success: true,
          data: response,
        };
      } else {
        return {
          success: false,
          error: `failed to update the prof with id ${id}`,
        };
      }
    } catch (error) {
      throw new Error('Failed to update profile: ' + error.message);
    }
  }

  async updateProfDiplome(payload: {
    profId: number;
    id: number;
    nom?: string;
    dateObtention?: Date;
    lieu?: string;
  }): Promise<ServiceResponse<any>> {
    const { profId, id, ...data } = payload;
    try {
      const updatedDiploma = await this.prisma.profDiplome.update({
        where: {
          id: payload.id,
        },
        data: data,
      });
      return { success: true, data: updatedDiploma };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update diploma with ID ${id} for professor ${profId}: ${error.message}`,
      };
    }
  }

  async addProfDiplome(payload: {
    profId: number;
    nom: string;
    dateObtention: Date;
    lieu: string;
  }): Promise<ServiceResponse<any>> {
    try {
      const newDiploma = await this.prisma.profDiplome.create({
        data: {
          profId: payload.profId,
          nom: payload.nom,
          dateObtention: payload.dateObtention,
          lieu: payload.lieu,
        },
      });
      return { success: true, data: newDiploma };
    } catch (error) {
      return {
        success: false,
        error: `Failed to add diploma "${payload.nom}" for professor ${payload.profId}: ${error.message}`,
      };
    }
  }

  async deleteProfDiplome(
    profId: number,
    diplomeId: number,
  ): Promise<ServiceResponse<any>> {
    try {
      const deletedDiploma = await this.prisma.profDiplome.delete({
        where: {
          id: diplomeId,
          profId: profId,
        },
      });
      return { success: true, data: deletedDiploma };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete diploma with ID ${diplomeId} for professor ${profId}: ${error.message}`,
      };
    }
  }
}
