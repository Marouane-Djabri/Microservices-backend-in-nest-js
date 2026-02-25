import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient () ;  
async function dropTable(tableName) {
 const response =  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${tableName};`);
 console.log (response) ;
}

// Usage
dropTable('Planning');
