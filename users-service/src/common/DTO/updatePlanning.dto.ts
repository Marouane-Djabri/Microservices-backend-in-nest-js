enum Jours {
  Dimanche,
  Lundi,
  Mardi,
  Mercredi,
  Jeudi,
}


enum Horaire {
  H08_09,
  H09_10,
  H10_11,
  H11_12,
  H12_13,
  H13_14,
  H14_15,
  H15_16,
  H16_17,
}

export enum Classe {
  AM1,
  AM2,
  AM3,
  AM4,
}

export class updatePlanningDto {
  jour?: Jours;
  creneau?: Horaire;
  classe?: Classe;
  salle? : string ; 
  profId?: number;
  id: number;
}