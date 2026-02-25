import { Injectable } from '@nestjs/common';
import { Etablissement } from '@prisma/client';
import { updateInspecPorfileDto } from 'src/common/DTO/updateInspecProfile.dto';
import { ServiceResponse } from 'src/common/sharedTypes/response.types';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class InspecService {
  constructor(private readonly prisma: PrismaService) {}

  async getInspecProfile(inspecId: number): Promise<ServiceResponse<any>> {
    try {
      const userProfile = await this.prisma.inspec.findUnique({
        where: {
          id: inspecId,
        },
        include: {
          user: {
            select: {
              email: true,
              role: true,
            },
          },
          Circonscription: {
            select: {
              nom: true,
            },
          },
        },
      });

      if (userProfile) {
        return {
          success: true,
          data: userProfile,
        };
      } else {
        return {
          success: false,
          error: `Inspector with ID ${inspecId} not found`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch inspector profile: ${error.message}`,
      };
    }
  }

  // a function to updaye the inspec profile
  async updateInspecProfile(payload: updateInspecPorfileDto): Promise<ServiceResponse<any>> {
    try {
      const { id, nom, prenom, telephone } = payload;
      
      if (!nom && !prenom && !telephone) {
        return {
          success: false,
          error: 'No update fields provided.',
        };
      }

      const data: Partial<
        Pick<updateInspecPorfileDto, 'nom' | 'prenom' | 'telephone'>
      > = {};
      
      if (nom) data.nom = nom;
      if (prenom) data.prenom = prenom;
      if (telephone) data.telephone = telephone;

      const updatedProfile = await this.prisma.inspec.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              email: true,
              role: true,
            },
          },
          Circonscription: {
            select: {
              nom: true,
            },
          },
        },
      });

      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update inspec profile: ${error.message}`,
      };
    }
  }

  async getCircondcriptionByInspec(
    idInspec: number,
  ): Promise<ServiceResponse<number>> {
    try {
      const inspec = await this.prisma.inspec.findUnique({
        where: {
          id: idInspec,
        },
        select: {
          circonscriptionId: true,
        },
      });
      if (
        inspec !== null &&
        inspec !== undefined &&
        inspec.circonscriptionId !== null
      ) {
        return { success: true, data: inspec.circonscriptionId };
      } else {
        return {
          success: false,
          error: 'failed to get the id of circonscription',
        };
      }
    } catch (error) {
      throw new Error(
        `an error occured while trying to get circonscription of inspec ${idInspec}`,
      );
    }
  }

  async etbalissementByCirconscriptionId(
    circonscriptionId: number,
  ): Promise<ServiceResponse<Etablissement[]>> {
    try {
      const result = await this.prisma.circonscription.findUnique({
        where: {
          id: circonscriptionId,
        },
        include: {
          Etablissement: true,
        },
      });
      if (result !== null && result !== undefined) {
        return { success: true, data: result.Etablissement };
      } else {
        return {
          success: false,
          error: `failed to get etablissement of circonscription ${circonscriptionId}`,
        };
      }
    } catch (error) {
      throw new Error(
        `failed to get etablissement of conscription ${circonscriptionId}`,
      );
    }
  }

  async profParEtablissement(EtablissementId: number): Promise<ServiceResponse<any>> {
    try {
      const result = await this.prisma.etablissement.findUnique({
        where: {
          id: EtablissementId,
        },
        include: {
          Prof: {
            include: {
              User: {
                select: {
                  email: true,
                },
              },
              profDiplome: {
                select: {
                  id: true,
                  nom: true,
                  lieu: true,
                  dateObtention: true,
                },
              },
            },
          },
        },
      });

      if (result && result.Prof) {
        return {
          success: true,
          data: result.Prof,
        };
      } else {
        return {
          success: false,
          error: `No establishment found with ID ${EtablissementId}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch professors for establishment ${EtablissementId}: ${error.message}`,
      };
    }
  }

  async getProfesseursByInspec(inspecId: number): Promise<ServiceResponse<any[]>> {
    try {
      // Get inspector's circonscription
      const circonscriptionResult = await this.getCircondcriptionByInspec(inspecId);
      
      if (!circonscriptionResult.success) {
        return {
          success: false,
          error: circonscriptionResult.error,
        };
      }

      // Get establishments in the circonscription
      const etablissementsResult = await this.etbalissementByCirconscriptionId(
        circonscriptionResult.data!,
      );

      if (!etablissementsResult.success) {
        return {
          success: false,
          error: etablissementsResult.error,
        };
      }

      if (!etablissementsResult.data || etablissementsResult.data.length === 0) {
        return {
          success: false,
          error: 'No establishments found in this circonscription',
        };
      }

      // Get all professors from all establishments
      const allProfessors: any[] = [];
      const errors: string[] = [];

      for (const etablissement of etablissementsResult.data) {
        const profsResult = await this.profParEtablissement(etablissement.id);
        
        if (profsResult.success && profsResult.data) {
          // Add establishment info to each professor
          const profsWithEtab = profsResult.data.map((prof: any) => ({
            ...prof,
            etablissementNom: etablissement.nom,
            etablissementAddress: etablissement.address,
          }));
          allProfessors.push(...profsWithEtab);
        } else if (!profsResult.success) {
          errors.push(`Failed to fetch professors from ${etablissement.nom}: ${profsResult.error}`);
        }
      }

      if (allProfessors.length === 0 && errors.length > 0) {
        return {
          success: false,
          error: `Failed to fetch professors: ${errors.join('; ')}`,
        };
      }

      return {
        success: true,
        data: allProfessors,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch professors for inspector ${inspecId}: ${error.message}`,
      };
    }
  }
}
