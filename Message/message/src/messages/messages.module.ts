import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';

import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  // the providers are the services that can be injected into the controllers
  // it can be used as a dependancy for the other classes
})
export class MessagesModule {}
