import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { CredModule } from './cred/cred.module';

@Module({
  imports: [
    CredModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule { }
