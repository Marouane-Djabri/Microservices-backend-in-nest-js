import { ConflictException, Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { newPaperDTO } from "src/common/DTO/cahierJournal.dto";
import { ServiceResponse } from "src/common/sharedTypes/response.types";

@Injectable()
export class CahierJournalService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }
  async createPaperCJ(prof_id: number, data: newPaperDTO): Promise<ServiceResponse<any>> {
    try {
      const donnee: any = {};
      if (data.classe) donnee.classe = data.classe;
      if (data.description) donnee.description = data.description;
      if (data.observation) donnee.observation = data.observation;
      donnee.profId = prof_id;
      donnee.date = data.date;

      const existing = await this.prisma.cahierJournal.findFirst({
        where: {
          date: data.date,
          profId: prof_id,
        }
      });

      if (existing) {
        return {
          success: false,
          error: "A paper already exists for this date"
        };
      }

      const createdPaper = await this.prisma.cahierJournal.create({
        data: donnee,
      });

      return {
        success: true,
        data: createdPaper
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while creating the paper'
      };
    }
  }

  async getCahierJournal(prof_id: number): Promise<ServiceResponse<any[]>> {
    try {
      const papers = await this.prisma.cahierJournal.findMany({
        where: {
          profId: prof_id,
        },
        orderBy: {
          date: 'desc'
        }
      });

      return {
        success: true,
        data: papers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while retrieving the journal'
      };
    }
  }


  async deletePaperCJ(prof_id: number, id: number): Promise<ServiceResponse<any>> {
    try {
      const deletedPaper = await this.prisma.cahierJournal.delete({
        where: {
          id: id,
          profId: prof_id
        }
      });

      return {
        success: true,
        data: deletedPaper
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while deleting the paper'
      };
    }
  }

  async editPaperCJ(prof_id: number, id: number, body: any): Promise<ServiceResponse<any>> {
    try {
      const donnee: any = {};
      if (body.classe) donnee.classe = body.classe;
      if (body.description) donnee.description = body.description;
      if (body.observation) donnee.observation = body.observation;
      
      if (body.date) {
        // Check if there is another paper with the same date (excluding the current one)
        const existing = await this.prisma.cahierJournal.findFirst({
          where: {
            date: body.date,
            profId: prof_id,
            NOT: {
              id: id
            }
          }
        });
        
        if (existing) {
          return {
            success: false,
            error: "A paper already exists for this date"
          };
        }
        donnee.date = body.date;
      }

      const updatedPaper = await this.prisma.cahierJournal.update({
        where: {
          id: id,
          profId: prof_id
        },
        data: donnee
      });

      return {
        success: true,
        data: updatedPaper
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while editing the paper'
      };
    }
  }
}
