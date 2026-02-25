import { Module } from '@nestjs/common';
// import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.Host,
        auth: {
          user: process.env.Username,
          pass: process.env.Password,
        },
      },
    }),
    ConfigModule.forRoot({ envFilePath: '../../.env', isGlobal: true }),
  ],
  // controllers: [EmailContoller],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
