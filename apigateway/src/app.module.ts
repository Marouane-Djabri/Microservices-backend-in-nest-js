import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InspecProfileController } from './INSPEC/profile.controller';
import { InspecPersonnelController } from './INSPEC/perso.controller';
import { ProfProfileController } from './PROF/profile.controller';
import { ProfController } from './PROF/perso.controller';
import { CahierJournalController } from './PROF/cahierJournal.controller';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/my.guards';
import { AuthController } from './auth/auth.controller';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'FILE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    InspecProfileController,
    InspecPersonnelController,
    ProfProfileController,
    ProfController,
    CahierJournalController,
    AuthController,
  ],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
