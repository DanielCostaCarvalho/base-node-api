const makeLoginController = require('./login-controller')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const InvalidParamError = require('../helpers/invalid-param-error')

const makeAuthUseCaseSpy = (accessToken = 'valid_token') => {
  return jest.fn(async (email, senha) => {
    return accessToken
  })
}

const makeEmailValidatorSpy = (valid = true) => {
  return jest.fn(email => {
    return valid
  })
}

const makeSut = (params = { accessToken: 'valid_token', emailIsValid: true }) => {
  const authUseCaseSpy = makeAuthUseCaseSpy(params.accessToken)
  const emailValidatorSpy = makeEmailValidatorSpy(params.emailIsValid)

  return {
    loginController: makeLoginController(authUseCaseSpy, emailValidatorSpy),
    authUseCaseSpy,
    emailValidatorSpy
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

  test('Retorna 400 se for enviado email invalido', async () => {
    const { loginController } = makeSut({ emailIsValid: false })
    const httpRequest = {
      body: {
        email: 'email_invalido',
        senha: 'senha'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('Retorna 500 se não for passado um emailValidator', async () => {
    const loginController = makeLoginController(makeAuthUseCaseSpy())

    const httpRequest = {
      body: {
        email: 'email_valido',
        senha: 'senha'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(500)
  })
})
