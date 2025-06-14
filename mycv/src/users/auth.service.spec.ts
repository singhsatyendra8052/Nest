import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
// This file is used to test the AuthService
// describe run the test in the name of the 'AuthService'

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // creating the fake users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    // creating a temporary DI container
    // authservice depends on the users service
    // so we need to provide the fake users service
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    //   creating an instance of the auth service
    // and injecting the dependencies
    service = module.get(AuthService);
  });

  it('it can create the instances of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('It create the new user with hashed and salted password', async () => {
    const user = await service.signup('as@gmail.com', 'abcd');

    expect(user.password).not.toEqual('abcd');
    const [salt, password] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(password).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('ahdfnd@gmail.com', '23243')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '23' } as User]);

    await expect(service.signin('jddm@gmail.com', 'nsndjsn')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'test@gmail.com',
          password:
            '6bf460a49c391d6a.9b33e0e90d627eca9fd6b6cee15208715d4b0525049bdb781569c61b34d064da',
        } as User,
      ]);

    // const user = await service.signup('test@gmail.com', 'test123');
    // console.log(user);
    const user = service.signin('test@gmail.com', 'test123');
    await expect(user).toBeDefined();
  });
});
