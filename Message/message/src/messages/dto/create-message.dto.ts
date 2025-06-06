import { IsString } from 'class-validator';
export class CreateMessageDto {
  @IsString()
  content: string;
}

// This DTO (Data Transfer Object) is used to define the structure of the data
// we will use it to check the validity of the data we receive
// so insteaf of givin bod:any we will give body:CreateMessageDto
