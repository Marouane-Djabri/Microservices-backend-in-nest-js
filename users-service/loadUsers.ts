// import { PrismaClient, Jours, Horaire, Classe } from "generated/prisma";

// const prisma = new PrismaClient();

// async function main() {
//     // Retrieve all professors
//     const profs = await prisma.prof.findMany();

//     if (profs.length === 0) {
//         console.log("No professors found.");
//         return;
//     }

//     // Array of days from Sunday to Thursday based on the Jours enum
//     const days: Jours[] = [
//         Jours.Dimanche,
//         Jours.Lundi,
//         Jours.Mardi,
//         Jours.Mercredi,
//         Jours.Jeudi,
//     ];

//     for (const prof of profs) {
//         for (const day of days) {
//             await prisma.planning.create({
//                 data: {
//                     jour: day,
//                     // Set a default horario and class; change as needed
//                     creneau: Horaire.H09_10,
//                     classe: Classe.AM1,
//                     salle: "101", // can be any default room identifier
//                     profId: prof.id,
//                 },
//             });
//             console.log(`Created planning for Prof ID ${prof.id} on ${day}`);
//         }
//     }

//     console.log("Planning created for all professors.");
// }

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });