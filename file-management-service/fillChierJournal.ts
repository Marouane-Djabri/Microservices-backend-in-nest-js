import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fillCahierJournalTable() {
  console.log("🗂️  Starting to fill CahierJournal table...")  ; 
  try {
    const response = await prisma.cahierJournal.createMany({
        data: [
            {
                date: new Date('2025-09-01'),
                classe: 'AM1',
                description: 'Introduction aux mathématiques - Nombres entiers',
                observation: 'Les élèves ont bien participé, quelques difficultés sur les grands nombres',
                profId: 1,
            }, 
        ]
    });
    console.log("✅ CahierJournal table filled successfully!", response);
  } catch (error) {
    console.error("❌ Error filling CahierJournal table:", error);
  }
};


fillCahierJournalTable();