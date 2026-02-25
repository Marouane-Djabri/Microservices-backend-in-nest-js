import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Classe } from './updatePlanning.dto';

export class newPaperDTO {
  @Type(() => Date)
  @IsDate()
  date: Date;

  classe?: Classe;

   @IsOptional ()
  @IsString()
  description?: string;

  @IsOptional ()
  @IsString()
  observation?: string;
}

export class editPaperDTO {
  id: number;
  date: Date
  classe?: Classe;

  @IsString()
  description?: string;

  @IsString()
  observation?: string;
}
