const makeAuthUseCase = require('./auth-use-case')
const MissingParamError = require('../../utils/errors/missing-param-error')

const makeLoadUsuarioPorEmail = (usuario) => {
  return jest.fn(async (email) => {
    return usuario
  })
}

const makeEncrypterCompareSpy = (isPasswordValid = true) => {
  return jest.fn(async (senha, hashSenha) => {
    return isPasswordValid
  })
}

const makeSut = (params = { usuario: { senha: 'hash_senha' } }) => {
  const loadUsuarioPorEmail = makeLoadUsuarioPorEmail(params.usuario)
  const encrypterCompareSpy = makeEncrypterCompareSpy()
  return {
    authUseCase: makeAuthUseCase(loadUsuarioPorEmail, encrypterCompareSpy),
    loadUsuarioPorEmail,
    encrypterCompareSpy,
    params
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

  test('Chama o loadUsuarioPorEmail corretamente', async () => {
    const { authUseCase, loadUsuarioPorEmail } = makeSut()
    await authUseCase('email', 'senha')
    expect(loadUsuarioPorEmail.mock.calls[0][0]).toBe('email')
  })

  test('Retorna erro se loadUsuarioPorEmail não for passado', () => {
    const authUseCase = makeAuthUseCase()
    const response = authUseCase('email', 'senha')
    expect(response).rejects.toThrow(new MissingParamError('loadUsuarioPorEmail'))
  })

  test('Retorna nulo se receber email inválido', async () => {
    const { authUseCase } = makeSut({ user: null })
    const response = await authUseCase('email_invalido', 'senha')
    expect(response).toBeNull()
  })

  test('Retorna nulo se receber senha inválida', async () => {
    const { authUseCase } = makeSut()
    const response = await authUseCase('email_valido', 'senha_invalida')
    expect(response).toBeNull()
  })

  test('Chama encrypter com valores corretos', async () => {
    const { authUseCase, encrypterCompareSpy, params } = makeSut()
    await authUseCase('email_valido', 'senha')
    expect(encrypterCompareSpy.mock.calls[0][0]).toBe('senha')
    expect(encrypterCompareSpy.mock.calls[0][1]).toBe(params.usuario.senha)
  })
})
