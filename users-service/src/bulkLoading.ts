// // bulk-load.js
// import { PrismaClient, TypeEtablissement, Role } from '../generated/prisma/';

// const prisma = new PrismaClient();

// async function bulkLoadData() {
//   try {
//     console.log('Starting bulk data load...');

//     // 1. CIRCONSCRIPTIONS DATA
//     const circonscriptionsData = [
//       { nom: 'Circonscription Centre' },
//       { nom: 'Circonscription Est' },
//       { nom: 'Circonscription Ouest' },
//       { nom: 'Circonscription Nord' },
//       { nom: 'Circonscription Sud' },
//     ];

//     // 2. ETABLISSEMENTS DATA
//     const etablissementsData = [
//       {
//         nom: 'Lycée Ibn Khaldoun',
//         address: '123 Rue de la République, Alger',
//         telephone: '+213 21 123 456',
//         typeEtablissement: TypeEtablissement.PUBLIQUE,
//         circonscriptionId: 1 // Will be mapped after circonscriptions are created
//       },
//       {
//         nom: 'École Privée Al-Hikmah',
//         address: '456 Boulevard Mohamed V, Alger',
//         telephone: '+213 21 789 012',
//         typeEtablissement: TypeEtablissement.PRIVEE,
//         circonscriptionId: 2
//       },
//       {
//         nom: 'Collège El-Moudjahid',
//         address: '789 Avenue de l\'Indépendance, Alger',
//         telephone: '+213 21 345 678',
//         typeEtablissement: TypeEtablissement.PUBLIQUE,
//         circonscriptionId: 1
//       },
//       {
//         nom: 'Institut Technique Supérieur',
//         address: '321 Rue des Martyrs, Alger',
//         telephone: '+213 21 901 234',
//         typeEtablissement: TypeEtablissement.PUBLIQUE,
//         circonscriptionId: 3
//       }
//     ];

//     // 3. USERS DATA (for Inspectors)
//     const inspectorsUsersData = [
//       {
//         email: 'inspec1@education.dz',
//         password: '$2b$10$hashedpassword1', // You should hash these properly
//         role: Role.INSPEC
//       },
//       {
//         email: 'inspec2@education.dz',
//         password: '$2b$10$hashedpassword2',
//         role: Role.INSPEC
//       },
//       {
//         email: 'inspec3@education.dz',
//         password: '$2b$10$hashedpassword3',
//         role: Role.INSPEC
//       }
//     ];

//     // Execute in a transaction to ensure data consistency
//     await prisma.$transaction(async (tx) => {

//       // STEP 1: Create Circonscriptions
//       console.log('Creating Circonscriptions...');
//       const circonscriptionsResult = await tx.circonscription.createMany({
//         data: circonscriptionsData,
//         skipDuplicates: true
//       });
//       console.log(`✓ Created ${circonscriptionsResult.count} circonscriptions`);

//       // Get created circonscriptions for mapping
//       const createdCirconscriptions = await tx.circonscription.findMany({
//         orderBy: { id: 'asc' }
//       });

//       // STEP 2: Create Etablissements
//       console.log('Creating Etablissements...');

//       // Map circonscriptionId to actual IDs
//       const etablissementsWithCorrectIds = etablissementsData.map(etab => ({
//         nom: etab.nom,
//         address: etab.address,
//         telephone: etab.telephone,
//         typeEtablissement: etab.typeEtablissement,
//         circonscriptionId: createdCirconscriptions[etab.circonscriptionId - 1]?.id || null
//       }));

//       const etablissementsResult = await tx.etablissement.createMany({
//         data: etablissementsWithCorrectIds,
//         skipDuplicates: true
//       });
//       console.log(`✓ Created ${etablissementsResult.count} etablissements`);

//       // STEP 3: Create Users for Inspectors
//       console.log('Creating Inspector Users...');
//       const usersResult = await tx.user.createMany({
//         data: inspectorsUsersData,
//         skipDuplicates: true
//       });
//       console.log(`✓ Created ${usersResult.count} inspector users`);

//       // Get created users for mapping
//       const createdUsers = await tx.user.findMany({
//         where: { role: 'INSPEC' },
//         orderBy: { createdAt: 'asc' }
//       });

//       // STEP 4: Create Inspectors
//       console.log('Creating Inspectors...');
//       const inspecsData = [
//         {
//           nom: 'Benali',
//           prenom: 'Ahmed',
//           telephone: '+213 555 123 456',
//           userId: createdUsers[0]?.id,
//           circonscriptionId: createdCirconscriptions[0]?.id
//         },
//         {
//           nom: 'Mansouri',
//           prenom: 'Fatima',
//           telephone: '+213 555 789 012',
//           userId: createdUsers[1]?.id,
//           circonscriptionId: createdCirconscriptions[1]?.id
//         },
//         {
//           nom: 'Khaled',
//           prenom: 'Omar',
//           telephone: '+213 555 345 678',
//           userId: createdUsers[2]?.id,
//           circonscriptionId: createdCirconscriptions[2]?.id
//         }
//       ];

//       // Filter out any inspecs with missing user or circonscription IDs
//       const validInspecsData = inspecsData.filter(inspec =>
//         inspec.userId && inspec.circonscriptionId
//       );

//       if (validInspecsData.length > 0) {
//         const inspecsResult = await tx.inspec.createMany({
//           data: validInspecsData,
//           skipDuplicates: true
//         });
//         console.log(`✓ Created ${inspecsResult.count} inspectors`);
//       } else {
//         console.log('⚠️ No valid inspector data to insert');
//       }
//     });

//     console.log('✅ Bulk data load completed successfully!');

//   } catch (error) {
//     console.error('❌ Error during bulk load:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Alternative function for loading from external data sources
// async function bulkLoadFromFiles() {
//   try {
//     // Example: Load from JSON files
//     // const circonscriptions = JSON.parse(fs.readFileSync('./data/circonscriptions.json', 'utf8'));
//     // const etablissements = JSON.parse(fs.readFileSync('./data/etablissements.json', 'utf8'));

//     // Example: Load from CSV
//     // const csv = require('csv-parser');
//     // const fs = require('fs');

//     // const circonscriptions = [];
//     // fs.createReadStream('./data/circonscriptions.csv')
//     //   .pipe(csv())
//     //   .on('data', (row) => circonscriptions.push(row));

//     console.log('Load your data from files here...');
//   } catch (error) {
//     console.error('Error loading from files:', error);
//   }
// }

// // Execute the bulk load
// bulkLoadData();
