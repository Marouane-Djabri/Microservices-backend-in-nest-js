import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Classe } from './updatePlanning.dto';

export class newPaperDTO {
  @Type(() => Date)
  @IsDate()
  date: Date;

  classe?: Classe;

  @IsString()
  description?: string;

  @IsString()
  observation?: string;
}

export class editPaperDTO {
  id: number;

  classe?: Classe;

  @IsString()
  description?: string;

  @IsString()
  observation?: string;
}
