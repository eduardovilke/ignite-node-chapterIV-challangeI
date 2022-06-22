import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User Use Case', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to create a new user', async () => {
    const user = {
      name: 'userTest',
      email: 'test@test.com',
      password: 'test1234'
    }

    const userCreated = await createUserUseCase.execute(user);
    
    expect(userCreated).toHaveProperty('id');
  })

  it('Should not be able to create user if email already exists', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'userTest',
        email: 'test@test.com',
        password: 'test1234'
      });
      await createUserUseCase.execute({
        name: 'userAnotherTest',
        email: 'test@test.com',
        password: 'test123456789'
      });
    }).rejects.toBeInstanceOf(AppError)
  })
})