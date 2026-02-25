export interface User {
  id: number;
  email: string;
  role: 'INSPEC' | 'PROF';
  profId?: number;
  inspecId?: number;
}

export interface AuthCredentials extends User {
  accessToken: string;
  refreshToken: string;
}

export interface Etablissement {
  id: number;
  nom: string;
  adresse?: string;
  circonscriptionId?: number;
}

export interface ProfDiplome {
  id: number;
  nom: string;
  dateObtention: Date;
  lieu: string;
  profId: number;
}
export interface Prof {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  dateNaissance?: Date;
  lieuNaissance?: string;
  nationalite?: string;
  situationFamiliale?: string;
  nbEnfants?: number;
  etablissementId?: number;
  grade?: string;
  echelon?: number;
  dateEffetEchelon?: Date;
  premNomin?: Date;
  premCofirm?: Date;
  dernVisite?: Date;
  note?: number;
  createdAt: Date;
  updatedAt: Date;
  etablissement?: Etablissement;
  diplomes?: ProfDiplome[];
}
