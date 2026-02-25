import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) { }
  async sendEmail(email: string) {
    const message = 'vous avez oublié votre mot de passe ? , sinon svp ignorer ce mail';
    this.mailService.sendMail({
      from: 'DJABRI MAROUANE < nm_djabri@esi.dz>',
      to: email,
      subject: `mot de passe oublié`,
      text: message,
    });
  }
}
