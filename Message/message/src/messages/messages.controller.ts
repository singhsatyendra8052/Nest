import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
@Controller('messages')
export class MessagesController {
  // messagesService: MessagesService;
  // constructor() {
  //   // use dependency injection in real app
  //   this.messagesService = new MessagesService();
  // }
  constructor(public messagesService: MessagesService) {
    // Dependency injection is used here to inject the MessagesService
    // This is a better practice than creating an instance manually
  }
  @Get()
  listMessages() {
    return this.messagesService.findAll();
  }

  @Post()
  createMessages(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body.content);
  }

  @Get('/:id')
  async getMessageById(@Param('id') id: string) {
    // Logic to get a message by ID
    // return this.messagesService.findOne(id);
    const message = await this.messagesService.findOne(id);
    if (!message) {
      return new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }
}
