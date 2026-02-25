import { Module } from '@nestjs/common';
import { CredService } from './cred.service';
import { CredController } from './cred.controller';
import { ClientsModule } from '@nestjs/microservices';
import { JwtModule} from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.accessSecret  , 
      signOptions: { expiresIn: '8h' },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.refreshSecret , 
      signOptions: { expiresIn: '7d' },
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        }

      }
    ])
  ],
  providers: [CredService],
  controllers: [CredController]
})
export class CredModule { }
