import { IsEmail, IsString, MinLength } from 'class-validator';

enum Role {
  INSPEC,
  PROF
}
export class RegisterDTO {

  @IsString()
  email: string;

  @IsString()
  password: string;

  role: Role;
}
