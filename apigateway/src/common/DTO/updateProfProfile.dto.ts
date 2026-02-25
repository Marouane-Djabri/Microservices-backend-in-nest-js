export class UpdateProfProfileDto {
    id : number;
    etablissementId? :number;
    nom?  : string;
    prenom?  : string;
    telephone? : string;
    dateNaissance? : Date;
    lieuNaissance? : string ;  
    nationalite? : string  ; 
    situationFamiliale? : string  ; 
    address? : string  ; 
    grade? : string ; 
    echelle? : number  ;
    dateEffetEchelon? : Date ;
    premNomin? : Date  ; 
    premCofirm? : Date ; 
    dernVisite? : Date 
    note? : number  ; 
}

export class UpdateProfDiplomeDto {
    profId : number  ; 
    id : number  ;
    nom? : string  ;
    dateObtention? : Date  ;
    lieu? : string  ;
}