import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Options } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { jwtConstants } from 'src/constants/constants';
import { refreshPayload } from 'src/customTypes/auth.types';
import { AuthCredentials, User } from 'src/sharedTypes/model.types';
import { ServiceResponse } from 'src/sharedTypes/response.types';
require('dotenv').config(); 
@Injectable()
export class CredService {
  constructor(private readonly jwtService: JwtService) {}
  async generateToken(data: User)  : Promise<ServiceResponse <AuthCredentials>>{
    const payLoad = { email: data.email, id: data.id, role: data.role  , roleId : data.profId ?? data.inspecId };
    try {
      const accessToken = await this.jwtService.signAsync(payLoad, {
        secret: process.env.ACCESS_SECRET,
      });
      const refreshToken = await this.jwtService.signAsync(payLoad, {
        secret: process.env.REFRESH_SECRET,
      });
      if (!accessToken || !refreshToken) {
        return { success: false, error: 'Error generating tokens' };
      }
      return { success : true , data : { accessToken: accessToken, refreshToken: refreshToken, ...data } };
    } catch (error) {
      throw new Error('Error generating tokens');
    }
  }

  async RefreshAccessToken(payload: refreshPayload) {
    try {
      await this.jwtService.verifyAsync(payload.refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch (error) {
      throw new RpcException('Invalid refresh token');
    }
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_SECRET,
        expiresIn: '60s',
      }),
    };
  }
}
