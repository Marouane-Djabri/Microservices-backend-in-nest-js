import { Body, Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ChangePasswordDTO } from 'src/common/DTO/changePassword.dto';
import { LoginDTO } from 'src/common/DTO/login.dto';
import { RegisterDTO } from 'src/common/DTO/users.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../common/sharedTypes/model.types';
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Register user with nested Inspec or Prof creation
  @MessagePattern('user-register')
  async register(@Payload() registerDTO: RegisterDTO) {
    const { email, password, role } = registerDTO;

    try {
      const hashedPassword = await this.usersService.hashPassword(password);
      if (role === 'INSPEC') {
        return await this.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: Role.INSPEC,
            Inspec: {
              create: {},
            },
          },
        });
      } else if (role === 'PROF') {
        return await this.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: Role.PROF,
            Prof: {
              create: {},
            },
          },
        });
      } else {
        throw new Error(`Unsupported role: ${role}`);
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      throw error;
    }
  }

  // Login handler
  @MessagePattern('user-login')
  async loginUserHandler(@Payload() loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    try {
      return await this.usersService.handleLoginService(email, password);
    } catch (error) {
      throw new Error(' an error occured in the userService', error);
    }
  }

  // Change password handler
  @MessagePattern('change-password')
  async changePasswordHandler(@Payload() payload: ChangePasswordDTO) {
    try {
      const { email } = payload;
      await this.emailService.sendEmail(email);

      return {
        status: 200,
        message: 'success',
        email,
      };
    } catch (error) {
      console.error(
        'Error while trying to send an email in change-password:',
        error,
      );
      throw error;
    }
  }
}
