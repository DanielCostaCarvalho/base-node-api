const makeAuthUseCase = require('./auth-use-case')

const makeSut = () => {
  return {
    authUseCase: makeAuthUseCase()
  }
}

describe('Auth use case', () => {
  test('Lança erro se não for passado email', () => {
    const { authUseCase } = makeSut()
    const promiseAcessToken = authUseCase()
    expect(promiseAcessToken).rejects.toThrow()
  })
})
