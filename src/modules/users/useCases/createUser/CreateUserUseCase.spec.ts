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
})