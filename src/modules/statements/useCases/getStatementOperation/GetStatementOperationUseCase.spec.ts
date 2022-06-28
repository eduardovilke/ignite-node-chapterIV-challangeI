import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Get Statement Operation Use Case', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it('Should be able return statement', async () => {
    const user = {
      name: 'username',
      email: 'email@test.com',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute(user);

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 5000,
      description: 'test description'
    })

    const statement = await getStatementOperationUseCase.execute({
      user_id: userCreated.id as string,
      statement_id: statementCreated.id as string
    })

    expect(statement.id).toBe(statementCreated.id);
    expect(statement.user_id).toBe(userCreated.id);
  })

  it('Should not be able return statement if user not exists', () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: '1233423412',
        statement_id: '123134245324'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('Should not be able return statement if statement not exists', () => {
    expect(async () => {
      const user = {
        name: 'no user',
        email: 'nouser@test.com',
        password: '123'
      }
      
      const userCreated = await createUserUseCase.execute(user);

      await getStatementOperationUseCase.execute({
        user_id: userCreated.id as string,
        statement_id: '65sd4fa65sd'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
