import { IsString } from "class-validator";

export class updateInspecPorfileDto {
  id: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  circonscriptionId?: string;
}


