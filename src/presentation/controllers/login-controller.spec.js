const makeLoginController = require('./login-controller')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')

const makeAuthUseCaseSpy = (accessToken) => {
  return jest.fn(async (email, senha) => {
    return accessToken
  })
}

const makeSut = (params = { accessToken: 'valid_token' }) => {
  const authUseCaseSpy = makeAuthUseCaseSpy(params.accessToken)

  return {
    loginController: makeLoginController(authUseCaseSpy),
    authUseCaseSpy
  }
}

describe('Login controller', () => {
  test('Retorna 400 se não for enviado email', async () => {
    const { loginController } = makeSut()
    const httpRequest = {
      body: {
        senha: 'senha'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Retorna 400 se não for enviada senha', async () => {
    const { loginController } = makeSut()
    const httpRequest = {
      body: {
        email: 'email_qualquer'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('senha'))
  })

  test('Retorna 500 se não for passado request', async () => {
    const { loginController } = makeSut()

    const response = await loginController()

    expect(response.statusCode).toBe(500)
  })

  test('Retorna 500 se for passado um request sem body', async () => {
    const { loginController } = makeSut()
    const httpRequest = {}

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(500)
  })

  test('Chama o AuthUseCase com os parâmetros corretos', async () => {
    const { loginController, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'email_qualquer',
        senha: 'senha'
      }
    }

    await loginController(httpRequest)

    expect(authUseCaseSpy.mock.calls[0][0]).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.mock.calls[0][1]).toBe(httpRequest.body.senha)
  })

  test('Retorna 401 com credenciais inválidas como entrada', async () => {
    const { loginController } = makeSut({ accessToken: null })
    const httpRequest = {
      body: {
        email: 'email_invalido',
        senha: 'senha_invalida'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual(new UnauthorizedError())
  })

  test('Retorna 500 se não for passado um auth', async () => {
    const loginController = makeLoginController()
    const httpRequest = {
      body: {
        email: 'email_qualquer',
        senha: 'senha'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(500)
  })

  test('Retorna 200 com credenciais válidas como entrada', async () => {
    const { loginController } = makeSut()
    const httpRequest = {
      body: {
        email: 'email_valido',
        senha: 'senha_valida'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body.accessToken).toBe('valid_token')
  })
})
