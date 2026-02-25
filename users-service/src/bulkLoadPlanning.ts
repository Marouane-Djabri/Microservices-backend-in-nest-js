// import { Planning, PrismaClient, Salle } from '../generated/prisma/';
// import { Jours, Horaire, Classe } from '../generated/prisma';
// // insranciating the prisma client 
// const prisma = new PrismaClient();
// // defining the data interfaces  : 
// interface SalleInput {
//   nom?: string;
// }
// // defining the data : 
// const salleData: SalleInput[] = [
//   { nom: 'Salle A' },
//   { nom: 'Salle B' },
//   { nom: 'Salle C' },
// ]
// // planning data : 
// const planningRecords = [
//   {
//     jour: 'Dimanche',
//     creneau: 'H08_09',
//     classe: 'AM1',
//   },
//   {
//     jour: 'Lundi',
//     creneau: 'H10_11',
//     classe: 'AM2',
//   },
//   {
//     jour: 'Mardi',
//     creneau: 'H13_14',
//     classe: 'AM3',
//   },
//   {
//     jour: 'Mercredi',
//     creneau: 'H15_16',
//     classe: 'AM4',
//   },
//   {
//     jour: 'Jeudi',
//     creneau: 'H11_12',
//     classe: 'AM1',
//   },
// ];

// async function createSalle(salleData: SalleInput[]): Promise<Salle[]> {
//   return await prisma.$transaction(
//     salleData.map((salle) => {
//       return prisma.salle.create({
//         data: {
//           nom: salle.nom
//         }
//       })
//     })
//   )
// }

// async function createPlanning(salle: Salle[], planningData: any): Promise<Planning[]> {

//   return await prisma.$transaction(planningData.map((planning) => {
//     return prisma.planning.create({
//       data: {
//         jour: planning.jour as Jours,
//         creneau: planning.creneau as Horaire,
//         classe: planning.classe as Classe,
//         salleId: salle[Math.floor(Math.random() * salle.length)].id,  // Randomly assign a salle from the created salles
//         profId: 3,
//       }
//     })
//   }))
// }

// async function main() {
//   try {
//     const createdSalle = await createSalle(salleData);
//     const createdPlanning = await createPlanning(createdSalle, planningRecords);
//     console.log('Salles created:', createdSalle);
//     console.log(createdPlanning)
//   } catch (error) {
//     console.error('Error creating data:', error);
//   } finally {
//     prisma.$disconnect();
//   }
// }

// main(); 
