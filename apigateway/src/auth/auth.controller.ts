import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDTO } from 'src/common/DTO/users.dto';
import { firstValueFrom } from 'rxjs';
import { LoginDTO } from 'src/common/DTO/login.dto';
import { refreshPayload } from 'src/customTypes/auth.types';
import { ChangePasswordDTO } from 'src/common/DTO/changePassword.dto';
import { AuthGuard, IsInspec } from 'src/guards/my.guards';
import { Public } from 'src/utils/pulic.metadata';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USERS_SERVICE') private usersService: ClientProxy,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
  ) {}

  @UseGuards(IsInspec)
  @UseGuards(AuthGuard)
  @Post('register')
  async register_user(@Body() registerDTO: RegisterDTO) {
    return await firstValueFrom(
      this.usersService.send('user-register', registerDTO),
    );
  }

  @Public()
  @Post('login')
  async login_user(@Req() request: Request, @Res() res: Response) {
    try {
      const userServiceResponse = await firstValueFrom(
        this.usersService.send('user-login', request.body),
      );
      if (userServiceResponse.success) {
        const data = userServiceResponse.data;
        const authServiceResponse = await firstValueFrom(
          this.authService.send('auth', data),
        );
        if (authServiceResponse.success) {
          return res.status(200).json({
            status: 'success',
            success: true,
            data: authServiceResponse.data,
          });
        } else {
          return res.status(400).json({
            status: 'success',
            success: false,
            message: 'failed to generate credentials',
            error: authServiceResponse.error,
          });
        }
      } else {
        return res.status(400).json({
          status: 'success',
          success: false,
          message: 'failed to find user',
          error: userServiceResponse.error,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'Failure'  , message: 'Internal server error', error: error });
    }
  }

  @Public()
  @Post('refreshToken')
  async refreshAccessToken(@Body() payload: refreshPayload) {
    try {
      const token = await firstValueFrom(
        this.authService.send('refreshToken', payload),
      );
      return token;
    } catch (RpcException) {
      throw new HttpException(
        'refresh token failed  , verify the refreshToken',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('changePassword')
  async changePassword(@Body() payload: ChangePasswordDTO) {
    try {
      return await firstValueFrom(
        this.usersService.send('change-password', payload),
      );
    } catch (RpcException) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
