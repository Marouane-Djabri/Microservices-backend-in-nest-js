import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { updateInspecPorfileDto } from 'src/common/DTO/updateInspecProfile.dto';
import { InspecService } from './inspec.service';

@Controller()
export class InspecController {
  constructor(
    private readonly inspecService: InspecService,
  ) {}
  @MessagePattern('inspec-profile')
  async InspecProfile(@Payload() payload: { inspecId: number }) {
    try {
      const { inspecId } = payload;
      const result = await this.inspecService.getInspecProfile(inspecId);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch inspector profile: ${error.message}`,
      };
    }
  }

  @MessagePattern('inspec-update-profile')
  async updateProfile(@Payload() payload: updateInspecPorfileDto) {
    try {
      const result = await this.inspecService.updateInspecProfile(payload);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to update profile: ${error.message}`,
      };
    }
  }

  @MessagePattern('inspec-circonscription-etablissement')
  async getMesEtablissement(@Payload() payload: { inspecId: number }) {
    try {
      const { inspecId } = payload;
      
      // Get inspector's circonscription
      const circonscriptionResult = await this.inspecService.getCircondcriptionByInspec(inspecId);
      
      if (!circonscriptionResult.success) {
        return {
          success: false,
          error: circonscriptionResult.error,
        };
      }

      // Get establishments in the circonscription
      const etablissementsResult = await this.inspecService.etbalissementByCirconscriptionId(
        circonscriptionResult.data!,
      );

      if (etablissementsResult.success) {
        return {
          success: true,
          data: etablissementsResult.data,
        };
      } else {
        return {
          success: false,
          error: etablissementsResult.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get establishments for inspector ${payload.inspecId}: ${error.message}`,
      };
    }
  }

  @MessagePattern('inspec-professeur')
  async getMesProf(@Payload() payload: { inspecId: number }) {
    try {
      const { inspecId } = payload;
      const result = await this.inspecService.getProfesseursByInspec(inspecId);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch professors for inspector ${payload.inspecId}: ${error.message}`,
      };
    }
  }
}
