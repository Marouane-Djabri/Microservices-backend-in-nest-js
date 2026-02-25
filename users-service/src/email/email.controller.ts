// import { Body, Controller, Get, Res } from "@nestjs/common";
// import { MessagePattern } from "@nestjs/microservices";
// import { EmailService } from "./email.service";
// import { EmailSendingError } from "src/utils/customExceptions/custom.exceptions";
//
//
// @Controller()
// export class EmailController {
//
//   constructor(private readonly mailService: EmailService) { }
//   @MessagePattern('send-mail')
//   async sendEmail(@Res() response: any, @Body() email: string) {
//
//     try {
//       const mail = this.mailService.sendEmail(email);
//     } catch (error) {
//       throw new EmailSendingError(' an errror occured while sending the email');
//     }
//   }
// }
