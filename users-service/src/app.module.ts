import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { EmailModule } from './email/email.module';
import { InspecController } from './inspec/inspec.controller';
import { InspecService } from './inspec/inspec.service';
import { PrismaService } from './prisma/prisma.service';
import { ProfCotnroller } from './prof/prof.controller';
import { ProfService } from './prof/prof.service';

@Module({
  imports: [EmailModule],
  controllers: [AppController, UsersController, InspecController, ProfCotnroller ],
  providers: [AppService, UsersService, InspecService, PrismaService, ProfService , Logger],
  exports: [UsersService]
})
export class AppModule { }
