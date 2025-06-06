import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  Delete,
  NotFoundException,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/users.dto';
import { Serialize } from '../interceptors/serialze.intercept';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorators';
import { User } from './users.entity';
import { AuthGuard } from './guards/auth.guard';
@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor) to setup globally we apply this interceptor in use.module.ts
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    // this.usersService.create(body.email, body.password);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  // @UseInterceptors(new SerializeInterceptor(UserDto))

  // for gloabal application of the same interceptors apply the custom decorators at
  // the top of the controllers class
  @Get('id/:id')
  async findUser(@Param('id') id: string, @Session() session: any) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
  @Get('/signout')
  signout(@Session() session: any) {
    if (!session.userId) {
      throw new UnauthorizedException('You are not signed in');
    }
    session.userId = null;
    return 'You have been signed out';
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async getUser(@CurrentUser() user: User) {
    return user;
  }
  // to get the current user
}
