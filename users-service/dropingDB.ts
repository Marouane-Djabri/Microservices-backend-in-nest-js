// import { PrismaClient } from "generated/prisma";

// const prisma = new PrismaClient();

// async function main() {
//     await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS Planning;`);
//     console.log("Table Planning dropped (if it existed)");
// }

// main()
//     .catch((e) => {
//         console.error("Error dropping table", e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });