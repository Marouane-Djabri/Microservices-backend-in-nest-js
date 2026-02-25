import { Controller, ServiceUnavailableException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CredService } from './cred.service';
import { refreshPayload } from 'src/customTypes/auth.types';
import { ServiceResponse } from 'src/sharedTypes/response.types';
import { AuthCredentials, User } from 'src/sharedTypes/model.types';
@Controller()
export class CredController {
  constructor(private readonly credService: CredService) {}
  @MessagePattern('auth')
  async generateCredentials(
    data: User,
  ): Promise<ServiceResponse<AuthCredentials>> {
    try {
      return await this.credService.generateToken(data);
    } catch (error) {
      throw new Error('Error generating tokens', error);
    }
  }

  @MessagePattern('refreshToken')
  async refreshToken(payload: refreshPayload): Promise<{
    accessToken: string;
  }> {
    return await this.credService.RefreshAccessToken(payload);
  }
}
