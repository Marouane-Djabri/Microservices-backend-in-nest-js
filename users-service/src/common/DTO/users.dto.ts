import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
export class RegisterDTO {

  // @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role, { message: `Role must be one of the following: ${Object.values(Role).join(', ')}` })
  role: Role;
}
