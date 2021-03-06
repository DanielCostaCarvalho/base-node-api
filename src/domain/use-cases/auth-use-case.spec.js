const makeAuthUseCase = require('./auth-use-case')
const MissingParamError = require('../../utils/errors/missing-param-error')

const usuarioValido = { id: 1, senha: 'hash_senha' }

const makeLoadUsuarioPorEmailWithError = (usuario = usuarioValido) => {
  return jest.fn(async (email) => {
    throw new Error()
  })
}

const makeEncrypterCompareWithError = (isPasswordValid = true) => {
  return jest.fn(async (senha, hashSenha) => {
    throw new Error()
  })
}

const makeTokenGeneratorWithError = () => {
  return jest.fn(async (params) => {
    throw new Error()
  })
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  return jest.fn(async (userId, AcessToken) => {
    throw new Error()
  })
}
const makeLoadUsuarioPorEmail = (usuario = usuarioValido) => {
  return jest.fn(async (email) => {
    return usuario
  })
}

const makeEncrypterCompareSpy = (isPasswordValid = true) => {
  return jest.fn(async (senha, hashSenha) => {
    return isPasswordValid
  })
}

const makeTokenGeneratorSpy = (token = 'token') => {
  return jest.fn(async (params) => {
    return token
  })
}

const makeUpdateAccessTokenRepositorySpy = () => {
  return jest.fn(async (userId, AcessToken) => {
  })
}

const makeSut = (params = { usuario: usuarioValido, isPasswordValid: true, token: 'token' }) => {
  const loadUsuarioPorEmail = makeLoadUsuarioPorEmail(params.usuario)
  const encrypterCompareSpy = makeEncrypterCompareSpy(params.isPasswordValid)
  const tokenGeneratorSpy = makeTokenGeneratorSpy(params.token)
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()

  return {
    authUseCase: makeAuthUseCase({ loadUsuarioPorEmail: loadUsuarioPorEmail, encrypterCompare: encrypterCompareSpy, tokenGenerator: tokenGeneratorSpy, updateAccessTokenRepository: updateAccessTokenRepositorySpy }),
    loadUsuarioPorEmail,
    encrypterCompareSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
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

  test('Retorna erro se nada for passado', () => {
    const authUseCase = makeAuthUseCase()
    const response = authUseCase('email', 'senha')
    expect(response).rejects.toThrow(new MissingParamError('loadUsuarioPorEmail'))
  })

  test('Retorna erro se loadUsuarioPorEmail não for passado', () => {
    const authUseCase = makeAuthUseCase({})
    const response = authUseCase('email', 'senha')
    expect(response).rejects.toThrow(new MissingParamError('loadUsuarioPorEmail'))
  })

  test('Retorna nulo se receber email inválido', async () => {
    const { authUseCase } = makeSut({ usuario: null })
    const response = await authUseCase('email_invalido', 'senha')
    expect(response).toBeNull()
  })

  test('Retorna nulo se receber senha inválida', async () => {
    const { authUseCase } = makeSut({ isPasswordValid: false })
    const response = await authUseCase('email_valido', 'senha_invalida')
    expect(response).toBeNull()
  })

  test('Chama encrypter com valores corretos', async () => {
    const { authUseCase, encrypterCompareSpy, params } = makeSut()
    await authUseCase('email_valido', 'senha')
    expect(encrypterCompareSpy.mock.calls[0][0]).toBe('senha')
    expect(encrypterCompareSpy.mock.calls[0][1]).toBe(params.usuario.senha)
  })

  test('Chama tokenGenerator com valores corretos', async () => {
    const { authUseCase, tokenGeneratorSpy, params } = makeSut()
    await authUseCase('email_valido', 'senha_valida')
    expect(tokenGeneratorSpy.mock.calls[0][0]).toEqual({ userId: params.usuario.id })
  })

  test('Gera token com entrada válida', async () => {
    const { authUseCase } = makeSut()
    const retorno = await authUseCase('email_valido', 'senha')
    expect(retorno).toBeTruthy()
  })

  test('Retorna erro se encrypterCompare não for passado', () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmail() })
    const response = authUseCase('email', 'senha')
    expect(response).rejects.toThrow(new MissingParamError('encrypterCompare'))
  })

  test('Retorna erro se tokenGenerator não for passado', () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmail(), encrypterCompare: makeEncrypterCompareSpy() })
    const response = authUseCase('email', 'senha')
    expect(response).rejects.toThrow(new MissingParamError('tokenGenerator'))
  })

  test('Retorna erro se tokenGenerator lançar erro', async () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmail(), encrypterCompare: makeEncrypterCompareSpy(), tokenGenerator: makeTokenGeneratorWithError(), updateAccessTokenRepository: makeUpdateAccessTokenRepositorySpy() })
    const response = authUseCase('email', 'senha')
    await expect(response).rejects.toThrow(new Error())
  })

  test('Retorna erro se encrypter lançar erro', async () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmail(), encrypterCompare: makeEncrypterCompareWithError(), tokenGenerator: makeTokenGeneratorSpy(), updateAccessTokenRepository: makeUpdateAccessTokenRepositorySpy() })
    const response = authUseCase('email', 'senha')
    await expect(response).rejects.toThrow(new Error())
  })

  test('Retorna erro se loadUsuarioPorEmail lançar erro', async () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmailWithError(), encrypterCompare: makeEncrypterCompareSpy(), tokenGenerator: makeTokenGeneratorSpy(), updateAccessTokenRepository: makeUpdateAccessTokenRepositorySpy() })
    const response = authUseCase('email', 'senha')
    await expect(response).rejects.toThrow(new Error())
  })

  test('Chama updateAccessTokenRepository com valores corretos', async () => {
    const { authUseCase, params, updateAccessTokenRepositorySpy } = makeSut()
    await authUseCase('email_valido', 'senha_valida')
    expect(updateAccessTokenRepositorySpy.mock.calls[0][0]).toEqual(params.usuario.id)
    expect(updateAccessTokenRepositorySpy.mock.calls[0][1]).toEqual(params.token)
  })

  test('Retorna erro se updateAccessTokenRepository lançar erro', async () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmail(), encrypterCompare: makeEncrypterCompareSpy(), tokenGenerator: makeTokenGeneratorSpy(), updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError() })
    const response = authUseCase('email', 'senha')
    await expect(response).rejects.toThrow(new Error())
  })

  test('Retorna erro se updateAccessTokenRepository não for passado', async () => {
    const authUseCase = makeAuthUseCase({ loadUsuarioPorEmail: makeLoadUsuarioPorEmail(), encrypterCompare: makeEncrypterCompareSpy(), tokenGenerator: makeTokenGeneratorSpy() })
    const response = authUseCase('email', 'senha')
    await expect(response).rejects.toThrow(new MissingParamError('updateAccessTokenRepository'))
  })
})
