import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fillProfAndInspec() {
  try {
    console.log('🌱 Starting to seed Prof and Inspec data...');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Circonscription first
    const circonscription = await prisma.circonscription.create({
      data: {
        nom: 'Circonscription de Casablanca Centre'
      }
    });
    console.log('✅ Circonscription created:', circonscription.nom);

    // Create Etablissement
    const etablissement = await prisma.etablissement.create({
      data: {
        nom: 'École Primaire Al Wifaq',
        address: '123 Rue Mohammed V, Casablanca',
        telephone: '+212522123456',
        typeEtablissement: 'PUBLIQUE',
        circonscriptionId: circonscription.id
      }
    });
    console.log('✅ Etablissement created:', etablissement.nom);

    // Create User for Inspector
    const inspectorUser = await prisma.user.create({
      data: {
        email: 'inspector@education.ma',
        password: hashedPassword,
        role: 'INSPEC'
      }
    });
    console.log('✅ Inspector User created:', inspectorUser.email);

    // Create Inspector with all fields
    const inspector = await prisma.inspec.create({
      data: {
        nom: 'Bennani',
        prenom: 'Ahmed',
        telephone: '+212661234567',
        userId: inspectorUser.id,
        circonscriptionId: circonscription.id
      }
    });
    console.log('✅ Inspector created:', `${inspector.prenom} ${inspector.nom}`);

    // Create User for Professor
    const professorUser = await prisma.user.create({
      data: {
        email: 'professor@education.ma',
        password: hashedPassword,
        role: 'PROF'
      }
    });
    console.log('✅ Professor User created:', professorUser.email);

    // Create Professor with all fields
    const professor = await prisma.prof.create({
      data: {
        etablissementId: etablissement.id,
        nom: 'Alami',
        prenom: 'Fatima',
        telephone: '+212662345678',
        userId: professorUser.id,
        dateNaissance: new Date('1985-03-15'),
        lieuNaissance: 'Rabat, Maroc',
        nationalite: 'Marocaine',
        situationFamiliale: 'Mariée',
        nbEnfants: 2,
        grade: 'Professeur Principal',
        echelon: 5,
        dateEffetEchelon: new Date('2020-09-01'),
        premNomin: new Date('2010-09-01'),
        premCofirm: new Date('2012-09-01'),
        dernVisite: new Date('2024-05-15'),
        note: 18
      }
    });
    console.log('✅ Professor created:', `${professor.prenom} ${professor.nom}`);

    // Create Professor Diplomas
    const diplomas = await prisma.profDiplome.createMany({
      data: [
        {
          nom: 'Licence en Sciences de l\'Éducation',
          lieu: 'Université Mohammed V, Rabat',
          dateObtention: new Date('2008-06-30'),
          profId: professor.id
        },
        {
          nom: 'Master en Pédagogie',
          lieu: 'École Normale Supérieure, Casablanca',
          dateObtention: new Date('2010-07-15'),
          profId: professor.id
        },
        {
          nom: 'Certificat de Formation Continue',
          lieu: 'Centre de Formation des Enseignants, Casablanca',
          dateObtention: new Date('2022-12-20'),
          profId: professor.id
        }
      ]
    });
    console.log('✅ Professor Diplomas created:', diplomas.count, 'diplomas');

    // Create Planning for Professor
    const planning = await prisma.planning.createMany({
      data: [
        {
          jour: 'Lundi',
          creneau: 'H08_09',
          classe: 'AM1',
          type: 'Cours Magistral',
          profId: professor.id
        },
        {
          jour: 'Lundi',
          creneau: 'H09_10',
          classe: 'AM1',
          type: 'Travaux Dirigés',
          profId: professor.id
        },
        {
          jour: 'Mardi',
          creneau: 'H08_09',
          classe: 'AM2',
          type: 'Cours Magistral',
          profId: professor.id
        },
        {
          jour: 'Mardi',
          creneau: 'H10_11',
          classe: 'AM2',
          type: 'Évaluation',
          profId: professor.id
        },
        {
          jour: 'Mercredi',
          creneau: 'H08_09',
          classe: 'AM3',
          type: 'Cours Magistral',
          profId: professor.id
        },
        {
          jour: 'Jeudi',
          creneau: 'H09_10',
          classe: 'AM4',
          type: 'Travaux Pratiques',
          profId: professor.id
        },
        {
          jour: 'Jeudi',
          creneau: 'H11_12',
          classe: 'AM1',
          type: 'Révision',
          profId: professor.id
        }
      ]
    });
    console.log('✅ Planning created:', planning.count, 'sessions');

    // Create Cahier Journal entries
    const cahierJournal = await prisma.cahierJournal.createMany({
      data: [
        {
          date: new Date('2024-12-15'),
          classe: 'AM1',
          description: 'Introduction aux mathématiques de base. Révision des nombres de 1 à 100. Exercices d\'addition et de soustraction simples. Les élèves ont bien participé et ont montré un bon niveau de compréhension.',
          observation: 'Très bonne participation des élèves. Ahmed a eu quelques difficultés avec les soustractions, prévoir un soutien individualisé. Matériel pédagogique suffisant.',
          profId: professor.id
        },
        {
          date: new Date('2024-12-16'),
          classe: 'AM2',
          description: 'Leçon de français : étude des verbes du premier groupe au présent. Conjugaison des verbes "chanter", "marcher", "parler". Dictée de mots simples et exercices d\'application.',
          observation: 'Les élèves maîtrisent bien la conjugaison. Quelques erreurs d\'orthographe persistent chez 3 élèves. Prévoir des exercices supplémentaires de dictée.',
          profId: professor.id
        },
        {
          date: new Date('2024-12-17'),
          classe: 'AM3',
          description: 'Sciences naturelles : le cycle de l\'eau. Explication des différentes phases (évaporation, condensation, précipitation). Expérience pratique avec un récipient d\'eau chaude.',
          observation: 'Expérience très appréciée par les élèves. Excellente compréhension du phénomène. Salma a posé des questions très pertinentes sur la formation des nuages.',
          profId: professor.id
        },
        {
          date: new Date('2024-12-18'),
          classe: 'AM4',
          description: 'Histoire du Maroc : les dynasties marocaines. Focus sur la dynastie Alaouite. Utilisation de la carte historique et de documents iconographiques.',
          observation: 'Sujet complexe mais bien assimilé. Les élèves ont montré un grand intérêt pour l\'histoire de leur pays. Prévoir une sortie pédagogique au musée.',
          profId: professor.id
        },
        {
          date: new Date('2024-12-19'),
          classe: 'AM2',
          description: 'Évaluation formative en mathématiques : problèmes de géométrie simple. Reconnaissance des formes géométriques de base (carré, rectangle, triangle, cercle).',
          observation: 'Résultats satisfaisants dans l\'ensemble. 2 élèves en difficulté nécessitent un accompagnement renforcé. Matériel géométrique à renouveler.',
          profId: professor.id
        }
      ]
    });
    console.log('✅ Cahier Journal created:', cahierJournal.count, 'entries');

    // Display summary
    console.log('\n📊 SUMMARY:');
    console.log('===========');
    console.log(`🏫 Circonscription: ${circonscription.nom}`);
    console.log(`🏢 Établissement: ${etablissement.nom}`);
    console.log(`👨‍💼 Inspecteur: ${inspector.prenom} ${inspector.nom} (${inspectorUser.email})`);
    console.log(`👩‍🏫 Professeur: ${professor.prenom} ${professor.nom} (${professorUser.email})`);
    console.log(`🎓 Diplômes: ${diplomas.count}`);
    console.log(`📅 Séances de planning: ${planning.count}`);
    console.log(`📝 Entrées cahier journal: ${cahierJournal.count}`);
    console.log('\n🔑 Login credentials:');
    console.log(`Inspector: ${inspectorUser.email} / password123`);
    console.log(`Professor: ${professorUser.email} / password123`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
fillProfAndInspec()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
