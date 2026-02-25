import { IsEmail, IsString, IsSurrogatePair } from "class-validator";

export class ChangePasswordDTO {
  @IsString()
  email: string;
}
