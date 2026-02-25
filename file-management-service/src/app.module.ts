import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CahierJournalController } from './cahierJournal/cahierJournal.controller';
import { CahierJournalService } from './cahierJournal/cahierJournal.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, CahierJournalController],
  providers: [AppService, CahierJournalService, PrismaService],
})
export class AppModule { }
