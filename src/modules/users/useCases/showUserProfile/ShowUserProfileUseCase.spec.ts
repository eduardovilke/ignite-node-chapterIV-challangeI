import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show User Profile Use Case', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to show profile an user', async () => {
    const user = {
      name: 'user',
      email: 'email@test.com.br',
      password: '1234'
    }

    const userCreated = await createUserUseCase.execute(user);

    const profile = await showUserProfileUseCase.execute(userCreated.id as string)

    expect(profile).toHaveProperty('id')
    expect(profile.id).toBe(userCreated.id)
  })

  it('Should not be able to show profile if user not exists', async () => {
    expect(async () => {
      const user = {
        id: 'some-id',
        name: 'user',
        email: 'emailprofile@test.com.br',
        password: '1234'
      }
  
      await showUserProfileUseCase.execute(user.id as string)
    }).rejects.toBeInstanceOf(AppError)
  })
})