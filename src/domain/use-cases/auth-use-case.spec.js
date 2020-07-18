const makeAuthUseCase = require('./auth-use-case')
const MissingParamError = require('../../utils/errors/missing-param-error')

const makeSut = () => {
  return {
    authUseCase: makeAuthUseCase()
  }
}

describe('Auth use case', () => {
  test('Lança erro se não for passado email', () => {
    const { authUseCase } = makeSut()
    const promiseAcessToken = authUseCase()
    expect(promiseAcessToken).rejects.toThrow(new MissingParamError('email'))
  })

  test('Lança erro se não for passada senha', () => {
    const { authUseCase } = makeSut()
    const promiseAcessToken = authUseCase('email')
    expect(promiseAcessToken).rejects.toThrow(new MissingParamError('senha'))
  })
})
