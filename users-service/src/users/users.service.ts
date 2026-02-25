import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ServiceResponse } from 'src/common/sharedTypes/response.types';
import { User } from '../common/sharedTypes/model.types';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
  async handleLoginService(
    email: string,
    password: string,
  ): Promise<ServiceResponse<User>> {
    try {
      console.log('trying to fetch email', email);
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
        include: {
          Prof: true,
          Inspec: true,
        },
      });
      if (user !== null) {
        console.log('the problem is while checking the password');
        const isMatch = await this.isPasswordValid(user, password);
        if (isMatch) {
          return {
            success: true,
            data: {
              id: user.id,
              email: user.email,
              role: user.role,
              profId: user?.Prof?.id,
              inspecId: user?.Inspec?.id,
            },
          };
        } else {
          return { success: false, error: 'Invalid password' };
        }
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      this.logger.error('Error occurred while checking email existence', error);
      throw new Error('an error occured when checking email existence');
    }
  }

  async isPasswordValid(user: any, password: string): Promise<Boolean> {
    // a function to check if the password is valid
    // here we don't hach but reverse the hach of the password
    // in a real world application we should use bcrypt.compare
    // but here for simplicity we will just compare the strings
    const isValid = await bcrypt.compare(password, user.password);
    return isValid;
    // const isValid = user.password === password;
    // return isValid;
  }
}
