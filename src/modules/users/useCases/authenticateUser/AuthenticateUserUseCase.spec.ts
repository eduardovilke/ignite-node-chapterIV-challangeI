import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User Use Case', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to authenticate an user', async () => {
    const user = {
      name: 'userTest',
      email: 'test@test.com.br',
      password: '12345678'
    }

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({ 
      email: user.email, 
      password: user.password 
    })

    expect(userAuthenticated.user).toHaveProperty('id')
    expect(userAuthenticated.user.email).toBe(user.email)
    expect(userAuthenticated).toHaveProperty('token')
  })

  it('Should not be able to authenticate an user if user not exists', () => {
    expect(async () => {
      const user = {
        name: 'user',
        email: 'email@test.com.br',
        password: '12345'
      }
  
      await authenticateUserUseCase.execute({ 
        email: user.email, 
        password: user.password 
      })
    }
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to authenticate an user if password incorrect', () => {
    expect(async () => {
      const user = {
        name: 'userP',
        email: 'emailpass@test.com.br',
        password: '123456789'
      }

      await createUserUseCase.execute(user);
  
      await authenticateUserUseCase.execute({ 
        email: user.email, 
        password: '123' 
      })
    }
    ).rejects.toBeInstanceOf(AppError)
  })
})