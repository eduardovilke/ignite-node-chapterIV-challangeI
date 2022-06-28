import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from "./GetBalanceError";

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get balance use case',  () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it('Should be able to return a balance of an user!', async () => {
    const user = {
      name: 'username',
      email: 'email@test.com',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: 'test description'
    })

    const balance = await getBalanceUseCase.execute({ user_id: userCreated.id as string })

    expect(balance).toHaveProperty('statement');
    expect(balance).toHaveProperty('balance');
    expect(balance.statement.length).toBe(1);
  })

  it('Should not be able return balance if user not exists!', () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: '12345678910' })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})