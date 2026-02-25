import { Controller, BadRequestException } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { newPaperDTO } from "src/common/DTO/cahierJournal.dto";
import { CahierJournalService } from "./cahierJournal.service";
import { ServiceResponse } from "src/common/sharedTypes/response.types";

@Controller()
export class CahierJournalController {
  constructor(
    private readonly cahier: CahierJournalService,
  ) { };
  @MessagePattern('create-paper-CJ')
  async createPaperCJ(@Payload() body: { prof_id: number, payload: newPaperDTO }): Promise<ServiceResponse<any>> {
    const { prof_id, payload } = body;
    return await this.cahier.createPaperCJ(prof_id, payload);
  }


  @MessagePattern('get-cahier-journal')
  async getCahierJournal(@Payload() body: { prof_id: number }): Promise<ServiceResponse<any[]>> {
    return await this.cahier.getCahierJournal(body.prof_id);
  }

  @MessagePattern('delete-paper-CJ')
  async deletePaperCJ(@Payload() body: { prof_id: number, id: number }): Promise<ServiceResponse<any>> {
    return await this.cahier.deletePaperCJ(body.prof_id, body.id);
  }

  @MessagePattern('edit-paper-CJ')
  async editPaperCJ(@Payload() body: { prof_id: number, id: number, body: any }): Promise<ServiceResponse<any>> {
    return await this.cahier.editPaperCJ(body.prof_id, body.id, body.body);
  }
}


