import { InMemoryStatementsRepository } from ".././../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create Statement Use Case', () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('Should be able to create a deposit statement', async () => {
    const user = {
      name: 'name deposit',
      email: 'deposit@test.com.br',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute(user)

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: 'some-description'
    })

    expect(statementCreated).toHaveProperty('id');
    expect(statementCreated.type).toBe('deposit');
    expect(statementCreated.amount).toBe(statementCreated.amount);
  })

  it('Should be able to create a withdraw statement', async () => {
    const user = {
      name: 'name withdraw',
      email: 'withdraw@test.com.br',
      password: '12345'
    }

    const userCreated = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: 'some-description'
    })

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: OperationType.WITHDRAW,
      amount: 2000,
      description: 'some-description'
    })

    expect(statementCreated).toHaveProperty('id');
    expect(statementCreated.type).toBe('withdraw');
    expect(statementCreated.amount).toBe(statementCreated.amount);
  })

  it('Should not be able to make a withdrawal if the account does not have enough balance', async () => {
    expect(async () => {
      const user = {
        name: 'name withdraw',
        email: 'withdrawnomoney@test.com.br',
        password: '12345'
      }
  
      const userCreated = await createUserUseCase.execute(user);
  
      await createStatementUseCase.execute({
        user_id: userCreated.id as string,
        type: OperationType.WITHDRAW,
        amount: 2000,
        description: 'some-description'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a statement with no user', () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '123',
        type: OperationType.WITHDRAW,
        amount: 2000,
        description: 'some-description'
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})