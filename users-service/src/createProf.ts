
// import { PrismaClient } from "generated/prisma";

// const prisma = new PrismaClient();

// enum Role {
//   PROF = 'PROF'
// }

// interface userInput {
//   email: string;
//   password: string;
//   role: Role;
// }

// interface profInput {
//   nom?: string;
//   prenom?: string;
//   telephone?: string;
// }

// function generateRandomId() {
//   return Math.floor(Math.random() * 8) + 1;
// }

// const usersData: userInput[] = [
//   { email: 'test1@gmail.com', password: 'password1', role: Role.PROF },
//   { email: 'test2@gmail.com', password: 'password2', role: Role.PROF },
//   { email: 'test3@gmail.com', password: 'password3', role: Role.PROF },
// ];

// const profData: profInput[] = [
//   { nom: 'Doe', prenom: 'John', telephone: '123456789' },
//   { nom: 'Smith', prenom: 'Jane', telephone: '987654321' },
//   { nom: 'Brown', prenom: 'Alice', telephone: '555555555' },
// ];

// async function createUsers(payload: userInput[]) {
//   return await prisma.$transaction(
//     payload.map(user => prisma.user.create({ data: user }))
//   );
// }

// async function createProf(payload: profInput[], createdUsers: { id: number }[]) {
//   if (payload.length !== createdUsers.length) {
//     throw new Error("Mismatch between prof input and created users");
//   }

//   return await prisma.$transaction(
//     payload.map((prof, index) => {
//       return prisma.prof.create({
//         data: {
//           etablissementId: generateRandomId(),
//           nom: prof.nom,
//           prenom: prof.prenom,
//           telephone: prof.telephone,
//           userId: createdUsers[index].id
//         }
//       });
//     })
//   );
// }

// async function main() {
//   const users = await createUsers(usersData);
//   const profs = await createProf(profData, users);
//   console.log("Users and Profs created!");
//   await prisma.$disconnect();
// }

// main().catch(console.error);
